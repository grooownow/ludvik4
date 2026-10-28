import { z } from "zod";

// The order request: what the /uslugi "Заказать" form sends to the Yandex
// Cloud function. The function imports this same schema at bundle time
// (cloud/order-function/), so the client and the server check one contract.
// Spec: docs/specs/order-form-ru.md.

export const CONTACT_MAX = 200;
export const NAME_MAX = 100;
export const COMMENT_MAX = 1000;
/** A form sent sooner than this after opening is a bot. */
export const MIN_FILL_MS = 3000;

export const ORDER_CHANNELS = ["telegram", "call", "email"] as const;
export type OrderChannel = (typeof ORDER_CHANNELS)[number];

export const CHANNEL_LABELS: Record<OrderChannel, string> = {
  telegram: "Telegram",
  call: "Звонок",
  email: "Почта",
};

/**
 * A usable reply channel: an email, a link, a Telegram @handle, or enough
 * digits to be a phone. Loose on purpose — it rejects junk, not odd formats.
 */
export function isValidContact(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  if (z.email().safeParse(v).success) return true;
  if (/^https?:\/\//i.test(v)) return true;
  if (/^(t\.me|vk\.com)\//i.test(v)) return true;
  if (/^@[a-z0-9_]{3,}$/i.test(v)) return true;
  if (v.replace(/\D/g, "").length >= 7) return true;
  return false;
}

const LINK_RE = /\bhttps?:\/\/|\bwww\.|\b[\w-]+\.[a-z]{2,}\b/i;

// Service, package and price come from the page, not from the visitor, but a
// bot can send anything — and the topic goes into the Telegram signal and the
// mail subject. So: one line of plain words and prices, no links.
const LABEL_RE = /^[\p{L}\p{N} \u00a0\u202f.,()+\-–—·₽/]*$/u;
const label = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .regex(LABEL_RE)
    .refine((v) => !LINK_RE.test(v))
    .default("");

export const orderSchema = z.object({
  /** Empty when the visitor pressed "Обсудить проект" rather than a package. */
  service: label(80),
  plan: label(40),
  price: label(40),
  /** The page the form was sent from: a path on the site. */
  page: z
    .string()
    .trim()
    .max(200)
    .regex(/^(\/[\w\-./%]*)?$/)
    .default(""),
  contact: z
    .string()
    .trim()
    .min(1, "Оставьте контакт, чтобы мы могли ответить.")
    .max(CONTACT_MAX, "Слишком длинный контакт.")
    .refine(isValidContact, "Укажите телефон, @ник, почту или ссылку."),
  channel: z.enum(ORDER_CHANNELS).optional(),
  name: z
    .string()
    .trim()
    .max(NAME_MAX, "Слишком длинное имя.")
    .refine((v) => !LINK_RE.test(v), "Имя не может быть ссылкой.")
    .default(""),
  comment: z
    .string()
    .trim()
    .max(COMMENT_MAX, "Комментарий длиннее 1000 символов.")
    .default(""),
  consent: z.literal(true, {
    error: "Нужно согласие на обработку данных.",
  }),
  /** Honeypot: hidden from people, must stay empty. */
  website: z.string().max(200).default(""),
  /** Milliseconds between opening the form and sending it. */
  elapsedMs: z.number().int().nonnegative(),
  captchaToken: z.string().min(1).max(5000),
});

export type OrderRequest = z.infer<typeof orderSchema>;
export type OrderInput = z.input<typeof orderSchema>;

/** What the function answers: ok, or a reason the form can show. */
export type OrderResponse = (
  | { ok: true }
  | { ok: false; reason: "invalid" | "captcha" | "rate" | "server" }
) & {
  /** Delivery details, only while the function runs with ORDER_DEBUG_TRACE=1. */
  trace?: string[];
};
