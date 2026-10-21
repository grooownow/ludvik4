// Shaders of the live intro scene that are ours (silk and smoosh are verbatim
// design.pen shaders, see intro-shaders.ts). Pipeline, all at one render size:
//
//   silk ─▶ A ─┐
//              ├─ COMPOSITE (+ wordmark art) ─▶ B ─ smoosh ─▶ A
//   wordmark ──┘
//   A + copy text ─ FINAL (glass drop over everything) ─▶ screen
//
// The final pass composites the copy before the drop, so the drop refracts
// the tagline and services line too, as it does on the canvas.

export const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const COMPOSITE_SHADER = `
precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_texSize;
uniform sampler2D u_silk;
uniform sampler2D u_wordmark;

// The wordmark art is laid out on the design artboard. On wide screens it is
// shown like the static <img> (object-fit: cover). On boxier screens cover
// would crop the "L" and the "4", so the art is fitted to the width instead
// (artboard 1.15x the canvas width) and kept at the wordmark's height.
const float FIT_BELOW = 0.8;
const float FIT_ART_WIDTH = 1.15;
const float WORDMARK_Y = 0.56; // wordmark centre, from the bottom of the art

vec2 artUv(vec2 uv) {
  float canvasAspect = u_resolution.x / u_resolution.y;
  float texAspect = u_texSize.x / u_texSize.y;
  if (canvasAspect < texAspect * FIT_BELOW) {
    float sx = 1.0 / FIT_ART_WIDTH;
    float sy = texAspect / (FIT_ART_WIDTH * canvasAspect);
    return vec2((uv.x - 0.5) * sx + 0.5, (uv.y - WORDMARK_Y) * sy + WORDMARK_Y);
  }
  vec2 scale = canvasAspect > texAspect
    ? vec2(1.0, texAspect / canvasAspect)
    : vec2(canvasAspect / texAspect, 1.0);
  return (uv - 0.5) * scale + 0.5;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec3 silk = texture2D(u_silk, uv).rgb;
  vec4 mark = texture2D(u_wordmark, clamp(artUv(uv), 0.0, 1.0));
  gl_FragColor = vec4(mix(silk, mark.rgb, mark.a), 1.0);
}
`;

export const FINAL_SHADER = `
precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_center;
uniform float u_time;
uniform float u_radius;
uniform float u_wobble;
uniform vec3 u_tint;
uniform sampler2D u_scene;
uniform sampler2D u_text;

const float REFRACTION = 0.55;
const float MAGNIFY = 0.35;
const float IRIDESCENCE = 0.9;
const float CHROMATIC = 0.8;

vec3 hue(float h) {
  return clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
}

vec3 scene(vec2 uv) {
  vec2 c = clamp(uv, 0.0, 1.0);
  vec3 base = texture2D(u_scene, c).rgb;
  vec4 text = texture2D(u_text, c);
  return mix(base, text.rgb, text.a);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 p = gl_FragCoord.xy - u_center;
  float ang = atan(p.y, p.x);
  float wob = u_wobble * (0.06 * sin(ang * 3.0 + u_time * 1.7) + 0.04 * sin(ang * 5.0 - u_time * 2.3));
  float r = u_radius * (1.0 + wob);
  float d = length(p) / r;

  float aa = 1.5 / r;
  float mask = 1.0 - smoothstep(1.0 - aa, 1.0 + aa, d);
  vec3 outside = scene(uv);
  if (mask <= 0.0) {
    gl_FragColor = vec4(outside, 1.0);
    return;
  }

  float dc = min(d, 1.0);
  float h = sqrt(max(1.0 - dc * dc, 0.0));
  vec3 n = normalize(vec3(p / r, h + 0.0001));
  float edge = pow(dc, 3.0);

  vec2 c = u_center / u_resolution;
  vec2 zoom = c + (uv - c) * (1.0 - MAGNIFY * h);
  vec2 bend = n.xy * edge * REFRACTION * r / u_resolution;
  vec2 ca = n.xy * edge * CHROMATIC * 6.0 / u_resolution;

  vec3 col;
  col.r = scene(zoom - bend + ca).r;
  col.g = scene(zoom - bend).g;
  col.b = scene(zoom - bend - ca).b;
  col *= mix(vec3(1.0), u_tint, 0.25);

  float fres = pow(1.0 - n.z, 2.5);
  vec3 film = hue(fract(ang / 6.2831 + dc * 0.8 + u_time * 0.05));
  col = mix(col, col + film * 0.6, fres * IRIDESCENCE);

  vec3 l = normalize(vec3(-0.5, 0.6, 0.8));
  float spec = pow(max(dot(reflect(-l, n), vec3(0.0, 0.0, 1.0)), 0.0), 60.0);
  col += vec3(spec) * 0.9;
  col += vec3(1.0) * smoothstep(0.92, 1.0, dc) * 0.25;

  gl_FragColor = vec4(mix(outside, clamp(col, 0.0, 1.0), mask), 1.0);
}
`;

/**
 * The live scene (moving silk and melt, glass drop) is for a mouse on a
 * landscape screen at least tablet-wide: it follows the cursor and is laid out
 * on the desktop artboard. Touch, reduced motion, portrait or no WebGL get the
 * pre-rendered artwork.
 */
export function shouldRunLiveIntro(env: {
  finePointer: boolean;
  reducedMotion: boolean;
  wideLandscape: boolean;
  webgl: boolean;
}): boolean {
  return (
    env.finePointer && !env.reducedMotion && env.wideLandscape && env.webgl
  );
}

/** Drop radius in CSS pixels: ~9% of the stage width, clamped. */
export function dropRadius(stageWidth: number): number {
  return Math.min(140, Math.max(70, stageWidth * 0.09));
}

/** Render width cap: shader cost grows with pixels, and the art is 1304 wide. */
export const MAX_RENDER_WIDTH = 1600;
