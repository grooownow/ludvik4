import { describe, expect, it, vi } from "vitest";
import {
  createRateLimiter,
  handleOrder,
  type FunctionEvent,
  type OrderDeps,
} from "./handle-order";

const ORIGIN = "https://ludvik4.ru";

function deps(overrides: Partial<OrderDeps> = {}): OrderDeps {
  return {
    allowedOrigins: [ORIGIN],
    verifyCaptcha: vi.fn(async () => true),
    sendMail: vi.fn(async () => {}),
    notify: vi.fn(async () => {}),
    isRateLimited: () => false,
    log: () => {},
    ...overrides,
  };
}

function post(body: Record<string, unknown>, origin = ORIGIN): FunctionEvent {
  return {
    httpMethod: "POST",
    headers: { Origin: origin, "Content-Type": "text/plain" },
    body: JSON.stringify(body),
    requestContext: { identity: { sourceIp: "1.2.3.4" } },
  };
}

const order = {
  service: "Автоматизации",
  plan: "Расширенный",
  price: "60 000 ₽",
  contact: "@client",
  channel: "telegram",
  name: "Анна",
  comment: "Нужен бот для заявок",
  consent: true,
  website: "",
  elapsedMs: 9000,
  captchaToken: "t",
};

describe("handleOrder", () => {
  it("names a request without a package «Обсудить проект» and keeps the page", async () => {
    const d = deps();
    await handleOrder(
      post({ ...order, service: "", plan: "", price: "", page: "/about" }),
      d,
    );
    const [subject, text] = vi.mocked(d.sendMail).mock.calls[0]!;
    expect(subject).toBe("Заявка: Обсудить проект");
    expect(text).toContain("Услуга: не выбрана");
    expect(text).toContain("Страница: /about");
    expect(text).not.toContain("Пакет:");
    const [signal] = vi.mocked(d.notify).mock.calls[0]!;
    expect(signal).toBe("Новая заявка: Обсудить проект. Подробности на почте.");
  });

  it("adds the delivery trace only when the function enables it", async () => {
    const local = "http://localhost:3344";
    const failing = (debugTrace: boolean) =>
      deps({
        allowedOrigins: [ORIGIN, local],
        debugTrace,
        sendMail: vi.fn(async () => "250 queued"),
        notify: vi.fn(async () => {
          throw new Error("timeout");
        }),
      });
    const debug = JSON.parse(
      (await handleOrder(post(order), failing(true))).body,
    );
    expect(debug.trace).toEqual([
      "mail: 250 queued",
      "signal failed: Error: timeout",
    ]);
    // A localhost Origin is a header any client can send: it unlocks nothing.
    const forged = JSON.parse(
      (await handleOrder(post(order, local), failing(false))).body,
    );
    expect(forged).toEqual({ ok: true });
  });

  it.each([
    ["service", "Перейдите на https://evil.example"],
    ["service", "Звоните: bit.ly"],
    ["service", "Пишите на сайт.рф"],
    ["plan", "Базовый / подробнее"],
    ["plan", "Базовый\nBcc: x@y.ru"],
    ["price", "<b>0 ₽</b>"],
    ["page", "javascript:alert(1)"],
  ])("refuses a forged %s and sends nothing", async (field, value) => {
    const d = deps();
    const result = await handleOrder(post({ ...order, [field]: value }), d);
    expect(result.statusCode).toBe(400);
    expect(d.sendMail).not.toHaveBeenCalled();
    expect(d.notify).not.toHaveBeenCalled();
  });

  it("mails every field and signals without personal data", async () => {
    const d = deps();
    const result = await handleOrder(post(order), d);
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ ok: true });
    expect(result.headers["Access-Control-Allow-Origin"]).toBe(ORIGIN);
    expect(d.verifyCaptcha).toHaveBeenCalledWith("t", "1.2.3.4");
    const [subject, text] = vi.mocked(d.sendMail).mock.calls[0]!;
    expect(subject).toBe("Заявка: Автоматизации · Расширенный");
    expect(text).toContain("Контакт: @client");
    expect(text).toContain("Где удобнее ответить: Telegram");
    expect(text).toContain("Нужен бот для заявок");
    const [signal] = vi.mocked(d.notify).mock.calls[0]!;
    expect(signal).toContain("Автоматизации · Расширенный");
    expect(signal).not.toContain("@client");
    expect(signal).not.toContain("Анна");
  });

  it("drops a filled honeypot silently", async () => {
    const d = deps();
    const result = await handleOrder(post({ ...order, website: "x" }), d);
    expect(JSON.parse(result.body)).toEqual({ ok: true });
    expect(d.sendMail).not.toHaveBeenCalled();
    expect(d.verifyCaptcha).not.toHaveBeenCalled();
  });

  it("drops a form sent faster than a person can fill it", async () => {
    const d = deps();
    await handleOrder(post({ ...order, elapsedMs: 900 }), d);
    expect(d.sendMail).not.toHaveBeenCalled();
  });

  it("refuses a failed captcha", async () => {
    const d = deps({ verifyCaptcha: async () => false });
    const result = await handleOrder(post(order), d);
    expect(result.statusCode).toBe(403);
    expect(JSON.parse(result.body)).toEqual({ ok: false, reason: "captcha" });
    expect(d.sendMail).not.toHaveBeenCalled();
  });

  it("refuses an order without consent", async () => {
    const d = deps();
    const result = await handleOrder(post({ ...order, consent: false }), d);
    expect(result.statusCode).toBe(400);
    expect(d.sendMail).not.toHaveBeenCalled();
  });

  it("refuses a foreign origin", async () => {
    const d = deps();
    const result = await handleOrder(post(order, "https://evil.example"), d);
    expect(result.statusCode).toBe(403);
    expect(result.headers["Access-Control-Allow-Origin"]).toBeUndefined();
    expect(d.sendMail).not.toHaveBeenCalled();
  });

  it("answers 429 when the IP is rate limited", async () => {
    const d = deps({ isRateLimited: () => true });
    const result = await handleOrder(post(order), d);
    expect(result.statusCode).toBe(429);
    expect(d.sendMail).not.toHaveBeenCalled();
  });

  it("reports a server error when the mail fails", async () => {
    const d = deps({ sendMail: async () => Promise.reject(new Error("smtp")) });
    const result = await handleOrder(post(order), d);
    expect(result.statusCode).toBe(502);
    expect(JSON.parse(result.body)).toEqual({ ok: false, reason: "server" });
  });

  it("still succeeds when the Telegram signal fails", async () => {
    const d = deps({
      notify: async () => Promise.reject(new Error("blocked")),
    });
    const result = await handleOrder(post(order), d);
    expect(result.statusCode).toBe(200);
  });

  it("reads a base64 body", async () => {
    const d = deps();
    const event = post(order);
    event.body = Buffer.from(event.body!).toString("base64");
    event.isBase64Encoded = true;
    expect((await handleOrder(event, d)).statusCode).toBe(200);
  });

  it("answers the CORS preflight", async () => {
    const result = await handleOrder(
      { httpMethod: "OPTIONS", headers: { origin: ORIGIN } },
      deps(),
    );
    expect(result.statusCode).toBe(204);
    expect(result.headers["Access-Control-Allow-Methods"]).toContain("POST");
  });
});

describe("createRateLimiter", () => {
  it("allows the limit per window, then blocks, then forgets", () => {
    const limited = createRateLimiter(2, 1000);
    expect(limited("ip", 0)).toBe(false);
    expect(limited("ip", 10)).toBe(false);
    expect(limited("ip", 20)).toBe(true);
    expect(limited("other", 20)).toBe(false);
    expect(limited("ip", 5000)).toBe(false);
  });

  it("drops idle IPs before recent ones when the memory fills", () => {
    const limited = createRateLimiter(1, 1000, 10);
    for (let i = 0; i < 10; i++) limited(`idle-${i}`, 0);
    expect(limited("busy", 1500)).toBe(false);
    limited("new", 1600);
    // The idle ones went; the busy IP kept its count.
    expect(limited("busy", 1700)).toBe(true);
  });

  it("stays bounded when a flood of IPs arrives within one window", () => {
    const limited = createRateLimiter(1, 60_000, 100);
    for (let i = 0; i < 1000; i++) limited(`bot-${i}`, i);
    // A recent bot is still counted: its second request is over the limit.
    expect(limited("bot-999", 1001)).toBe(true);
    // The oldest were evicted: the first bot starts a fresh count.
    expect(limited("bot-0", 1002)).toBe(false);
  });
});
