import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Ludvik4 — веб-продукты от идеи до релиза";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 128,
        background: "#0a0a0a",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        padding: 40,
      }}
    >
      <div
        style={{
          fontSize: 80,
          fontWeight: 700,
          color: "white",
          letterSpacing: "-2px",
        }}
      >
        Ludvik4
      </div>
      <div
        style={{
          fontSize: 40,
          color: "#a1a1a1",
          textAlign: "center",
        }}
      >
        Веб-продукты — от идеи до релиза
      </div>
    </div>,
    {
      ...size,
    },
  );
}
