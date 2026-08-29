import { describe, expect, it } from "vitest";
import {
  RU_APP_URL,
  RU_BLANKED_PUBLIC_ENV,
  ruStaticEnv,
} from "../../config/ru-static-env";

/**
 * The environment Timeweb actually builds under today: its deploy settings
 * still carry the PostHog key (docs/playbooks/production-ru-timeweb.md), which
 * is exactly the case these assertions exist to neutralise.
 */
const timewebEnv: NodeJS.ProcessEnv = {
  NODE_ENV: "production",
  PATH: "/usr/bin",
  NEXT_PUBLIC_POSTHOG_KEY: "phc_liveKeyFromTimewebDeploySettings",
  NEXT_PUBLIC_SENTRY_DSN: "https://abc123@o1.ingest.de.sentry.io/42",
};

describe("RU static build environment", () => {
  it.each(RU_BLANKED_PUBLIC_ENV)(
    "blanks %s so the value is never inlined into the RU bundle",
    (key) => {
      expect(ruStaticEnv(timewebEnv)[key]).toBe("");
    },
  );

  it("leaks no fragment of a blanked value into any other var", () => {
    const env = ruStaticEnv(timewebEnv);

    for (const value of Object.values(env)) {
      expect(value).not.toContain("phc_");
      expect(value).not.toContain("sentry.io");
    }
  });

  it("blanks the vars even when the build starts with none set", () => {
    const env = ruStaticEnv({ NODE_ENV: "production", PATH: "/usr/bin" });

    // Absent and blank are not the same thing here: an absent key lets Next.js
    // repopulate it from .env, which is the hole this closes.
    for (const key of RU_BLANKED_PUBLIC_ENV) {
      expect(env).toHaveProperty(key, "");
    }
  });

  it("pins the market and the export mode regardless of the inherited env", () => {
    const env = ruStaticEnv({
      NODE_ENV: "production",
      STATIC_EXPORT: "false",
      SITE_MARKET: "en",
    });

    expect(env.STATIC_EXPORT).toBe("true");
    expect(env.SITE_MARKET).toBe("ru");
  });

  it("defaults the app URL to the RU domain but honours an override", () => {
    expect(ruStaticEnv({ NODE_ENV: "production" }).NEXT_PUBLIC_APP_URL).toBe(
      RU_APP_URL,
    );
    expect(
      ruStaticEnv({
        NODE_ENV: "production",
        NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      }).NEXT_PUBLIC_APP_URL,
    ).toBe("http://localhost:3000");
  });

  it("passes the rest of the inherited environment through untouched", () => {
    expect(ruStaticEnv(timewebEnv).PATH).toBe("/usr/bin");
  });
});
