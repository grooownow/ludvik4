import { z } from "zod";

// Telegram is unreachable from Yandex Cloud, so the order function sends its
// signal through this relay on Vercel (cloud/telegram-relay/). The relay keeps
// no secrets: the bot token comes with the request, and only @ludvik4bot's
// token is accepted, so it is no open proxy for other bots.
// The signal carries no personal data (docs/specs/order-form-ru.md).

/** The numeric id of @ludvik4bot: the public part of its token. */
export const RELAY_BOT_ID = "8780616592";

const relaySchema = z
  .object({
    token: z.string().regex(new RegExp(`^${RELAY_BOT_ID}:[A-Za-z0-9_-]{30,}$`)),
    chat_id: z.string().regex(/^-?\d{1,20}$/),
    text: z.string().min(1).max(500),
  })
  .strict();

function json(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status });
}

export async function relayTelegram(
  request: Request,
  fetcher: typeof fetch = fetch,
): Promise<Response> {
  if (request.method !== "POST") return json(405, { ok: false });

  const raw: unknown = await request.json().catch(() => null);
  const parsed = relaySchema.safeParse(raw);
  if (!parsed.success) return json(400, { ok: false });
  const { token, chat_id, text } = parsed.data;

  try {
    const response = await fetcher(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id, text }),
        signal: AbortSignal.timeout(5000),
      },
    );
    // Telegram's own description ("chat not found"…) helps the trace; it
    // never contains the token.
    const telegram = (await response.json().catch(() => null)) as {
      description?: string;
    } | null;
    return json(response.ok ? 200 : 502, {
      ok: response.ok,
      telegram: response.status,
      ...(telegram?.description ? { description: telegram.description } : {}),
    });
  } catch (error) {
    return json(504, { ok: false, error: String(error) });
  }
}
