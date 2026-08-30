import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const env = vi.hoisted(() => ({
  NODE_ENV: "test" as string,
  TURNSTILE_SECRET_KEY: undefined as string | undefined,
}));

const logger = vi.hoisted(() => ({ error: vi.fn(), warn: vi.fn() }));

vi.mock("@/lib/env", () => ({ env }));
vi.mock("@/lib/logger", () => ({ logger }));

import { verifyTurnstile } from "./turnstile";

beforeEach(() => {
  logger.warn.mockClear();
  logger.error.mockClear();
  env.NODE_ENV = "test";
  env.TURNSTILE_SECRET_KEY = undefined;
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("verifyTurnstile", () => {
  it("skips quietly outside production when no secret is configured", async () => {
    await expect(verifyTurnstile("", "1.2.3.4")).resolves.toBe(true);
    expect(logger.warn).not.toHaveBeenCalled();
  });

  // The captcha is the only layer a bot that POSTs the action directly cannot
  // skip, so a production deploy running without it must say so on every
  // submission — silently waving traffic through is how the gap went
  // unnoticed for a month.
  it("skips loudly in production when no secret is configured", async () => {
    env.NODE_ENV = "production";
    await expect(verifyTurnstile("", "1.2.3.4")).resolves.toBe(true);
    expect(logger.warn).toHaveBeenCalledTimes(1);
  });

  it("rejects a missing token once a secret is configured", async () => {
    env.TURNSTILE_SECRET_KEY = "secret";
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(verifyTurnstile("", "1.2.3.4")).resolves.toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("accepts only a token Cloudflare confirms", async () => {
    env.TURNSTILE_SECRET_KEY = "secret";
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ json: async () => ({ success: true }) })
      .mockResolvedValueOnce({ json: async () => ({ success: false }) });
    vi.stubGlobal("fetch", fetchMock);

    await expect(verifyTurnstile("good", "1.2.3.4")).resolves.toBe(true);
    await expect(verifyTurnstile("bad", "1.2.3.4")).resolves.toBe(false);
  });

  it("fails closed when the verify request throws", async () => {
    env.TURNSTILE_SECRET_KEY = "secret";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    await expect(verifyTurnstile("token", "1.2.3.4")).resolves.toBe(false);
    expect(logger.error).toHaveBeenCalledTimes(1);
  });
});
