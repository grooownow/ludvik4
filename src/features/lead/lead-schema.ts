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
  name: z.string().trim().max(NAME_MAX, "Name is too long.").default(""),
  message: z
    .string()
    .trim()
    .min(
      MESSAGE_MIN,
      "Tell me a bit more about the task — at least a couple of sentences.",
    )
    .max(MESSAGE_MAX, "Too long — please shorten it a bit."),
  contact: z
    .string()
    .trim()
    .min(1, "Leave a contact so I can reply.")
    .max(CONTACT_MAX, "Contact is too long.")
    .refine(
      isValidContact,
      "Enter an email, a messenger link, or a phone number.",
    ),
});

export type Lead = z.infer<typeof leadSchema>;
