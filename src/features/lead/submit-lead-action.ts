"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { LOCALES } from "@/lib/i18n";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { LEAD_MESSAGES } from "./lead-messages";
import { buildLeadSchema } from "./lead-schema";
import { verifyTurnstile } from "./turnstile";
import { deliverLead } from "./notify";

/**
 * Why a submission was rejected, as a stable token rather than a message.
 *
 * The `error` string is copy: it is localized, rewritten, and never safe to
 * group by. This is what analytics reports as `lead.form_failed`'s `reason`,
 * which is the difference between knowing that enquiries fail and knowing that
 * they fail on the captcha.
 */
export type LeadFailureReason =
  "rate_limit" | "validation" | "captcha" | "delivery";

/** State surfaced under the lead form. On failure `values` echoes the input
 * back so a rejected attempt keeps what the visitor typed. */
export interface LeadFormState {
  ok?: boolean;
  error?: string;
  reason?: LeadFailureReason;
  values?: { name: string; message: string; contact: string };
}

/**
 * `useActionState`-shaped handler for the contact form. Security boundary per
 * security.md: honeypot drop → rate-limit by IP → zod validation → Turnstile →
 * delivery. Input is validated with zod before any use (project invariant).
 */
export async function submitLeadAction(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  // The page's language, for the replies below. Anything unexpected falls
  // back to English rather than failing the enquiry.
  const locale = z.enum(LOCALES).catch("en").parse(formData.get("locale"));
  const m = LEAD_MESSAGES[locale];
  const values = {
    name: String(formData.get("name") ?? ""),
    message: String(formData.get("message") ?? ""),
    contact: String(formData.get("contact") ?? ""),
  };

  // Honeypot: real users never see or fill the "website" field. A filled one
  // is a bot — pretend success so it stops retrying, and drop the submission.
  if (String(formData.get("website") ?? "").trim() !== "") {
    logger.warn("lead: honeypot triggered — dropped");
    return { ok: true };
  }

  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    hdrs.get("x-real-ip") ||
    "unknown";

  const limit = rateLimit(`lead:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!limit.allowed) {
    return {
      error: m.rateLimited,
      reason: "rate_limit",
      values,
    };
  }

  const parsed = buildLeadSchema(m).safeParse(values);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? m.checkFields,
      reason: "validation",
      values,
    };
  }

  const token = String(formData.get("cf-turnstile-response") ?? "");
  if (!(await verifyTurnstile(token, ip))) {
    return {
      error: m.captchaFailed,
      reason: "captcha",
      values,
    };
  }

  if (!(await deliverLead({ ...parsed.data, language: locale }))) {
    return {
      error: m.deliveryFailed,
      reason: "delivery",
      values,
    };
  }

  logger.info("lead: delivered");
  return { ok: true };
}
