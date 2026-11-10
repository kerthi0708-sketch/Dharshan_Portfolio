import { ImageResponse } from "next/og";

export const alt = "Kerthik Dharshan — AI & ML Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0b0a",
          color: "#f1ede4",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#8c877c", letterSpacing: 4 }}>
          <span>PORTFOLIO</span>
          <span>CHENNAI, TAMIL NADU</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 120, fontWeight: 800, lineHeight: 0.95, letterSpacing: -4 }}>
            <span>KERTHIK</span>
            <span>DHARSHAN</span>
          </div>
          <span style={{ marginTop: 28, fontSize: 34, letterSpacing: 6, color: "#9d8cf2" }}>AI &amp; ML ENGINEER</span>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#c9c4b8" }}>
          Machine learning · Edge AI · Computer vision · Grounded AI · Full-stack
        </div>
      </div>
    ),
    size,
  );
}
