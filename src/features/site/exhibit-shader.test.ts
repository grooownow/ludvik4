import { describe, expect, it } from "vitest";
import { EXHIBIT_FRAGMENT } from "./exhibit-shader";

describe("EXHIBIT_FRAGMENT", () => {
  it("declares exactly the stage uniforms", () => {
    const uniforms = [...EXHIBIT_FRAGMENT.matchAll(/uniform \w+ (\w+);/g)].map(
      (m) => m[1],
    );
    expect(uniforms.sort()).toEqual(
      ["uCam", "uColor", "uLag", "uRes", "uSpin", "uTilt"].sort(),
    );
  });

  it("draws the mascot without a mouth on the first screen", () => {
    // Code identifiers of the mood switch's mouth, not prose in comments.
    expect(EXHIBIT_FRAGMENT).not.toMatch(
      /uSmile|uSurprise|mouthCoords|float mouth\(|float lip\(/,
    );
  });
});
