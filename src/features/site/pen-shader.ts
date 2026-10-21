// Minimal runtime for design.pen shaders. Pen shaders are WebGL 1 fragment
// shaders whose uniforms carry JSDoc-style annotations (@default, @time,
// @resolution, @backdrop, …). Pen fills unset uniforms from @default; plain
// WebGL leaves them at zero, so we parse the annotations and apply the same
// defaults before the per-design overrides.

export type UniformValue = number | readonly number[];

export type PenUniform = {
  name: string;
  type: string;
  defaultValue?: UniformValue;
  role?: "resolution" | "time" | "mouse" | "backdrop";
};

const UNIFORM_RE =
  /(?:\/\*\*((?:(?!\*\/)[\s\S])*)\*\/\s*)?uniform\s+(\w+)\s+(\w+)\s*;/g;

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = (i: number) => parseInt(h.slice(i, i + 2), 16) / 255;
  return [n(0), n(2), n(4)];
}

function parseDefault(type: string, raw: string): UniformValue | undefined {
  const value = raw.trim();
  if (value.startsWith("#")) return hexToRgb(value);
  const parts = value.split(",").map((p) => Number(p.trim()));
  if (parts.some((p) => Number.isNaN(p))) return undefined;
  return type === "float" || type === "int" ? parts[0] : parts;
}

export function parsePenUniforms(source: string): PenUniform[] {
  const uniforms: PenUniform[] = [];
  for (const match of source.matchAll(UNIFORM_RE)) {
    const doc = match[1] ?? "";
    const type = match[2]!;
    const name = match[3]!;
    const uniform: PenUniform = { name, type };
    const def = /@default\s+([^\n*]+)/.exec(doc);
    if (def) uniform.defaultValue = parseDefault(type, def[1]!);
    if (/@resolution\b/.test(doc)) uniform.role = "resolution";
    else if (/@time\b/.test(doc)) uniform.role = "time";
    else if (/@mouse\b/.test(doc)) uniform.role = "mouse";
    else if (/@backdrop\b/.test(doc)) uniform.role = "backdrop";
    uniforms.push(uniform);
  }
  return uniforms;
}

/** Pen accepts shaders without a precision line; WebGL 1 does not. */
export function withPrecision(source: string): string {
  return /precision\s+\w+\s+float/.test(source)
    ? source
    : `precision highp float;\n${source}`;
}

/** Overrides as stored in design.pen: numbers, or "#rrggbb" for colours. */
export type PenOverrides = Record<string, number | string>;

export function resolveUniforms(
  uniforms: PenUniform[],
  overrides: PenOverrides,
): Record<string, UniformValue> {
  const values: Record<string, UniformValue> = {};
  for (const u of uniforms) {
    if (u.role) continue;
    const override = overrides[u.name];
    if (typeof override === "string") values[u.name] = hexToRgb(override);
    else if (typeof override === "number") values[u.name] = override;
    else if (u.defaultValue !== undefined) values[u.name] = u.defaultValue;
  }
  return values;
}
