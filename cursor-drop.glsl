precision highp float;

/** @resolution */
uniform vec2 u_resolution;

/** @time */
uniform float u_time;

/** @mouse */
uniform vec2 u_mouse;

/** @backdrop @mipmap */
uniform sampler2D u_backdrop;

/**
 * @label Drop size
 * @default 120
 * @range 30, 400
 */
uniform float u_radius;

/**
 * @label Refraction
 * @default 0.55
 * @range 0, 1.5
 */
uniform float u_refraction;

/**
 * @label Magnify
 * @default 0.35
 * @range 0, 1
 */
uniform float u_magnify;

/**
 * @label Iridescence
 * @default 0.8
 * @range 0, 2
 */
uniform float u_iridescence;

/**
 * @label Chromatic
 * @default 0.6
 * @range 0, 2
 */
uniform float u_chromatic;

/**
 * @label Wobble
 * @default 0.5
 * @range 0, 1
 */
uniform float u_wobble;

/**
 * @label Idle X (no cursor)
 * @default 0.68
 * @range 0, 1
 */
uniform float u_idleX;

/**
 * @label Idle Y (no cursor)
 * @default 0.42
 * @range 0, 1
 */
uniform float u_idleY;

/**
 * @label Tint
 * @color
 * @default #ffd1e6
 */
uniform vec3 u_tint;

vec3 hue(float h) {
  return clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
}

void main() {
  vec2 res = u_resolution;
  vec2 idle = vec2(u_idleX, 1.0 - u_idleY) * res;
  bool inside = u_mouse.x > 1.0 && u_mouse.y > 1.0 && u_mouse.x < res.x - 1.0 && u_mouse.y < res.y - 1.0;
  vec2 center = inside ? u_mouse : idle;

  vec2 p = gl_FragCoord.xy - center;
  float ang = atan(p.y, p.x);
  float wob = u_wobble * (0.06 * sin(ang * 3.0 + u_time * 1.7) + 0.04 * sin(ang * 5.0 - u_time * 2.3));
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

  vec2 uv = gl_FragCoord.xy / res;
  vec2 c = center / res;
  vec2 zoom = c + (uv - c) * (1.0 - u_magnify * h);
  vec2 bend = n.xy * edge * u_refraction * r / res;
  vec2 ca = n.xy * edge * u_chromatic * 6.0 / res;

  vec3 col;
  col.r = texture2D(u_backdrop, zoom - bend + ca).r;
  col.g = texture2D(u_backdrop, zoom - bend).g;
  col.b = texture2D(u_backdrop, zoom - bend - ca).b;
  col *= mix(vec3(1.0), u_tint, 0.25);

  float fres = pow(1.0 - n.z, 2.5);
  vec3 film = hue(fract(ang / 6.2831 + dc * 0.8 + u_time * 0.05));
  col = mix(col, col + film * 0.6, fres * u_iridescence);

  vec3 l = normalize(vec3(-0.5, 0.6, 0.8));
  float spec = pow(max(dot(reflect(-l, n), vec3(0.0, 0.0, 1.0)), 0.0), 60.0);
  col += vec3(spec) * 0.9;
  col += vec3(1.0) * smoothstep(0.92, 1.0, dc) * 0.25;

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0) * mask;
}
