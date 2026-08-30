import { beforeEach, describe, expect, it, vi } from "vitest";

const verifyTurnstile = vi.hoisted(() => vi.fn());
const deliverLead = vi.hoisted(() => vi.fn());
const rateLimit = vi.hoisted(() => vi.fn(() => ({ allowed: true })));

vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-forwarded-for": "203.0.113.7" }),
}));
vi.mock("@/lib/rate-limit", () => ({ rateLimit }));
vi.mock("@/lib/logger", () => ({ logger: { warn: vi.fn(), info: vi.fn() } }));
vi.mock("./turnstile", () => ({ verifyTurnstile }));
vi.mock("./notify", () => ({ deliverLead }));

import { submitLeadAction } from "./submit-lead-action";

function form(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

const valid = {
  name: "Ada",
  message: "We need a focused product website for a small service.",
  contact: "ada@example.com",
};

beforeEach(() => {
  verifyTurnstile.mockReset().mockResolvedValue(true);
  deliverLead.mockReset().mockResolvedValue(true);
  rateLimit.mockReset().mockReturnValue({ allowed: true });
});

describe("submitLeadAction", () => {
  it("delivers a valid enquiry", async () => {
    await expect(submitLeadAction({}, form(valid))).resolves.toEqual({
      ok: true,
    });
    expect(deliverLead).toHaveBeenCalledTimes(1);
  });

  // The form ships only on the English storefront, so every message a visitor
  // can see has to be English — including the ones the server writes.
  it("rejects a failed captcha in the visitor's language", async () => {
    verifyTurnstile.mockResolvedValue(false);

    const state = await submitLeadAction({}, form(valid));

    expect(state.reason).toBe("captcha");
    expect(state.error).toMatch(/^[\x20-\x7E—’]+$/); // ASCII + em dash / apostrophe
    expect(state.values).toEqual(valid);
    expect(deliverLead).not.toHaveBeenCalled();
  });

  it("returns an English message for a schema failure with no issue text", async () => {
    const state = await submitLeadAction(
      {},
      form({ ...valid, message: "short" }),
    );

    expect(state.reason).toBe("validation");
    expect(state.error).toMatch(/^[\x20-\x7E—’]+$/);
  });
});
