// WebGL 1 port of cursor-drop.glsl (the design.pen drop). The canvas sits on
// top of the intro artwork and draws only the drop: everything outside it is
// transparent, so the <img> underneath stays the visible page.

export const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_texSize;
uniform vec2 u_center;
uniform float u_time;
uniform float u_radius;
uniform vec3 u_tint;
uniform sampler2D u_backdrop;

const float REFRACTION = 0.55;
const float MAGNIFY = 0.35;
const float IRIDESCENCE = 0.9;
const float CHROMATIC = 0.8;
const float WOBBLE = 0.5;

vec3 hue(float h) {
  return clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
}

// The <img> is drawn with object-fit: cover, so sample it the same way.
vec2 cover(vec2 uv) {
  float canvasAspect = u_resolution.x / u_resolution.y;
  float texAspect = u_texSize.x / u_texSize.y;
  vec2 scale = canvasAspect > texAspect
    ? vec2(1.0, texAspect / canvasAspect)
    : vec2(canvasAspect / texAspect, 1.0);
  return (uv - 0.5) * scale + 0.5;
}

vec3 backdrop(vec2 uv) {
  return texture2D(u_backdrop, clamp(cover(uv), 0.0, 1.0)).rgb;
}

void main() {
  vec2 p = gl_FragCoord.xy - u_center;
  float ang = atan(p.y, p.x);
  float wob = WOBBLE * (0.06 * sin(ang * 3.0 + u_time * 1.7) + 0.04 * sin(ang * 5.0 - u_time * 2.3));
  float r = u_radius * (1.0 + wob);
  float d = length(p) / r;

  float aa = 1.5 / r;
  float mask = 1.0 - smoothstep(1.0 - aa, 1.0 + aa, d);
  if (mask <= 0.0) {
    gl_FragColor = vec4(0.0);
    return;
  }

  float dc = min(d, 1.0);
  float h = sqrt(max(1.0 - dc * dc, 0.0));
  vec3 n = normalize(vec3(p / r, h + 0.0001));
  float edge = pow(dc, 3.0);

  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 c = u_center / u_resolution;
  vec2 zoom = c + (uv - c) * (1.0 - MAGNIFY * h);
  vec2 bend = n.xy * edge * REFRACTION * r / u_resolution;
  vec2 ca = n.xy * edge * CHROMATIC * 6.0 / u_resolution;

  vec3 col;
  col.r = backdrop(zoom - bend + ca).r;
  col.g = backdrop(zoom - bend).g;
  col.b = backdrop(zoom - bend - ca).b;
  col *= mix(vec3(1.0), u_tint, 0.25);

  float fres = pow(1.0 - n.z, 2.5);
  vec3 film = hue(fract(ang / 6.2831 + dc * 0.8 + u_time * 0.05));
  col = mix(col, col + film * 0.6, fres * IRIDESCENCE);

  vec3 l = normalize(vec3(-0.5, 0.6, 0.8));
  float spec = pow(max(dot(reflect(-l, n), vec3(0.0, 0.0, 1.0)), 0.0), 60.0);
  col += vec3(spec) * 0.9;
  col += vec3(1.0) * smoothstep(0.92, 1.0, dc) * 0.25;

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0) * mask;
}
`;

/**
 * The drop is decoration for a mouse: it follows the cursor, so it is off for
 * touch-only devices, for people who asked the OS for reduced motion, and
 * wherever WebGL is missing. Each of those falls back to the plain artwork.
 */
export function shouldEnableDrop(env: {
  finePointer: boolean;
  reducedMotion: boolean;
  webgl: boolean;
}): boolean {
  return env.finePointer && !env.reducedMotion && env.webgl;
}

/** Drop radius in CSS pixels: ~9% of the stage width, clamped. */
export function dropRadius(stageWidth: number): number {
  return Math.min(140, Math.max(70, stageWidth * 0.09));
}
