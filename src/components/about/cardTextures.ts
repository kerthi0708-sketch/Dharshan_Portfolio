/**
 * Canvas-drawn textures for the hanging ID card and its lanyard.
 * Everything is generated at runtime — no external image assets.
 */

const INK = "#f1ede4";
const MUTED = "#8c877c";
const VIOLET = "#9d8cf2";
const ACCENT = "#ff6a3d";

function fontFamily(varName: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return v ? `${v}, ${fallback}` : fallback;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Designed ID card face (1024 × 1440, cropped and colour-graded to the site palette). */
export const CARD_FACE_SRC = "/id-card.webp";

/** Loads the card face; resolves to null if it can't be loaded. */
export function loadCardFace(): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = CARD_FACE_SRC;
  });
}

/** Front face of the card. Aspect 1.6 : 2.25 */
export function drawCardFront(face?: CanvasImageSource | null): HTMLCanvasElement {
  const W = 1024;
  const H = 1440;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;

  // The designed card face fills the whole front; only the lanyard slot is added.
  if (face) {
    ctx.drawImage(face, 0, 0, W, H);
    ctx.fillStyle = "#050505";
    roundRect(ctx, W / 2 - 110, 70, 220, 34, 17);
    ctx.fill();
    ctx.strokeStyle = "rgba(241,237,228,0.18)";
    ctx.lineWidth = 2;
    ctx.stroke();
    return c;
  }
  // Fallback (face image unavailable): the drawn layout below.
  const sans = fontFamily("--font-archivo", "Arial, sans-serif");
  const mono = fontFamily("--font-jetbrains", "monospace");
  const serif = fontFamily("--font-instrument", "Georgia, serif");

  // Base
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "#1b1a18");
  g.addColorStop(1, "#0e0e0d");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // Fine engineering grid
  ctx.strokeStyle = "rgba(241,237,228,0.045)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, H);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(W, y + 0.5);
    ctx.stroke();
  }

  // Soft violet light top-left (behind the info column)
  const rg = ctx.createRadialGradient(W * 0.1, H * 0.08, 0, W * 0.1, H * 0.08, W * 0.9);
  rg.addColorStop(0, "rgba(157,140,242,0.22)");
  rg.addColorStop(1, "rgba(157,140,242,0)");
  ctx.fillStyle = rg;
  ctx.fillRect(0, 0, W, H);

  // ── Right half: monogram in place of the portrait ───────────────
  const HALF = W / 2;
  ctx.fillStyle = "#141412";
  ctx.fillRect(HALF, 0, HALF, H);
  ctx.fillStyle = INK;
  ctx.font = `italic 240px ${serif}`;
  ctx.fillText("K", HALF + 120, 560);
  ctx.fillStyle = VIOLET;
  ctx.fillText("d", HALF + 250, 600);
  // Soft shade where the photo meets the info column, so the name reads cleanly
  const shade = ctx.createLinearGradient(HALF, 0, HALF + 170, 0);
  shade.addColorStop(0, "rgba(10,10,9,0.55)");
  shade.addColorStop(1, "rgba(10,10,9,0)");
  ctx.fillStyle = shade;
  ctx.fillRect(HALF, 0, 170, H);
  // Divider between the halves
  ctx.fillStyle = "rgba(157,140,242,0.45)";
  ctx.fillRect(HALF - 1, 0, 2, H);

  // Lanyard slot (punched through the card, across both halves)
  ctx.fillStyle = "#050505";
  roundRect(ctx, W / 2 - 110, 70, 220, 34, 17);
  ctx.fill();
  ctx.strokeStyle = "rgba(241,237,228,0.18)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // ── Left half: identity details ────────────────────────────────
  const X0 = 64;
  const X1 = HALF - 48;
  const COL = X1 - X0;
  const fit = (text: string, weight: number, family: string, max: number, width = COL) => {
    ctx.font = `${weight} 100px ${family}`;
    return Math.min(max, Math.floor((width / ctx.measureText(text).width) * 100));
  };

  // Header
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = MUTED;
  ctx.font = `500 22px ${mono}`;
  ctx.fillText("IDENTIFICATION", X0, 200);
  ctx.textAlign = "right";
  ctx.fillText("KD / AI·ML", X1, 200);
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(241,237,228,0.16)";
  ctx.fillRect(X0, 230, COL, 2);

  // Focus areas
  ctx.fillStyle = MUTED;
  ctx.font = `500 20px ${mono}`;
  ctx.fillText("FOCUS", X0, 330);
  ctx.font = `500 ${fit("COMPUTER VISION", 500, mono, 25) - 1}px ${mono}`;
  const tags = ["MACHINE LEARNING", "EDGE AI", "COMPUTER VISION", "GROUNDED AI", "FULL-STACK"];
  tags.forEach((t, i) => {
    const y = 400 + i * 58;
    ctx.fillStyle = i === 0 ? VIOLET : "rgba(241,237,228,0.25)";
    ctx.fillRect(X0, y - 14, 10, 10);
    ctx.fillStyle = i === 0 ? INK : MUTED;
    ctx.fillText(t, X0 + 28, y);
  });

  // Name — mid-card, running across the divider and over the photo
  // (sits just below the chin, over the dark jacket).
  const NAME_W = 700;
  const nameSize = Math.min(fit("KERTHIK", 800, sans, 132, NAME_W), fit("DHARSHAN", 800, sans, 132, NAME_W));
  const nameY = 880;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = INK;
  ctx.font = `800 ${nameSize}px ${sans}`;
  ctx.fillText("KERTHIK", X0 - 4, nameY);
  ctx.fillText("DHARSHAN", X0 - 4, nameY + nameSize * 0.95);
  ctx.restore();

  // Role
  const roleY = nameY + nameSize * 0.95 + 56;
  ctx.fillStyle = VIOLET;
  ctx.fillRect(X0, roleY, 44, 6);
  ctx.fillStyle = INK;
  ctx.font = `600 ${fit("AI & ML ENGINEER", 600, mono, 34)}px ${mono}`;
  ctx.fillText("AI & ML ENGINEER", X0, roleY + 58);

  // Footer
  ctx.fillStyle = "rgba(241,237,228,0.16)";
  ctx.fillRect(X0, 1250, COL, 2);
  ctx.fillStyle = MUTED;
  ctx.font = `500 21px ${mono}`;
  ctx.fillText("BUILDING", X0, 1308);
  ctx.fillText("INTELLIGENT PRODUCTS", X0, 1340);
  ctx.fillStyle = ACCENT;
  ctx.beginPath();
  ctx.arc(X1 - 14, 1318, 14, 0, Math.PI * 2);
  ctx.fill();

  return c;
}

