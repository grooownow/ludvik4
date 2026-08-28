"use server";

import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { leadSchema } from "./lead-schema";
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
      error: "Too many requests in a row — wait a minute and try again.",
      reason: "rate_limit",
      values,
    };
  }

  const parsed = leadSchema.safeParse(values);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Проверьте поля формы.",
      reason: "validation",
      values,
    };
  }

  const token = String(formData.get("cf-turnstile-response") ?? "");
  if (!(await verifyTurnstile(token, ip))) {
    return {
      error:
        "Не прошла проверка «я не робот». Обновите страницу и попробуйте снова.",
      reason: "captcha",
      values,
    };
  }

  if (!(await deliverLead(parsed.data))) {
    return {
      error:
        "Could not send the request. Message me directly on Telegram: t.me/ludvik4work",
      reason: "delivery",
      values,
    };
  }

  logger.info("lead: delivered");
  return { ok: true };
}
