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

  it("antialiases the silhouette from the ray's closest approach", () => {
    // A ray that grazes the mascot without hitting it must still get partial
    // coverage, or the outline renders as a staircase.
    expect(EXHIBIT_FRAGMENT).toMatch(/minD/);
    expect(EXHIBIT_FRAGMENT).toMatch(/smoothstep\(0\.0,\s*pixel/);
  });
});
