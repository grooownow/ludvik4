import { describe, expect, it } from "vitest";
import { shouldLoadPostHog } from "./analytics";

describe("shouldLoadPostHog", () => {
  it("loads analytics only on the international site when configured", () => {
    expect(shouldLoadPostHog("en", "phc_live_key")).toBe(true);
    expect(shouldLoadPostHog("ru", "phc_live_key")).toBe(false);
    expect(shouldLoadPostHog("en", undefined)).toBe(false);
  });
});
