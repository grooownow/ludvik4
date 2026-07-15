import "server-only";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Verify a Cloudflare Turnstile token server-side.
 *
 * When no secret is configured (local dev / preview before the captcha is set
 * up) verification is skipped and returns `true` — the form stays usable. Once
 * `TURNSTILE_SECRET_KEY` is set, a missing or invalid token is rejected, and a
 * network error fails closed (returns `false`) so a broken check can never wave
 * a bot through silently.
 */
export async function verifyTurnstile(
  token: string,
  ip: string,
): Promise<boolean> {
  const secret = env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured — skip
  if (!token) return false;

  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    logger.error({ err }, "turnstile: verify request failed");
    return false;
  }
}
