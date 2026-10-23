import type { ReactNode } from "react";
import type { HallExhibit } from "./content";

// The small jelly exhibits of the collection halls (prototype:
// experiments/nevalyashka/ideas/halls.html). Flat SVG in soft brand
// fuchsia-pinks, kept lighter than --primary so the accent words of the
// heading stay the strongest pink on screen: a radial "jelly" body, a
// lighter one for inner parts, a blurred white
// shine and a soft floor shadow. 200×200 box, floor at y≈178.
// Parts that move on hover carry data-part (hall-card.tsx).

function gear(cx: number, cy: number, r: number, teeth: number) {
  const inner = r * 0.78;
  const half = (Math.PI / (teeth * 2)) * 0.55;
  const points: string[] = [];
  for (let i = 0; i < teeth * 2; i++) {
    const a = (i / (teeth * 2)) * Math.PI * 2;
    const rr = i % 2 ? inner : r;
    for (const t of [a - half, a + half]) {
      points.push(
        `${(cx + rr * Math.cos(t)).toFixed(1)} ${(cy + rr * Math.sin(t)).toFixed(1)}`,
      );
    }
  }
  return `M${points.join(" L")} Z`;
}

const GEAR_A = gear(82, 118, 46, 10);
const GEAR_B = gear(146, 74, 30, 8);

const CURSOR = "M140 140 l0 40 l10 -10 l8 18 l8 -4 l-8 -17 l15 0z";

function art(
  kind: HallExhibit,
  f: { jelly: string; light: string; soft: string },
) {
  const shine = (d: string) => (
    <path d={d} fill="#fff" opacity={0.7} filter={f.soft} />
  );
  const bar = (x: number, y: number, w: number, h: number, o: number) => (
    <rect x={x} y={y} width={w} height={h} rx={h / 2} fill="#fff" opacity={o} />
  );
  const parts: Record<HallExhibit, ReactNode> = {
    browser: (
      <>
        <rect x="22" y="48" width="156" height="122" rx="22" fill={f.jelly} />
        <rect
          x="34"
          y="78"
          width="132"
          height="80"
          rx="12"
          fill={f.light}
          opacity={0.9}
        />
        <circle cx="44" cy="63" r="5" fill="#fff" opacity={0.85} />
        <circle cx="58" cy="63" r="5" fill="#fff" opacity={0.6} />
        <circle cx="72" cy="63" r="5" fill="#fff" opacity={0.45} />
        {bar(46, 92, 64, 9, 0.8)}
        {bar(46, 108, 98, 7, 0.45)}
        {bar(46, 121, 80, 7, 0.45)}
        {shine("M36 60 q10 -8 40 -8 q-30 6 -36 22z")}
      </>
    ),
    landing: (
      <>
        <rect x="52" y="20" width="96" height="160" rx="18" fill={f.light} />
        {bar(66, 40, 68, 10, 0.9)}
        {bar(66, 56, 50, 10, 0.9)}
        {bar(66, 76, 68, 6, 0.5)}
        {bar(66, 88, 58, 6, 0.5)}
        <rect x="30" y="112" width="140" height="44" rx="22" fill={f.jelly} />
        {bar(72, 129, 56, 10, 0.9)}
        {shine("M44 120 q24 -8 60 -6 q-36 4 -56 14z")}
        <path
          d={CURSOR}
          fill="#1a1a1a"
          stroke="#fff"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </>
    ),
    app: (
      <>
        <rect
          x="34"
          y="28"
          width="146"
          height="112"
          rx="20"
          fill={f.light}
          opacity={0.6}
        />
        <rect x="20" y="46" width="160" height="128" rx="22" fill={f.jelly} />
        <rect
          x="32"
          y="60"
          width="34"
          height="102"
          rx="12"
          fill={f.light}
          opacity={0.85}
        />
        <circle cx="49" cy="76" r="8" fill="#fff" opacity={0.9} />
        {bar(41, 96, 16, 5, 0.7)}
        {bar(41, 108, 16, 5, 0.5)}
        {bar(41, 120, 16, 5, 0.5)}
        {bar(78, 62, 48, 8, 0.8)}
        <circle cx="160" cy="66" r="8" fill="#fff" opacity={0.7} />
        <path
          d="M80 148 L100 128 L118 138 L146 104 L166 114"
          fill="none"
          stroke="#fff"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.9}
        />
        <circle cx="146" cy="104" r="7" fill="#fff" />
        {shine("M34 58 q24 -10 60 -8 q-38 4 -54 18z")}
      </>
    ),
    gears: (
      <>
        <g data-part="spin" style={{ transformOrigin: "82px 118px" }}>
          <path d={GEAR_A} fill={f.jelly} strokeLinejoin="round" />
          <circle cx="82" cy="118" r="15" fill="#fff" opacity={0.85} />
        </g>
        <g data-part="spin-back" style={{ transformOrigin: "146px 74px" }}>
          <path d={GEAR_B} fill={f.light} strokeLinejoin="round" />
          <circle cx="146" cy="74" r="10" fill="#fff" opacity={0.8} />
        </g>
        {shine("M52 98 q14 -18 40 -20 q-26 8 -36 26z")}
      </>
    ),
    widget: (
      <>
        <rect x="30" y="58" width="140" height="64" rx="32" fill={f.light} />
        <circle data-part="knob" cx="138" cy="90" r="26" fill={f.jelly} />
        {shine("M126 72 q8 -6 18 -4 q-12 2 -16 10z")}
        <rect
          x="30"
          y="138"
          width="140"
          height="14"
          rx="7"
          fill={f.light}
          opacity={0.8}
        />
        <rect x="30" y="138" width="88" height="14" rx="7" fill={f.jelly} />
        <circle
          cx="118"
          cy="145"
          r="14"
          fill="#fff"
          stroke="#f765b9"
          strokeWidth="5"
        />
      </>
    ),
    question: (
      <>
        <path
          d="M62 78 q0 -46 40 -46 q40 0 40 38 q0 22 -22 34 q-12 7 -12 22 v8"
          fill="none"
          stroke={f.jelly}
          strokeWidth="30"
          strokeLinecap="round"
        />
        <circle cx="108" cy="162" r="16" fill={f.jelly} />
        {shine("M70 62 q8 -22 32 -24 q-22 10 -26 28z")}
      </>
    ),
  };
  return parts[kind];
}

