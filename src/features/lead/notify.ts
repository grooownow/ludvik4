import "server-only";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import type { Lead } from "./lead-schema";

function formatLines(lead: Lead): string[] {
  return [
    "New enquiry — Ludvik4",
    "",
    lead.name ? `Name: ${lead.name}` : "Name: —",
    `Contact: ${lead.contact}`,
    "",
    "Project:",
    lead.message,
  ];
}

/** Deliver a lead by email via Resend. */
async function sendEmail(lead: Lead): Promise<boolean | null> {
  const key = env.RESEND_API_KEY;
  const to = env.LEAD_EMAIL_TO;
  const from = env.LEAD_EMAIL_FROM;
  if (!key || !to || !from) return null;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: "New enquiry — Ludvik4",
        text: formatLines(lead).join("\n"),
      }),
    });
    if (!res.ok) {
      logger.error({ status: res.status }, "lead: email delivery failed");
      return false;
    }
    return true;
  } catch (err) {
    logger.error({ err }, "lead: email delivery threw");
    return false;
  }
}

/**
 * Deliver a lead by email only. When email is not configured, return `true`
 * outside production so local previews remain usable, but fail in production:
 * a live lead must never be silently dropped.
 */
export async function deliverLead(lead: Lead): Promise<boolean> {
  const outcome = await sendEmail(lead);

  if (outcome === null) {
    // In dev/preview, log the lead so it is visible while testing. Production
    // never logs the submitter's contact/message (PII) and reports failure.
    if (env.NODE_ENV !== "production") {
      logger.warn(
        { name: lead.name, contact: lead.contact, message: lead.message },
        "lead: email delivery not configured — logged only (dev), not delivered",
      );
      return true;
    }
    logger.error(
      "lead: email delivery not configured — submission not delivered",
    );
    return false;
  }
  return outcome;
}
