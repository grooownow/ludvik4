import { describe, expect, it } from "vitest";
import { EXHIBIT_FRAGMENT } from "./exhibit-shader";

describe("EXHIBIT_FRAGMENT", () => {
  it("declares exactly the stage uniforms", () => {
    const uniforms = [...EXHIBIT_FRAGMENT.matchAll(/uniform \w+ (\w+);/g)].map(
      (m) => m[1],
    );
    expect(uniforms.sort()).toEqual(
      [
        "uCam",
        "uColor",
        "uHide",
        "uLag",
        "uLite",
        "uRes",
        "uSpin",
        "uTilt",
      ].sort(),
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

  it("centres the edge ramp on the true outline", () => {
    // Rays march a body inset by 0.75 px, so the 1.5 px ramp runs from 0.75 px
    // inside the outline to 0.75 px outside. A ramp that only starts at the
    // outline leaves hit pixels hard, which shows as steps on 1x screens.
    expect(EXHIBIT_FRAGMENT).toMatch(/d=map\(ro\+rd\*t\)\+0\.75\*t\*pxPerT;/);
  });

  it("has a lite mode and can hide the mascot but keep its shadow", () => {
    // Lite: the haze is skipped (the most expensive extra per pixel).
    expect(EXHIBIT_FRAGMENT).toMatch(/if\(uLite<0\.5\)\{[^}]*haze/);
    // Hidden mascot: no object shading, the floor shadow still uses map().
    expect(EXHIBIT_FRAGMENT).toMatch(/if\(uHide>0\.5\)hit=0\.0;/);
  });
});
