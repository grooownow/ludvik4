import { relayTelegram } from "../../../src/features/order/server/telegram-relay";

// Vercel function: POST /api/telegram. Logic and tests live in
// src/features/order/server/telegram-relay.ts. Build and deploy:
// docs/playbooks/order-form-yandex-cloud.md → «Посредник для Telegram».

export function POST(request: Request) {
  return relayTelegram(request);
}
