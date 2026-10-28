import type { OrderConfig } from "@/features/order";
import { TELEGRAM_URL } from "./content";

/** The RU mailbox that receives orders (Yandex, data stays in Russia). */
export const ORDER_EMAIL = "ludvik4go@yandex.com";

/**
 * The order form's settings, or undefined while the form is not configured
 * (no function URL or captcha key) — then "Заказать" leads to /contact.
 */
export function orderConfig(
  endpoint: string | undefined,
  captchaSiteKey: string | undefined,
): OrderConfig | undefined {
  if (!endpoint || !captchaSiteKey) return undefined;
  return {
    endpoint,
    captchaSiteKey,
    telegramUrl: TELEGRAM_URL,
    email: ORDER_EMAIL,
  };
}
