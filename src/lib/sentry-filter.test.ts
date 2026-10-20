import { describe, expect, it } from "vitest";
import { dropOffDomainTurnstile } from "./sentry-filter";

const appUrl = "https://ludvik4.dev";
const turnstileOn = (url?: string) => ({
  exception: {
    values: [
      {
        type: "TurnstileError",
        value: "[Cloudflare Turnstile] Error: 110200.",
      },
    ],
  },
  ...(url ? { request: { url } } : {}),
});

describe("dropOffDomainTurnstile", () => {
  it("drops Turnstile errors on deployment URLs outside the production host", () => {
    const event = turnstileOn(
      "https://ludvik4-d8y17d4zv-krobox-6504s-projects.vercel.app/",
    );
    expect(dropOffDomainTurnstile(event, appUrl)).toBeNull();
  });

  it("keeps Turnstile errors on the production host", () => {
    const event = turnstileOn("https://ludvik4.dev/work");
    expect(dropOffDomainTurnstile(event, appUrl)).toBe(event);
  });

  it("keeps every other error, whatever the host", () => {
    const event = {
      exception: { values: [{ type: "TypeError", value: "x is undefined" }] },
      request: { url: "https://preview.vercel.app/" },
    };
    expect(dropOffDomainTurnstile(event, appUrl)).toBe(event);
  });

  it("keeps Turnstile errors when the page or production URL is unknown", () => {
    const noPage = turnstileOn();
    expect(dropOffDomainTurnstile(noPage, appUrl)).toBe(noPage);
    const offDomain = turnstileOn("https://preview.vercel.app/");
    expect(dropOffDomainTurnstile(offDomain, undefined)).toBe(offDomain);
  });
});
