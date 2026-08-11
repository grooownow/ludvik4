import { beforeEach, describe, expect, it, vi } from "vitest";

const { deliverLead, rateLimit } = vi.hoisted(() => ({
  deliverLead: vi.fn(),
  rateLimit: vi.fn(),
}));

vi.mock("@/features/lead", () => ({ deliverLead }));
vi.mock("@/lib/rate-limit", () => ({ rateLimit }));

import { POST } from "./route";

const valid = {
  github: "octocat",
  email: "founder@example.com",
  role: "Solo founder",
  usage: "Building an application",
  page: "https://ludvik4.dev/gridfin/en",
  website: "",
};

function request(body: unknown): Request {
  return new Request("https://ludvik4.dev/api/gridfin-lead", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": "203.0.113.10",
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/gridfin-lead", () => {
  beforeEach(() => {
    deliverLead.mockReset().mockResolvedValue(true);
    rateLimit.mockReset().mockReturnValue({ allowed: true, remaining: 4 });
  });

  it("validates the JSON boundary before delivery", async () => {
    const response = await POST(request({ email: "not-an-email" }));

    expect(response.status).toBe(400);
    expect(deliverLead).not.toHaveBeenCalled();
  });

  it("silently drops honeypot submissions", async () => {
    const response = await POST(request({ ...valid, website: "spam.example" }));

    expect(response.status).toBe(200);
    expect(deliverLead).not.toHaveBeenCalled();
  });

  it("rate-limits by client IP", async () => {
    rateLimit.mockReturnValue({ allowed: false, remaining: 0 });

    const response = await POST(request(valid));

    expect(response.status).toBe(429);
    expect(deliverLead).not.toHaveBeenCalled();
  });

  it("maps a valid Gridfin request to the existing Resend delivery", async () => {
    const response = await POST(request(valid));

    expect(response.status).toBe(200);
    expect(deliverLead).toHaveBeenCalledWith({
      name: "GitHub: octocat",
      contact: "founder@example.com",
      message:
        "Gridfin early access\nRole: Solo founder\nUse: Building an application\nPage: https://ludvik4.dev/gridfin/en",
    });
  });

  it("reports a delivery failure", async () => {
    deliverLead.mockResolvedValue(false);

    const response = await POST(request(valid));

    expect(response.status).toBe(502);
  });
});