export function HallExhibitArt({ kind }: { kind: HallExhibit }) {
  // Ids are per kind: each exhibit appears once on the page.
  const id = (name: string) => `hall-${kind}-${name}`;
  const ref = (name: string) => `url(#${id(name)})`;
  return (
    <svg
      viewBox="0 0 200 200"
      className="block size-full overflow-visible"
      data-exhibit={kind}
    >
      <defs>
        <radialGradient id={id("jelly")} cx="35%" cy="28%" r="85%">
          <stop offset="0" stopColor="#ffd2ec" />
          <stop offset=".45" stopColor="#ff8fce" />
          <stop offset="1" stopColor="#f560b6" />
        </radialGradient>
        <radialGradient id={id("light")} cx="35%" cy="28%" r="85%">
          <stop offset="0" stopColor="#fff2f9" />
          <stop offset=".5" stopColor="#ffd0ea" />
          <stop offset="1" stopColor="#ffa6d9" />
        </radialGradient>
        <radialGradient id={id("shadow")} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#f560b6" stopOpacity=".28" />
          <stop offset="1" stopColor="#f560b6" stopOpacity="0" />
        </radialGradient>
        <filter id={id("soft")} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>
      <ellipse cx="100" cy="182" rx="62" ry="9" fill={ref("shadow")} />
      {art(kind, {
        jelly: ref("jelly"),
        light: ref("light"),
        soft: ref("soft"),
      })}
    </svg>
  );
}
