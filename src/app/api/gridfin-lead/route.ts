import { z } from "zod";
import { deliverLead } from "@/features/lead";
import { logger } from "@/lib/logger";
import { rateLimit } from "@/lib/rate-limit";

const gridfinLeadSchema = z
  .object({
    github: z.string().trim().min(1).max(100),
    email: z.email().max(200),
    role: z.string().trim().max(300).default("-"),
    usage: z.string().trim().min(1).max(500),
    page: z.url().max(500),
    website: z.string().max(200).default(""),
  })
  .strict();

// The Gridfin landing (public/gridfin/*) posts here from the same origin and
// renders no captcha, so every request costs a Resend email. Guards, cheapest
// first: same-origin only (stops other sites' pages and lazy scripts), the
// page link must point back at this site (no foreign links in the mail), a
// per-IP limit, and a cap across all IPs so a botnet cannot drain the Resend
// quota the /contact form depends on. Limits are per instance (src/lib/rate-limit.ts).
const PER_IP = { limit: 5, windowMs: 60_000 };
const ALL_IPS = { limit: 30, windowMs: 60 * 60_000 };

function invalid() {
  return Response.json(
    { ok: false, error: "Invalid request." },
    { status: 400 },
  );
}

export async function POST(request: Request): Promise<Response> {
  const self = new URL(request.url).origin;
  if (request.headers.get("origin") !== self) {
    return Response.json({ ok: false, error: "Forbidden." }, { status: 403 });
  }

  const raw: unknown = await request.json().catch(() => null);
  const parsed = gridfinLeadSchema.safeParse(raw);
  if (!parsed.success || new URL(parsed.data.page).origin !== self) {
    return invalid();
  }

  if (parsed.data.website.trim() !== "") {
    logger.warn("gridfin lead: honeypot triggered — dropped");
    return Response.json({ ok: true });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (
    !rateLimit(`gridfin-lead:${ip}`, PER_IP).allowed ||
    !rateLimit("gridfin-lead:all", ALL_IPS).allowed
  ) {
    return Response.json(
      { ok: false, error: "Too many requests." },
      { status: 429 },
    );
  }

  const delivered = await deliverLead({
    name: `GitHub: ${parsed.data.github}`,
    contact: parsed.data.email,
    message: [
      "Gridfin early access",
      `Role: ${parsed.data.role || "-"}`,
      `Use: ${parsed.data.usage}`,
      `Page: ${parsed.data.page}`,
    ].join("\n"),
  });
  if (!delivered) {
    return Response.json(
      { ok: false, error: "Delivery failed." },
      { status: 502 },
    );
  }

  logger.info("gridfin lead: delivered");
  return Response.json({ ok: true });
}
