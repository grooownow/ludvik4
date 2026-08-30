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

/**
 * A link, with or without a scheme: `http://x.y/z`, `www.x.y`, or a bare
 * `x.y` domain-ish token (a dot between two label characters). Loose on
 * purpose — it is a spam heuristic, not a URL parser.
 */
const LINK_RE = /\bhttps?:\/\/\S+|\bwww\.\S+|\b[\w-]+\.[a-z]{2,}(?:\/\S*)?/gi;

function containsLink(value: string): boolean {
  return new RegExp(LINK_RE.source, "i").test(value);
}

/** The message with every link removed — what is left is what the visitor
 * actually wrote about the task. */
function withoutLinks(value: string): string {
  return value.replace(LINK_RE, " ").replace(/\s+/g, " ").trim();
}

const MESSAGE_TOO_SHORT =
  "Tell me a bit more about the task — at least a couple of sentences.";

/**
 * Field rules. Two of them exist because of link spam, the only kind of bot
 * traffic the form has actually received (a bot that POSTs the server action
 * directly never sees the honeypot, and one submission never trips the rate
 * limit): a name is never a link, and the message has to say something once
 * its links are taken out — "Hi <link> Owner" is not an enquiry.
 */
export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .max(NAME_MAX, "Name is too long.")
    .refine((v) => !containsLink(v), "A name cannot be a link.")
    .default(""),
  message: z
    .string()
    .trim()
    .min(MESSAGE_MIN, MESSAGE_TOO_SHORT)
    .max(MESSAGE_MAX, "Too long — please shorten it a bit.")
    .refine((v) => withoutLinks(v).length >= MESSAGE_MIN, MESSAGE_TOO_SHORT),
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
