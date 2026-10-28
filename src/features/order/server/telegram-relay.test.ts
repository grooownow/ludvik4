import { describe, expect, it, vi } from "vitest";
import { RELAY_BOT_ID, relayTelegram } from "./telegram-relay";

const TOKEN = `${RELAY_BOT_ID}:AAEabcdefghijklmnopqrstuvwxyz0123`;

function post(body: unknown, method = "POST") {
  return new Request("https://relay.test/api/telegram", {
    method,
    headers: { "Content-Type": "application/json" },
    body: method === "POST" ? JSON.stringify(body) : undefined,
  });
}

describe("relayTelegram", () => {
  it("forwards the signal to the bot's sendMessage", async () => {
    const fetcher = vi.fn(async () => Response.json({ ok: true }));
    const result = await relayTelegram(
      post({ token: TOKEN, chat_id: "563", text: "Новая заявка" }),
      fetcher,
    );
    expect(result.status).toBe(200);
    expect(await result.json()).toEqual({ ok: true, telegram: 200 });
    const [url, init] = fetcher.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url).toBe(`https://api.telegram.org/bot${TOKEN}/sendMessage`);
    expect(JSON.parse(String(init.body))).toEqual({
      chat_id: "563",
      text: "Новая заявка",
    });
  });

  it("refuses another bot's token, so it is no open proxy", async () => {
    const fetcher = vi.fn();
    const result = await relayTelegram(
      post({
        token: "1111111111:AAEabcdefghijklmnopqrstuvwxyz0123",
        chat_id: "563",
        text: "spam",
      }),
      fetcher,
    );
    expect(result.status).toBe(400);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("refuses anything but POST", async () => {
    const result = await relayTelegram(post(null, "GET"), vi.fn());
    expect(result.status).toBe(405);
  });

  it("passes Telegram's error description back, without the token", async () => {
    const fetcher = vi.fn(async () =>
      Response.json(
        { ok: false, description: "Bad Request: chat not found" },
        { status: 400 },
      ),
    );
    const result = await relayTelegram(
      post({ token: TOKEN, chat_id: "1", text: "x" }),
      fetcher,
    );
    expect(result.status).toBe(502);
    const body = await result.json();
    expect(body.description).toBe("Bad Request: chat not found");
    expect(JSON.stringify(body)).not.toContain(TOKEN);
  });
});
