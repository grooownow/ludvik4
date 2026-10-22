"use client";

import { type ReactNode, useRef, useState } from "react";
import {
  STAGE_ART,
  STAGE_SIZES,
  STAGE_SOURCES,
  TALL_MEDIA,
} from "./exhibit-art";
import { ExhibitCanvas } from "./exhibit-canvas";

// The exhibit stage shell: the pre-rendered still paints first; where the
// live scene may run, the canvas fades in over it. The copy (header, label,
// strip) is server-rendered and passed in; it sits above the canvas with
// pointer events only on its interactive parts, so drags reach the mascot.
export function ExhibitStage({
  label,
  children,
}: {
  /** Accessible name of the stage section. */
  label: string;
  children: ReactNode;
}) {
  const [live, setLive] = useState(false);
  const stageRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={stageRef}
      aria-label={label}
      data-live={live}
      className="group bg-pink-soft relative h-svh min-h-[560px] w-full overflow-hidden select-none"
    >
      <picture>
        <source
          media={TALL_MEDIA}
          srcSet={STAGE_SOURCES.tall}
          sizes={STAGE_SIZES.tall}
        />
        <img
          src={STAGE_SOURCES.fallback}
          srcSet={STAGE_SOURCES.desktop}
          sizes={STAGE_SIZES.desktop}
          alt=""
          width={STAGE_ART.desktop.width}
          height={STAGE_ART.desktop.height}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>

      <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-data-[live=true]:opacity-100">
        <ExhibitCanvas stageRef={stageRef} onLiveChange={setLive} />
      </div>

      <div className="pointer-events-none absolute inset-0">{children}</div>
    </section>
  );
}
