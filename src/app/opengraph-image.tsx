import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Ludvik4 — цифровые продукты от идеи до запуска";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  // The route runs on the Node runtime (no edge), so read the hero
  // illustration off disk and inline it as a data URI. Dark text sits on the
  // white left panel for contrast; the illustration fills the warm right panel.
  const illustration = await readFile(
    join(process.cwd(), "public", "hero-product-illustration.png"),
  );
  const illustrationSrc = `data:image/png;base64,${illustration.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#ffffff",
      }}
    >
      <div
        style={{
          width: 660,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 64px",
          gap: 24,
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 4,
            color: "#ff4fb6",
          }}
        >
          LUDVIK4
        </div>
        <div
          style={{
            fontSize: 88,
            fontWeight: 800,
            letterSpacing: -3,
            lineHeight: 1.02,
            color: "#1a1a1a",
          }}
        >
          Цифровые продукты
        </div>
        <div style={{ fontSize: 34, color: "#4b5563", lineHeight: 1.3 }}>
          От идеи до запуска
        </div>
        <div
          style={{
            marginTop: 8,
            width: 96,
            height: 6,
            borderRadius: 3,
            background: "#ff4fb6",
          }}
        />
      </div>
      <div
        style={{
          flex: 1,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff8f5",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={illustrationSrc}
          width={520}
          height={347}
          alt=""
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>,
    {
      ...size,
    },
  );
}
