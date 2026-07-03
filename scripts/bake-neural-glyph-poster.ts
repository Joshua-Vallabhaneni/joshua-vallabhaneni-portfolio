import { createCanvas } from "canvas";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import {
  DENSITY,
  GLYPH_SEED,
  generateGlyphGeometry,
} from "../app/components/neural-glyph/geometry";

const WIDTH = 1920;
const HEIGHT = 1080;

interface ThemeSpec {
  name: "dark" | "light";
  bg: string;
  fg: string;
  lineAlpha: number;
  primaryAlpha: number;
  backgroundAlpha: number;
}

const THEMES: ThemeSpec[] = [
  {
    name: "dark",
    bg: "hsl(0, 0%, 6%)",
    fg: "rgba(245, 245, 245, 1)",
    lineAlpha: 0.12,
    primaryAlpha: 0.75,
    backgroundAlpha: 0.14,
  },
  {
    name: "light",
    bg: "hsl(0, 0%, 98%)",
    fg: "rgba(17, 17, 17, 1)",
    lineAlpha: 0.1,
    primaryAlpha: 0.45,
    backgroundAlpha: 0.09,
  },
];

function project(
  x: number,
  y: number,
  z: number,
): { sx: number; sy: number; perspective: number } {
  const camZ = 3.2;
  const fovScale = 700;
  const d = camZ - z;
  const perspective = fovScale / d;
  return {
    sx: WIDTH / 2 + x * perspective,
    sy: HEIGHT / 2 - y * perspective,
    perspective: perspective / fovScale,
  };
}

async function bake(theme: ThemeSpec) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const geom = generateGlyphGeometry(GLYPH_SEED, DENSITY.desktop);

  // Background points first (behind)
  for (let i = geom.primaryCount; i < geom.totalCount; i++) {
    const x = geom.nodePositions[i * 3];
    const y = geom.nodePositions[i * 3 + 1];
    const z = geom.nodePositions[i * 3 + 2];
    const { sx, sy, perspective } = project(x, y, z);
    const radius = 1.2 * perspective;
    ctx.beginPath();
    ctx.fillStyle = theme.fg.replace("1)", `${theme.backgroundAlpha})`);
    ctx.arc(sx, sy, Math.max(0.5, radius), 0, Math.PI * 2);
    ctx.fill();
  }

  // Lines
  ctx.strokeStyle = theme.fg.replace("1)", `${theme.lineAlpha})`);
  ctx.lineWidth = 1;
  for (let i = 0; i < geom.lineIndices.length; i += 2) {
    const a = geom.lineIndices[i];
    const b = geom.lineIndices[i + 1];
    const ax = geom.nodePositions[a * 3];
    const ay = geom.nodePositions[a * 3 + 1];
    const az = geom.nodePositions[a * 3 + 2];
    const bx = geom.nodePositions[b * 3];
    const by = geom.nodePositions[b * 3 + 1];
    const bz = geom.nodePositions[b * 3 + 2];
    const pa = project(ax, ay, az);
    const pb = project(bx, by, bz);
    ctx.beginPath();
    ctx.moveTo(pa.sx, pa.sy);
    ctx.lineTo(pb.sx, pb.sy);
    ctx.stroke();
  }

  // Primary points
  for (let i = 0; i < geom.primaryCount; i++) {
    const x = geom.nodePositions[i * 3];
    const y = geom.nodePositions[i * 3 + 1];
    const z = geom.nodePositions[i * 3 + 2];
    const { sx, sy, perspective } = project(x, y, z);
    const radius = 2.6 * perspective;
    const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, radius);
    grad.addColorStop(0, theme.fg.replace("1)", `${theme.primaryAlpha})`));
    grad.addColorStop(1, theme.fg.replace("1)", "0)"));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(sx, sy, Math.max(1.2, radius), 0, Math.PI * 2);
    ctx.fill();
  }

  const png = canvas.toBuffer("image/png");
  const out = join(
    process.cwd(),
    "public",
    `neural-glyph-poster-${theme.name}.webp`,
  );
  const webp = await sharp(png).webp({ quality: 80, effort: 6 }).toBuffer();
  await writeFile(out, webp);
  console.log(`✓ wrote ${out} (${(webp.length / 1024).toFixed(1)}KB)`);
}

async function main() {
  for (const theme of THEMES) {
    await bake(theme);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
