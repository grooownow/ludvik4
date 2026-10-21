import { describe, expect, it } from "vitest";
import { SILK_SOURCE, SMOOSH_SOURCE } from "./intro-shaders";
import {
  hexToRgb,
  parsePenUniforms,
  resolveUniforms,
  withPrecision,
} from "./pen-shader";

describe("parsePenUniforms", () => {
  it("reads Pen's @default values, which WebGL would otherwise leave at 0", () => {
    const silk = parsePenUniforms(SILK_SOURCE);
    const byName = Object.fromEntries(silk.map((u) => [u.name, u]));

    expect(byName.u_stripeWidth?.defaultValue).toBe(70);
    expect(byName.u_bend?.defaultValue).toBe(50);
    expect(byName.u_color1?.type).toBe("vec3");
    expect(byName.u_color1?.defaultValue).toEqual(hexToRgb("#355070"));
  });

  it("recognises the uniforms Pen binds itself", () => {
    const roles = Object.fromEntries(
      parsePenUniforms(SMOOSH_SOURCE).map((u) => [u.name, u.role]),
    );
    expect(roles.u_resolution).toBe("resolution");
    expect(roles.u_time).toBe("time");
    expect(roles.u_backdrop).toBe("backdrop");
  });
});

describe("resolveUniforms", () => {
  it("applies design overrides over defaults and skips bound uniforms", () => {
    const values = resolveUniforms(parsePenUniforms(SILK_SOURCE), {
      u_color1: "#ff0000",
      u_bend: 12,
    });
    expect(values.u_color1).toEqual([1, 0, 0]);
    expect(values.u_bend).toBe(12);
    expect(values.u_stripeWidth).toBe(70);
    expect(values.u_resolution).toBeUndefined();
    expect(values.u_time).toBeUndefined();
  });
});

describe("withPrecision", () => {
  it("adds the precision line WebGL 1 requires, once", () => {
    expect(withPrecision("void main(){}")).toMatch(/^precision highp float;/);
    expect(withPrecision(SMOOSH_SOURCE)).toBe(SMOOSH_SOURCE);
  });
});
