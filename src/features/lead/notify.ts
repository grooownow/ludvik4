import "server-only";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import type { Lead } from "./lead-schema";

function formatLines(lead: Lead): string[] {
  return [
    "Новая заявка — Ludvik4",
    "",
    lead.name ? `Имя: ${lead.name}` : "Имя: —",
    `Контакт: ${lead.contact}`,
    "",
    "Задача:",
    lead.message,
  ];
}

/**
 * Deliver a lead to Telegram. Returns `null` when the channel is not configured
 * (so the caller can tell "not set up" from "failed"), `true`/`false` otherwise.
 */
async function sendTelegram(lead: Lead): Promise<boolean | null> {
  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return null;

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: formatLines(lead).join("\n"),
          disable_web_page_preview: true,
        }),
      },
    );
    if (!res.ok) {
      logger.error({ status: res.status }, "lead: telegram delivery failed");
      return false;
    }
    return true;
  } catch (err) {
    logger.error({ err }, "lead: telegram delivery threw");
    return false;
  }
}

/** Deliver a lead by email via Resend. Same null/true/false contract as above. */
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
        subject: "Новая заявка — Ludvik4",
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
 * Deliver a lead through every configured channel. Succeeds if at least one
 * channel accepts it. When NO channel is configured, returns `true` outside
 * production (so the form works in local/preview) but `false` in production —
 * a lead must never be silently dropped on the live site.
 */
export async function deliverLead(lead: Lead): Promise<boolean> {
  const outcomes = (
    await Promise.all([sendTelegram(lead), sendEmail(lead)])
  ).filter((r): r is boolean => r !== null);

  if (outcomes.length === 0) {
    // No channel wired up. In dev/preview, log the lead so it is visible while
    // testing and let the form report success. In production, never log the
    // submitter's contact/message (PII) — record only the misconfiguration and
    // fail, so the visitor is told to reach out via Telegram instead.
    if (env.NODE_ENV !== "production") {
      logger.warn(
        { name: lead.name, contact: lead.contact, message: lead.message },
        "lead: no delivery channel configured — logged only (dev), not delivered",
      );
      return true;
    }
    logger.error(
      "lead: no delivery channel configured — submission not delivered",
    );
    return false;
  }
  return outcomes.some(Boolean);
}
