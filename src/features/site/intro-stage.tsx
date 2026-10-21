"use client";

import { type ReactNode, useRef, useState } from "react";
import {
  BLANK_PIXEL,
  INTRO_ART,
  INTRO_SOURCES,
  PHONE_MEDIA,
  TALL_ART_MEDIA,
} from "./intro-art";
import { IntroScene } from "./intro-scene";
import { useIntroScrollHandoff } from "./intro-scroll-handoff";

type Props = {
  alt: string;
  /** Copy overlaid on the artwork (rendered by the server component). */
  children: ReactNode;
};

export function IntroStage({ alt, children }: Props) {
  const [live, setLive] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  useIntroScrollHandoff(stageRef);

  return (
    // Fills the viewport (svh: stable under mobile browser toolbars), with a
    // floor so short landscape phones still fit the wordmark and copy.
    <div
      ref={stageRef}
      data-live={live}
      className="group relative h-svh min-h-[560px] w-full overflow-hidden"
    >
      <picture>
        <source media={PHONE_MEDIA} srcSet={BLANK_PIXEL} />
        <source
          media={TALL_ART_MEDIA}
          type="image/avif"
          srcSet={INTRO_SOURCES.tallAvif}
          sizes="100vw"
        />
        <source
          media={TALL_ART_MEDIA}
          type="image/webp"
          srcSet={INTRO_SOURCES.tallWebp}
          sizes="100vw"
        />
        <source
          type="image/avif"
          srcSet={INTRO_SOURCES.desktopAvif}
          sizes="100vw"
        />
        <source
          type="image/webp"
          srcSet={INTRO_SOURCES.desktopWebp}
          sizes="100vw"
        />
        <img
          src={INTRO_SOURCES.fallback}
          alt={alt}
          width={INTRO_ART.desktop.width}
          height={INTRO_ART.desktop.height}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>

      <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-data-[live=true]:opacity-100">
        <IntroScene
          stageRef={stageRef}
          copyRef={copyRef}
          onLiveChange={setLive}
        />
      </div>

      {/* While the live scene paints, it draws this copy itself (so the drop
          can refract it); the HTML stays for screen readers and search. */}
      <div
        ref={copyRef}
        className="pointer-events-none absolute inset-0 transition-opacity duration-700 group-data-[live=true]:opacity-0"
      >
        {children}
      </div>
    </div>
  );
}
