import { describe, expect, it } from "vitest";
import { shouldLoadPostHog } from "./analytics";

describe("shouldLoadPostHog", () => {
  it("keeps non-essential analytics off the international site", () => {
    expect(shouldLoadPostHog("en", "phc_live_key")).toBe(false);
    expect(shouldLoadPostHog("ru", "phc_live_key")).toBe(true);
    expect(shouldLoadPostHog("ru", undefined)).toBe(false);
  });
});
