import { z } from "zod";

const orderParams = z.object({
  service: z.string().regex(/^[a-z-]{1,40}$/),
  package: z
    .string()
    .regex(/^[a-z]{1,20}$/)
    .optional(),
});

/**
 * The message an "Order" link asks for (/contact?service=&package=), or
 * undefined. Only known keys resolve to text: the URL never reaches the form.
 */
export function orderPrefillMessage(
  search: string,
  prefills: Record<string, string>,
): string | undefined {
  const parsed = orderParams.safeParse(
    Object.fromEntries(new URLSearchParams(search)),
  );
  if (!parsed.success) return undefined;
  const { service, package: pack } = parsed.data;
  const key = pack ? `${service}/${pack}` : service;
  return Object.hasOwn(prefills, key) ? prefills[key] : undefined;
}