/** Back face of the card. */
export function drawCardBack(): HTMLCanvasElement {
  const W = 1024;
  const H = 1440;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  const serif = fontFamily("--font-instrument", "Georgia, serif");
  const mono = fontFamily("--font-jetbrains", "monospace");

  ctx.fillStyle = "#121210";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(157,140,242,0.35)";
  ctx.lineWidth = 2;
  for (let r = 120; r < 900; r += 70) {
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, r, 0, Math.PI * 2);
    ctx.globalAlpha = Math.max(0.05, 0.6 - r / 1400);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#050505";
  roundRect(ctx, W / 2 - 110, 70, 220, 34, 17);
  ctx.fill();
  ctx.fillStyle = INK;
  ctx.textAlign = "center";
  ctx.font = `italic 260px ${serif}`;
  ctx.fillText("Kd", W / 2, H / 2 + 80);
  ctx.fillStyle = MUTED;
  ctx.font = `500 28px ${mono}`;
  ctx.fillText("DATA → MODEL → PRODUCT", W / 2, H - 120);
  return c;
}

/** Repeating lanyard strap texture. */
export function drawBand(): HTMLCanvasElement {
  const W = 1024;
  const H = 96;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  const mono = fontFamily("--font-jetbrains", "monospace");
  ctx.fillStyle = "#17161a";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = VIOLET;
  ctx.fillRect(0, 0, W, 6);
  ctx.fillRect(0, H - 6, W, 6);
  ctx.fillStyle = INK;
  ctx.font = `600 34px ${mono}`;
  ctx.textBaseline = "middle";
  ctx.fillText("KERTHIK DHARSHAN", 40, H / 2 + 2);
  ctx.fillStyle = VIOLET;
  ctx.fillText("✦", 430, H / 2 + 2);
  ctx.fillStyle = INK;
  ctx.fillText("AI & ML ENGINEER", 500, H / 2 + 2);
  ctx.fillStyle = VIOLET;
  ctx.fillText("✦", 880, H / 2 + 2);
  return c;
}
