import {
  CHANNEL_LABELS,
  MIN_FILL_MS,
  orderSchema,
  type OrderRequest,
  type OrderResponse,
} from "../order-schema";

// The Yandex Cloud function behind the order form, without its I/O: the
// captcha check, the mail and the Telegram signal come in as `deps`, so the
// rules are testable here and cloud/order-function/ only wires them.
// Spec: docs/specs/order-form-ru.md. Never imported by the Next app.

/** The HTTP event a Yandex Cloud Function receives (fields we read). */
export type FunctionEvent = {
  httpMethod: string;
  headers?: Record<string, string | undefined>;
  body?: string;
  isBase64Encoded?: boolean;
  requestContext?: { identity?: { sourceIp?: string } };
};

export type FunctionResult = {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
};

export type OrderDeps = {
  /** Origins allowed to call the function (CORS). */
  allowedOrigins: string[];
  verifyCaptcha: (token: string, ip: string) => Promise<boolean>;
  /** Resolves with the SMTP server's reply, which goes into the trace. */
  sendMail: (subject: string, text: string) => Promise<string | void>;
  /** A short signal with no personal data. A failure here never fails the order. */
  notify: (text: string) => Promise<void>;
  /** True when this IP sent too many orders lately. */
  isRateLimited: (ip: string) => boolean;
  log: (message: string, extra?: unknown) => void;
};

function reply(
  status: number,
  body: OrderResponse | null,
  origin: string | undefined,
  trace?: string[],
): FunctionResult {
  // The console's logs are not always available, so a local test run gets
  // the delivery details in the response. Never for the production origin.
  const withTrace =
    body && trace && origin?.startsWith("http://localhost")
      ? { ...body, trace }
      : body;
  return {
    statusCode: status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...(origin
        ? {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            Vary: "Origin",
          }
        : {}),
    },
    body: withTrace ? JSON.stringify(withTrace) : "",
  };
}

function header(event: FunctionEvent, name: string) {
  const headers = event.headers ?? {};
  const key = Object.keys(headers).find((k) => k.toLowerCase() === name);
  return key ? headers[key] : undefined;
}

/** "Лендинги · Базовый", or "Обсудить проект" when no package was picked. */
function orderTopic(order: OrderRequest) {
  return (
    [order.service, order.plan].filter(Boolean).join(" · ") || "Обсудить проект"
  );
}

/** The mail to the owner: every field, plain text. */
export function orderMail(order: OrderRequest) {
  const subject = `Заявка: ${orderTopic(order)}`;
  const lines = [
    order.service ? `Услуга: ${order.service}` : "Услуга: не выбрана",
    order.plan
      ? `Пакет: ${order.plan}${order.price ? ` (${order.price})` : ""}`
      : "",
    `Контакт: ${order.contact}`,
    order.channel
      ? `Где удобнее ответить: ${CHANNEL_LABELS[order.channel]}`
      : "",
    order.name ? `Имя: ${order.name}` : "",
    order.page ? `Страница: ${order.page}` : "",
    order.comment ? `\nКомментарий:\n${order.comment}` : "",
    "\nСогласие на обработку персональных данных: дано",
    `Время: ${new Date().toISOString()}`,
  ];
  return { subject, text: lines.filter(Boolean).join("\n") };
}

export async function handleOrder(
  event: FunctionEvent,
  deps: OrderDeps,
): Promise<FunctionResult> {
  const requestOrigin = header(event, "origin");
  const origin =
    requestOrigin && deps.allowedOrigins.includes(requestOrigin)
      ? requestOrigin
      : undefined;

  if (event.httpMethod === "OPTIONS") return reply(204, null, origin);
  if (event.httpMethod !== "POST" || !origin) {
    return reply(403, { ok: false, reason: "invalid" }, origin);
  }

  const ip =
    event.requestContext?.identity?.sourceIp ??
    header(event, "x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  if (deps.isRateLimited(ip)) {
    return reply(429, { ok: false, reason: "rate" }, origin);
  }

  let raw: unknown;
  try {
    const text = event.isBase64Encoded
      ? Buffer.from(event.body ?? "", "base64").toString("utf8")
      : (event.body ?? "");
    raw = JSON.parse(text);
  } catch {
    return reply(400, { ok: false, reason: "invalid" }, origin);
  }

  const parsed = orderSchema.safeParse(raw);
  if (!parsed.success) {
    return reply(400, { ok: false, reason: "invalid" }, origin);
  }
  const order = parsed.data;

  // A filled honeypot or a form sent in under 3 seconds is a bot. It gets a
  // plain success, so it has no reason to retry, and nothing is sent.
  if (order.website || order.elapsedMs < MIN_FILL_MS) {
    deps.log("order dropped as a bot", { honeypot: Boolean(order.website) });
    return reply(200, { ok: true }, origin);
  }

  if (!(await deps.verifyCaptcha(order.captchaToken, ip))) {
    return reply(403, { ok: false, reason: "captcha" }, origin);
  }

  const trace: string[] = [];
  const mail = orderMail(order);
  try {
    const smtp = await deps.sendMail(mail.subject, mail.text);
    trace.push(`mail: ${smtp ?? "sent"}`);
  } catch (error) {
    deps.log("order mail failed", String(error));
    trace.push(`mail failed: ${String(error)}`);
    return reply(502, { ok: false, reason: "server" }, origin, trace);
  }

  try {
    await deps.notify(
      `Новая заявка: ${orderTopic(order)}. Подробности на почте.`,
    );
    trace.push("signal: sent");
  } catch (error) {
    deps.log("order signal failed", String(error));
    trace.push(`signal failed: ${String(error)}`);
  }

  return reply(200, { ok: true }, origin, trace);
}

/** An in-memory sliding window: at most `limit` orders per IP per window. */
export function createRateLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, number[]>();
  return (ip: string, now = Date.now()) => {
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
    recent.push(now);
    hits.set(ip, recent);
    if (hits.size > 5000) hits.clear();
    return recent.length > limit;
  };
}
