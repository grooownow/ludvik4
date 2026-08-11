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

export async function POST(request: Request): Promise<Response> {
  const raw: unknown = await request.json().catch(() => null);
  const parsed = gridfinLeadSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  if (parsed.data.website.trim() !== "") {
    logger.warn("gridfin lead: honeypot triggered — dropped");
    return Response.json({ ok: true });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const limit = rateLimit(`gridfin-lead:${ip}`, {
    limit: 5,
    windowMs: 60_000,
  });
  if (!limit.allowed) {
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
