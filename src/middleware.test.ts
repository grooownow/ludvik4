import { NextRequest, type NextFetchEvent } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

// The auth half is covered by the e2e dashboard redirect; here only the
// language redirect, with Auth.js stubbed out.
const authMiddleware = vi.hoisted(() => vi.fn(() => "auth"));
vi.mock("next-auth", () => ({ default: () => ({ auth: authMiddleware }) }));
vi.mock("@/lib/auth.config", () => ({ authConfig: {} }));

import proxy from "./middleware";

// Synchronous for every path tested here: a redirect or nothing.
const middleware = (req: NextRequest, ev: NextFetchEvent) =>
  proxy(req, ev) as Response | undefined | string;

const event = {} as NextFetchEvent;

function request(
  path: string,
  headers: Record<string, string> = {},
  method = "GET",
) {
  return new NextRequest(new URL(path, "https://ludvik4.dev"), {
    headers: { "user-agent": "Mozilla/5.0", ...headers },
    method,
  });
}

afterEach(() => vi.unstubAllEnvs());

describe("middleware language redirect (ludvik4.dev)", () => {
  it("sends a Spanish browser to the Spanish page, keeping the query", () => {
    vi.stubEnv("SITE_MARKET", "en");
    const res = middleware(
      request("/contact?service=web-apps", { "accept-language": "es-ES,es" }),
      event,
    );
    expect((res as Response).status).toBe(307);
    expect((res as Response).headers.get("location")).toBe(
      "https://ludvik4.dev/es/contact?service=web-apps",
    );
  });

  it("follows the saved choice", () => {
    vi.stubEnv("SITE_MARKET", "en");
    const stay = middleware(
      request("/", { "accept-language": "es", cookie: "ludvik4_lang=en" }),
      event,
    );
    expect(stay).toBeUndefined();
    const go = middleware(
      request("/about", { "accept-language": "en", cookie: "ludvik4_lang=ru" }),
      event,
    );
    expect((go as Response).headers.get("location")).toBe(
      "https://ludvik4.dev/ru/about",
    );
  });

  it("leaves form posts, bots and English browsers alone", () => {
    vi.stubEnv("SITE_MARKET", "en");
    expect(
      middleware(
        request("/contact", { "accept-language": "es" }, "POST"),
        event,
      ),
    ).toBeUndefined();
    expect(
      middleware(
        request("/", { "accept-language": "es", "user-agent": "Googlebot" }),
        event,
      ),
    ).toBeUndefined();
    expect(
      middleware(request("/", { "accept-language": "en-GB" }), event),
    ).toBeUndefined();
  });

  it("does nothing for languages on the RU market build", () => {
    vi.stubEnv("SITE_MARKET", "ru");
    expect(
      middleware(request("/", { "accept-language": "es" }), event),
    ).toBeUndefined();
  });

  it("still hands /dashboard to Auth.js", () => {
    vi.stubEnv("SITE_MARKET", "en");
    expect(middleware(request("/dashboard"), event)).toBe("auth");
  });
});
