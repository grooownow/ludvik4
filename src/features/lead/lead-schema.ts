import { z } from "zod";

export const NAME_MAX = 100;
export const MESSAGE_MIN = 10;
export const MESSAGE_MAX = 2000;
export const CONTACT_MAX = 200;

/**
 * A usable reply channel: an email, a URL / messenger link (with or without
 * scheme for `t.me`), a Telegram `@handle`, or a string with enough digits to
 * be a phone number. Kept deliberately permissive — the point is to reject
 * obvious junk ("hi"), not to canonicalise every valid contact form.
 */
export function isValidContact(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  if (z.email().safeParse(v).success) return true; // email
  if (/^https?:\/\//i.test(v)) return true; // any url (messenger link)
  if (/t\.me\//i.test(v)) return true; // telegram link without scheme
  if (/^@[a-z0-9_]{3,}$/i.test(v)) return true; // @telegram_handle
  if (v.replace(/\D/g, "").length >= 7) return true; // phone (>= 7 digits)
  return false;
}

export const leadSchema = z.object({
  name: z.string().trim().max(NAME_MAX, "Слишком длинное имя.").default(""),
  message: z
    .string()
    .trim()
    .min(MESSAGE_MIN, "Опишите задачу подробнее — хотя бы пару предложений.")
    .max(MESSAGE_MAX, "Слишком длинно — сократите, пожалуйста."),
  contact: z
    .string()
    .trim()
    .min(1, "Оставьте контакт для ответа.")
    .max(CONTACT_MAX, "Слишком длинный контакт.")
    .refine(
      isValidContact,
      "Укажите email или ссылку на мессенджер / телефон.",
    ),
});

export type Lead = z.infer<typeof leadSchema>;
