"use client";

import {
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  type Ref,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  MASCOT_PIVOT,
  STAGE_ART,
  STAGE_SIZES,
  STAGE_SOURCES,
  TALL_MEDIA,
} from "./exhibit-art";
import { ExhibitCanvas } from "./exhibit-canvas";

// The exhibit stage shell. The pre-rendered stills paint first, as two
// layers: the stage (with the mascot's shadow) and the mascot alone. Where the
// live scene may run, the canvas fades in over them. Where it does not —
// phones, touch, no GPU, or a machine that stepped down the whole quality
// ladder — the mascot layer rocks with CSS and wobbles when tapped, unless
// the visitor asked for reduced motion.
//
// The copy (header, label, strip) is server-rendered and passed in; it sits
// above with pointer events only on its interactive parts.

/** A tap's wobble: tilt (deg) per keyframe, decaying like a roly-poly. */
const PUSH_DEGREES = [0, 14, -9, 5, -2.5, 0];

function Still({
  layer,
  className,
  style,
  imgRef,
  rocking,
}: {
  layer: "bg" | "mascot";
  className: string;
  style?: CSSProperties;
  imgRef?: Ref<HTMLImageElement>;
  rocking?: boolean;
}) {
  const src = STAGE_SOURCES[layer];
  return (
    <picture>
      <source media={TALL_MEDIA} srcSet={src.tall} sizes={STAGE_SIZES.tall} />
      <img
        ref={imgRef}
        src={src.fallback}
        srcSet={src.desktop}
        sizes={STAGE_SIZES.desktop}
        alt=""
        width={STAGE_ART.desktop.width}
        height={STAGE_ART.desktop.height}
        fetchPriority="high"
        decoding="async"
        data-rocking={rocking === undefined ? undefined : String(rocking)}
        className={className}
        style={style}
      />
    </picture>
  );
}

// The rolling sphere's centre in units of the stage's shorter side (cqmin:
// the section is a size container), and how far it rolls per radian.
const PIVOT_STYLE = {
  transformOrigin: `calc(50% + ${(MASCOT_PIVOT.x * 100).toFixed(3)}cqmin) calc(50% - ${(MASCOT_PIVOT.y * 100).toFixed(3)}cqmin)`,
  "--exhibit-roll": `${(MASCOT_PIVOT.roll * 100).toFixed(3)}cqmin`,
} as CSSProperties;

export function ExhibitStage({
  label,
  pushLabel,
  children,
}: {
  /** Accessible name of the stage section. */
  label: string;
  /** Accessible name of the button that pushes the rocking still. */
  pushLabel: string;
  children: ReactNode;
}) {
  const [live, setLive] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const stageRef = useRef<HTMLElement>(null);
  const mascotRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setReducedMotion(
      typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  const rocking = !live && !reducedMotion;

  const push = (event: MouseEvent<HTMLElement>) => {
    const mascot = mascotRef.current;
    if (typeof mascot?.animate !== "function") return;
    const rect = event.currentTarget.getBoundingClientRect();
    // Away from the tapped side, like the live scene; a keyboard press
    // (clientX 0) pushes one way.
    const dir = event.clientX < rect.left + rect.width / 2 ? 1 : -1;
    mascot.animate(
      PUSH_DEGREES.map((deg) => ({
        // Rolling without slipping: the centre moves one radius per radian.
        transform: `translateX(calc(var(--exhibit-roll) * ${((dir * deg * Math.PI) / 180).toFixed(4)})) rotate(${dir * deg}deg)`,
      })),
      { duration: 1600, easing: "ease-out" },
    );
  };

  return (
    <section
      ref={stageRef}
      aria-label={label}
      data-live={live}
      data-stage
      style={{ containerType: "size" }}
      className="group bg-pink-soft relative h-svh min-h-[560px] w-full overflow-hidden select-none"
    >
      {/* Phone framing, as the shader does it (exhibit-gate.ts →
          stageFraming): 1.38× about the mascot, its centre moved to 53% / 43%.
          Translate applies before scale, so the offsets stay in stage units. */}
      <div className="absolute inset-0 max-sm:translate-x-[3%] max-sm:-translate-y-[7%] max-sm:scale-[1.38]">
        <Still
          layer="bg"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <Still
          layer="mascot"
          imgRef={mascotRef}
          rocking={rocking}
          style={PIVOT_STYLE}
          className="exhibit-mascot absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-data-[live=true]:opacity-100">
        <ExhibitCanvas stageRef={stageRef} onLiveChange={setLive} />
      </div>

      {/* Over the canvas layer, which covers the stage even while hidden. */}
      {rocking ? (
        <button
          type="button"
          aria-label={pushLabel}
          onClick={push}
          className="focus-visible:ring-primary absolute top-1/2 left-1/2 size-[56cqmin] -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full focus-visible:ring-2 focus-visible:outline-none"
        />
      ) : null}

      <div className="pointer-events-none absolute inset-0">{children}</div>
    </section>
  );
}
