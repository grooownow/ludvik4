// Fragment shaders of the effects gallery on /uslugi/animatsiya-dlya-sajta. Small and
// self-contained (no backdrop texture), in the brand pinks. Shared inputs:
// u_resolution (px), u_time (s), u_mouse (0..1, y up, eased) and u_active
// (0..1, eased: how much the pointer is over the tile); u_hold is the same
// but builds up slowly, for effects that unfold while the pointer stays;
// u_poke is seconds since the tile was entered or pressed, at u_poke_at.
// The silk tile reuses the intro's own shader (intro-shaders.ts) instead.

const HEAD = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_active;
uniform float u_hold;
uniform float u_poke;
uniform vec2 u_poke_at;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + 1.0), f.x), f.y);
}
float fbm(vec2 p) {
  float s = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    s += a * noise(p);
    p = p * 2.02 + 3.1;
    a *= 0.5;
  }
  return s;
}
`;

/** Slowly flowing pink "liquid"; ripples spread from the pointer. */
export const LIQUID_SHADER = `${HEAD}
void main() {
  float aspect = u_resolution.x / u_resolution.y;
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 p = uv * vec2(aspect, 1.0) * 2.5;
  vec2 m = u_mouse * vec2(aspect, 1.0) * 2.5;
  float d = length(p - m);
  p += (p - m) / max(d, 0.001) * 0.18 * sin(d * 10.0 - u_time * 4.0)
       * exp(-d * 1.8) * u_active;
  float t = u_time * 0.15;
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
  float f = fbm(p + 2.0 * q);
  vec3 c = mix(vec3(1.0, 0.88, 0.95), vec3(1.0, 0.31, 0.71), smoothstep(0.3, 0.8, f));
  c = mix(c, vec3(0.55, 0.05, 0.3), smoothstep(0.55, 1.0, f * q.x * 1.6));
  c += pow(max(0.0, f - 0.55), 2.0) * 1.4;
  gl_FragColor = vec4(c, 1.0);
}
`;

/** A glass lens that follows the pointer and refracts a striped pattern. */
export const LENS_SHADER = `${HEAD}
vec3 pattern(vec2 p) {
  p.y += u_time * 0.04;
  float stripe = step(0.5, fract((p.x + p.y) * 6.0));
  vec3 c = mix(vec3(1.0, 0.93, 0.97), vec3(1.0, 0.6, 0.82), stripe);
  float dotD = length(fract(p * 4.0) - 0.5);
  return mix(c, vec3(0.62, 0.04, 0.36), smoothstep(0.13, 0.1, dotD));
}
void main() {
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = gl_FragCoord.xy / u_resolution * vec2(aspect, 1.0);
  vec2 m = u_mouse * vec2(aspect, 1.0);
  vec2 d = p - m;
  float r = 0.27;
  float l = length(d) / r;
  vec3 c = pattern(p);
  if (l < 1.0) {
    float h = sqrt(1.0 - l * l);
    vec2 off = -d * (1.0 - h) * 1.3;
    c = vec3(pattern(p + off * 1.06).r, pattern(p + off).g, pattern(p + off * 0.94).b);
    c = c * (0.92 + 0.12 * h) + pow(1.0 - h, 3.0) * 0.55;
  }
  float rim = smoothstep(0.96, 1.0, l) * smoothstep(1.05, 1.0, l);
  c = mix(c, vec3(1.0), rim * 0.85);
  c *= 1.0 - 0.18 * smoothstep(1.0, 1.25, l) * smoothstep(1.6, 1.25, l);
  gl_FragColor = vec4(c, 1.0);
}
`;

/** A little gummy bear: poked (hovered or pressed), it shudders like real
 * jelly and the shudder dies down; it gives a little under the pointer. */
export const JELLY_SHADER = `${HEAD}
const float T = 0.07;
const vec2 FEET = vec2(0.0, -0.3);
vec2 mouse;
vec2 poked;
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
float ellipse(vec2 p, vec2 r) {
  return (length(p / r) - 1.0) * min(r.x, r.y);
}
vec2 rot(vec2 p, float a) {
  float c = cos(a);
  float s = sin(a);
  return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
}
vec2 warp(vec2 p) {
  // A damped spring: a sharp shudder right after the poke that fades out.
  float decay = exp(-u_poke * 3.2);
  float shake = sin(u_poke * 19.0) * decay;
  // Squash and stretch around the feet, area kept.
  float s = 1.0 + 0.1 * shake;
  vec2 q = p - FEET;
  q.y /= s;
  q.x *= s;
  // The top sways sideways a little, away from where it was poked.
  q.x += 0.05 * sin(u_poke * 19.0 + 1.2) * decay * sign(-poked.x + 0.0001) * smoothstep(0.0, 0.5, q.y);
  q = FEET + q;
  // The poked spot dents in and springs back; the pointer presses gently.
  vec2 dp = q - poked;
  q = poked + dp * (1.0 + 0.35 * shake * exp(-dot(dp, dp) / 0.02));
  vec2 dm = q - mouse;
  return mouse + dm * (1.0 - 0.25 * u_active * exp(-dot(dm, dm) / 0.015));
}
float shape(vec2 p) {
  vec2 hp = p - vec2(0.0, 0.15);
  vec2 ax = vec2(abs(p.x), p.y);
  vec2 hx = vec2(abs(hp.x), hp.y);
  float body = ellipse(p - vec2(0.0, -0.1), vec2(0.13, 0.15));
  float head = ellipse(hp, vec2(0.135, 0.12));
  float ears = length(hx - vec2(0.1, 0.105)) - 0.05;
  float arms = ellipse(rot(ax - vec2(0.12, -0.04), 0.5), vec2(0.045, 0.07));
  float legs = ellipse(ax - vec2(0.075, -0.24), vec2(0.06, 0.055));
  float d = smin(body, head, 0.04);
  d = smin(d, ears, 0.03);
  d = smin(d, arms, 0.03);
  return smin(d, legs, 0.03);
}
float bear(vec2 p) {
  return shape(warp(p));
}
// Gummy volume: flat-ish in the middle, rounded at the edges, a soft snout.
float height(vec2 p) {
  float k = clamp(-bear(p) / T, 0.0, 1.0);
  float h = T * sqrt(1.0 - (1.0 - k) * (1.0 - k));
  vec2 q = warp(p) - vec2(0.0, 0.115);
  return h + 0.025 * smoothstep(0.06, 0.0, length(q * vec2(1.0, 1.3)));
}
void main() {
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = (gl_FragCoord.xy / u_resolution - 0.5) * vec2(aspect, 1.0);
  mouse = (u_mouse - 0.5) * vec2(aspect, 1.0);
  poked = (u_poke_at - 0.5) * vec2(aspect, 1.0);
  p.y /= 1.0 + 0.02 * sin(u_time * 1.4);
  float d = bear(p);
  vec3 bg = mix(vec3(1.0, 0.95, 0.98), vec3(1.0, 0.86, 0.93), gl_FragCoord.y / u_resolution.y);
  vec3 c = bg;
  float shadow = smoothstep(0.1, -0.05, length((p - FEET - vec2(0.0, -0.01)) * vec2(1.0, 4.0)) - 0.14);
  c = mix(c, c * 0.85, shadow * 0.5);
  if (d < 0.0) {
    vec2 e = vec2(0.003, 0.0);
    vec2 g = vec2(height(p + e.xy) - height(p - e.xy), height(p + e.yx) - height(p - e.yx)) / (2.0 * e.x);
    vec3 n = normalize(vec3(-g, 1.0));
    vec3 light = normalize(vec3(-0.45, 0.6, 0.65));
    float diff = max(dot(n, light), 0.0);
    float spec = pow(max(dot(reflect(-light, n), vec3(0.0, 0.0, 1.0)), 0.0), 36.0);
    float thick = clamp(-d / T, 0.0, 1.0);
    vec3 body = mix(vec3(0.8, 0.05, 0.4), vec3(1.0, 0.45, 0.74), diff);
    body = mix(body, vec3(1.0, 0.6, 0.82), (1.0 - thick) * 0.3);
    c = body + spec * 0.8;
    c = mix(c, bg, smoothstep(-0.004, 0.0, d));
  }
  gl_FragColor = vec4(c, 1.0);
}
`;
