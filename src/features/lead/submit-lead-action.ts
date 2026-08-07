"use server";

import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { leadSchema } from "./lead-schema";
import { verifyTurnstile } from "./turnstile";
import { deliverLead } from "./notify";

/** State surfaced under the lead form. On failure `values` echoes the input
 * back so a rejected attempt keeps what the visitor typed. */
export interface LeadFormState {
  ok?: boolean;
  error?: string;
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
      values,
    };
  }

  const parsed = leadSchema.safeParse(values);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Проверьте поля формы.",
      values,
    };
  }

  const token = String(formData.get("cf-turnstile-response") ?? "");
  if (!(await verifyTurnstile(token, ip))) {
    return {
      error:
        "Не прошла проверка «я не робот». Обновите страницу и попробуйте снова.",
      values,
    };
  }

  if (!(await deliverLead(parsed.data))) {
    return {
      error:
        "Could not send the request. Message me directly on Telegram: t.me/ludvik4work",
      values,
    };
  }

  logger.info("lead: delivered");
  return { ok: true };
}
