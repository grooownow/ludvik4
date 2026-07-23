import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/env", () => ({
  env: {
    NODE_ENV: "test",
    RESEND_API_KEY: "re_test",
    LEAD_EMAIL_TO: "owner@example.com",
    LEAD_EMAIL_FROM: "Ludvik4 <hi@example.com>",
  },
}));

vi.mock("@/lib/logger", () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

import { deliverLead } from "./notify";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("deliverLead", () => {
  it("delivers the enquiry only through Resend email", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      deliverLead({
        name: "Ada",
        contact: "ada@example.com",
        message: "I need a focused product website.",
      }),
    ).resolves.toBe(true);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({ method: "POST" }),
    );

    const request = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(JSON.parse(String(request.body))).toMatchObject({
      to: "owner@example.com",
      subject: "New enquiry — Ludvik4",
      text: expect.stringContaining("ada@example.com"),
    });
  });
});
