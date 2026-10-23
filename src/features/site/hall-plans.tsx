import type { ReactNode } from "react";
import type { HallExhibit, Market } from "./content";

// Fine-line plans of the collection halls (prototype:
// experiments/nevalyashka/ideas/halls-v2.html, "Чертежи" → "Подробный").
// 240×160 box. Classes the CSS styles and animates (globals.css → halls):
// .ln outlines and .fl soft fills draw in grey, .ac/.acf is the one accent
// that turns pink on hover, and .ann holds the dimension lines (.an) and
// mono notes. Every stroked path has pathLength 1 so it can draw itself in.

const NOTES: Record<Market, Record<string, string>> = {
  en: {
    hero: "hero · cards",
    action: "one action",
    scroll: "1 scroll",
    idea: "your idea",
    bot: "bot",
    sheets: "Sheets",
    q1: "Q1",
    q4: "Q4",
  },
  ru: {
    hero: "экран · карточки",
    action: "одно действие",
    scroll: "1 экран",
    idea: "ваша идея",
    bot: "бот",
    sheets: "Таблицы",
    q1: "I кв",
    q4: "IV кв",
  },
};

function Ln({ d }: { d: string }) {
  return <path className="ln" pathLength={1} d={d} />;
}
function An({ d }: { d: string }) {
  return <path className="an" pathLength={1} d={d} />;
}
function Note({
  x,
  y,
  end,
  mid,
  children,
}: {
  x: number;
  y: number;
  end?: boolean;
  mid?: boolean;
  children: ReactNode;
}) {
  return (
    <text x={x} y={y} textAnchor={end ? "end" : mid ? "middle" : undefined}>
      {children}
    </text>
  );
}

function plan(kind: HallExhibit, t: Record<string, string>) {
  switch (kind) {
    case "browser":
      return {
        art: (
          <>
            <rect className="fl" x="10" y="26" width="220" height="40" rx="3" />
            <Ln d="M6 4 H234 V156 H6 Z" />
            <Ln d="M6 20 H234" />
            <Ln d="M16 12 h0.01 M26 12 h0.01 M36 12 h0.01" />
            <Ln d="M20 36 H140 M20 48 H110" />
            <Ln d="M20 82 H100 V140 H20 Z M120 82 H220 V140 H120 Z" />
            <rect
              className="acf"
              x="160"
              y="34"
              width="56"
              height="18"
              rx="9"
            />
            <path
              className="ac"
              pathLength={1}
              d="M169 34 H207 A9 9 0 0 1 207 52 H169 A9 9 0 0 1 169 34 Z"
            />
          </>
        ),
        notes: (
          <>
            <An d="M6 -12 H234 M6 -16 V-8 M234 -16 V-8" />
            <Note x={120} y={-16} mid>
              1440
            </Note>
            <Note x={188} y={64} mid>
              CTA
            </Note>
            <Note x={20} y={152}>
              {t.hero}
            </Note>
          </>
        ),
      };
    case "landing":
      return {
        art: (
          <>
            <Ln d="M70 2 H170 V158 H70 Z" />
            <Ln d="M84 20 H156 M84 32 H140" />
            <Ln d="M84 50 H156 M84 58 H150 M84 66 H128" />
            <rect className="fl" x="84" y="122" width="72" height="24" rx="2" />
            <Ln d="M84 122 H156 M84 134 H140" />
            <rect
              className="acf"
              x="84"
              y="84"
              width="72"
              height="22"
              rx="11"
            />
            <path
              className="ac"
              pathLength={1}
              d="M95 84 H145 A11 11 0 0 1 145 106 H95 A11 11 0 0 1 95 84 Z"
            />
          </>
        ),
        notes: (
          <>
            <An d="M184 2 V158 M180 2 H188 M180 158 H188 M60 95 H82" />
            <Note x={192} y={82}>
              {t.scroll}
            </Note>
            <Note x={56} y={98} end>
              {t.action}
            </Note>
          </>
        ),
      };
    case "app":
      return {
        art: (
          <>
            <Ln d="M6 4 H234 V156 H6 Z" />
            <Ln d="M52 4 V156" />
            <Ln d="M16 20 H42 M16 34 H38 M16 46 H38 M16 58 H38" />
            <rect className="fl" x="64" y="16" width="160" height="26" rx="2" />
            <Ln d="M64 140 H224 M64 140 V56" />
            <path
              className="ac"
              pathLength={1}
              d="M70 128 L104 104 L136 114 L176 76 L218 86"
            />
            <circle className="acf" cx="176" cy="76" r="4" />
          </>
        ),
        notes: (
          <>
            <An d="M64 150 H224 M64 146 V154 M224 146 V154" />
            <Note x={64} y={162}>
              {t.q1}
            </Note>
            <Note x={224} y={162} end>
              {t.q4}
            </Note>
            <Note x={186} y={68}>
              +38%
            </Note>
          </>
        ),
      };
    case "gears":
      return {
        art: (
          <>
            <Ln d="M10 80 a22 22 0 1 0 44 0 a22 22 0 1 0 -44 0" />
            <Ln d="M98 58 H142 V102 H98 Z" />
            <Ln d="M186 80 a22 22 0 1 0 44 0 a22 22 0 1 0 -44 0" />
            <path className="ac" pathLength={1} d="M54 80 H98 M142 80 H186" />
            <circle className="acf" cx="120" cy="80" r="5" />
            <Ln d="M92 120 H148 M104 132 H136" />
          </>
        ),
        notes: (
          <>
            <An d="M60 70 Q120 30 180 70" />
            <Note x={32} y={116} mid>
              CRM
            </Note>
            <Note x={120} y={50} mid>
              {t.bot}
            </Note>
            <Note x={208} y={116} mid>
              {t.sheets}
            </Note>
          </>
        ),
      };
    case "widget":
      return {
        art: (
          <>
            <Ln d="M10 40 H230" />
            <path className="ac" pathLength={1} d="M10 40 H150" />
            <circle className="acf" cx="150" cy="40" r="7" />
            <Ln d="M143 40 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0" />
            <Ln d="M10 84 H90 A14 14 0 0 1 90 112 H10 A14 14 0 0 1 10 84 Z" />
            <Ln d="M116 84 H222 V112 H116 Z M150 84 V112 M186 84 V112" />
            <rect
              className="fl"
              x="10"
              y="132"
              width="212"
              height="20"
              rx="2"
            />
          </>
        ),
        notes: (
          <>
            <An d="M150 48 V52" />
            <Note x={10} y={30}>
              0
            </Note>
            <Note x={230} y={30} end>
              100
            </Note>
            <Note x={150} y={58} mid>
              64
            </Note>
          </>
        ),
      };
    case "question":
      return {
        art: (
          <>
            <Ln d="M70 30 H170 V130 H70 Z" />
            <Ln d="M60 20 H72 M60 20 V32 M180 20 H168 M180 20 V32 M60 140 H72 M60 140 V128 M180 140 H168 M180 140 V128" />
            <path className="ac" pathLength={1} d="M120 58 V102 M98 80 H142" />
          </>
        ),
        notes: (
          <>
            <An d="M60 150 H180 M60 146 V154 M180 146 V154" />
            <Note x={120} y={162} mid>
              {t.idea}
            </Note>
          </>
        ),
      };
  }
}

export function HallPlan({ kind, lang }: { kind: HallExhibit; lang: Market }) {
  const { art, notes } = plan(kind, NOTES[lang]);
  return (
    <svg
      viewBox="0 0 240 160"
      className="block w-full overflow-visible"
      data-plan={kind}
    >
      {art}
      <g className="ann">{notes}</g>
    </svg>
  );
}
