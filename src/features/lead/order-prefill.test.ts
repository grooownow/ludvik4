import { describe, expect, it } from "vitest";
import { orderPrefillMessage } from "./order-prefill";

const prefills = {
  "landing-pages/plus": "Plus please",
  "web-animation": "Animation please",
};

describe("orderPrefillMessage", () => {
  it("resolves a known service and package", () => {
    expect(
      orderPrefillMessage("?service=landing-pages&package=plus", prefills),
    ).toBe("Plus please");
    expect(orderPrefillMessage("?service=web-animation", prefills)).toBe(
      "Animation please",
    );
  });

  it.each([
    "",
    "?service=<script>",
    "?service=landing-pages&package=gold",
    "?service=constructor",
    "?service=__proto__",
    "?service=landing-pages&package=PLUS",
  ])("ignores %s", (search) => {
    expect(orderPrefillMessage(search, prefills)).toBeUndefined();
  });
});
