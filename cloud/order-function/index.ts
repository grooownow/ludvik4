import { createTransport } from "nodemailer";
import {
  createRateLimiter,
  handleOrder,
  type FunctionEvent,
} from "../../src/features/order/server/handle-order";

// Entry point of the Yandex Cloud function that receives orders from the
// /uslugi form. The rules live in src/features/order/server/handle-order.ts;
// this file only wires the real services. Build: `pnpm order:build`.
// Deploy: docs/playbooks/order-form-yandex-cloud.md.
//
// Environment (secrets come from Lockbox):
//   SMTP_USER, SMTP_PASSWORD   — the Yandex mailbox and its app password
//   ORDER_EMAIL_TO             — where orders go (defaults to SMTP_USER)
//   SMARTCAPTCHA_SERVER_KEY    — SmartCaptcha server key
//   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID — the signal bot (optional)
//   TELEGRAM_RELAY_URL         — the relay on Vercel (Telegram is blocked here)
//   ALLOWED_ORIGINS            — comma-separated, e.g. https://ludvik4.ru

const env = process.env;

const transport = createTransport({
  host: "smtp.yandex.ru",
  port: 465,
  secure: true,
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
});

// Per instance: the function's scaling limit caps the number of instances.
const rateLimited = createRateLimiter(5, 10 * 60 * 1000);

export async function handler(event: FunctionEvent) {
  return handleOrder(event, {
    allowedOrigins: (env.ALLOWED_ORIGINS ?? "https://ludvik4.ru")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean),
    isRateLimited: rateLimited,
    async verifyCaptcha(token, ip) {
      // https://yandex.cloud/ru/docs/smartcaptcha/concepts/validation
      const response = await fetch(
        "https://smartcaptcha.cloud.yandex.ru/validate",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret: env.SMARTCAPTCHA_SERVER_KEY ?? "",
            token,
            ip,
          }),
          signal: AbortSignal.timeout(5000),
        },
      );
      if (!response.ok) return false;
      const result = (await response.json()) as { status?: string };
      return result.status === "ok";
    },
    async sendMail(subject, text) {
      const to = env.ORDER_EMAIL_TO || env.SMTP_USER;
      const info = await transport.sendMail({
        from: `Ludvik4 <${env.SMTP_USER}>`,
        to,
        subject,
        text,
      });
      return `${env.SMTP_USER} -> ${to}; accepted ${info.accepted.join(",")}; rejected ${info.rejected.join(",")}; ${info.response}`;
    },
    async notify(text) {
      if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
        throw new Error("TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is empty");
      }
      // Telegram is unreachable from Yandex Cloud: with TELEGRAM_RELAY_URL
      // set, the signal goes through the relay on Vercel (cloud/telegram-relay/).
      const relay = env.TELEGRAM_RELAY_URL;
      const response = await fetch(
        relay ??
          `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            relay
              ? {
                  token: env.TELEGRAM_BOT_TOKEN,
                  chat_id: env.TELEGRAM_CHAT_ID,
                  text,
                }
              : { chat_id: env.TELEGRAM_CHAT_ID, text },
          ),
          signal: AbortSignal.timeout(6000),
        },
      );
      if (!response.ok) {
        throw new Error(
          `Telegram ${response.status}: ${await response.text()}`,
        );
      }
    },
    // Function logs are whatever reaches stdout.
    log: (message, extra) =>
      process.stdout.write(`${JSON.stringify({ message, extra })}\n`),
  });
}
