import { createNoise3D } from "simplex-noise";

export const GLYPH_SEED = 0xa17e9b;

export type DensityPreset = "desktop" | "tablet" | "mobile";

export interface DensityConfig {
  primary: number;
  background: number;
  lines: number;
}

export const DENSITY: Record<DensityPreset, DensityConfig> = {
  desktop: { primary: 100, background: 2200, lines: 70 },
  tablet: { primary: 75, background: 1700, lines: 50 },
  mobile: { primary: 50, background: 1200, lines: 30 },
};

export interface GlyphGeometry {
  nodePositions: Float32Array;
  primaryCount: number;
  totalCount: number;
  lineIndices: Uint16Array;
  driftOffsets: Float32Array;
  isPrimary: Float32Array;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededNoise3D(rand: () => number) {
  return createNoise3D(rand);
}

const ELLIPSOID = { rx: 1.25, ry: 0.9, rz: 0.9 };

export function generateGlyphGeometry(
  seed: number,
  density: DensityConfig,
): GlyphGeometry {
  if (
    density.primary <= 0 ||
    density.background < 0 ||
    density.lines < 0 ||
    !Number.isFinite(density.primary) ||
    !Number.isFinite(density.background) ||
    !Number.isFinite(density.lines)
  ) {
    throw new Error(
      `generateGlyphGeometry: invalid density ${JSON.stringify(density)}`,
    );
  }

  const rand = mulberry32(seed);
  const noise = seededNoise3D(mulberry32(seed ^ 0x9e3779b1));

  const total = density.primary + density.background;
  const nodePositions = new Float32Array(total * 3);
  const driftOffsets = new Float32Array(total * 3);
  const isPrimary = new Float32Array(total);

  for (let i = 0; i < density.primary; i++) {
    const u = rand();
    const v = rand();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const sinPhi = Math.sin(phi);
    const x = ELLIPSOID.rx * sinPhi * Math.cos(theta);
    const y = ELLIPSOID.ry * sinPhi * Math.sin(theta);
    const z = ELLIPSOID.rz * Math.cos(phi);
    const noiseAmt = 0.12 * noise(x * 1.4, y * 1.4, z * 1.4);
    nodePositions[i * 3] = x + noiseAmt;
    nodePositions[i * 3 + 1] = y + noiseAmt * 0.7;
    nodePositions[i * 3 + 2] = z + noiseAmt;
    driftOffsets[i * 3] = rand() * Math.PI * 2;
    driftOffsets[i * 3 + 1] = rand() * Math.PI * 2;
    driftOffsets[i * 3 + 2] = rand() * Math.PI * 2;
    isPrimary[i] = 1;
  }

  for (let i = 0; i < density.background; i++) {
    const idx = density.primary + i;
    let x = 0;
    let y = 0;
    let z = 0;
    for (let tries = 0; tries < 8; tries++) {
      x = (rand() * 2 - 1) * ELLIPSOID.rx * 1.05;
      y = (rand() * 2 - 1) * ELLIPSOID.ry * 1.05;
      z = (rand() * 2 - 1) * ELLIPSOID.rz * 1.05;
      const inside =
        (x / ELLIPSOID.rx) ** 2 +
          (y / ELLIPSOID.ry) ** 2 +
          (z / ELLIPSOID.rz) ** 2 <
        1.08;
      if (inside) break;
    }
    const jitter = 0.18 * noise(x * 0.8, y * 0.8, z * 0.8);
    nodePositions[idx * 3] = x + jitter;
    nodePositions[idx * 3 + 1] = y + jitter;
    nodePositions[idx * 3 + 2] = z + jitter;
    driftOffsets[idx * 3] = rand() * Math.PI * 2;
    driftOffsets[idx * 3 + 1] = rand() * Math.PI * 2;
    driftOffsets[idx * 3 + 2] = rand() * Math.PI * 2;
    isPrimary[idx] = 0;
  }

  const candidates: { a: number; b: number; weight: number }[] = [];
  const maxDistSq = 0.85 * 0.85;
  for (let i = 0; i < density.primary; i++) {
    for (let j = i + 1; j < density.primary; j++) {
      const dx = nodePositions[i * 3] - nodePositions[j * 3];
      const dy = nodePositions[i * 3 + 1] - nodePositions[j * 3 + 1];
      const dz = nodePositions[i * 3 + 2] - nodePositions[j * 3 + 2];
      const distSq = dx * dx + dy * dy + dz * dz;
      if (distSq < maxDistSq && distSq > 0.04) {
        candidates.push({ a: i, b: j, weight: 1 / distSq });
      }
    }
  }
  candidates.sort((p, q) => q.weight - p.weight);
  const pairCount = Math.min(density.lines, candidates.length);
  const lineIndices = new Uint16Array(pairCount * 2);
  for (let i = 0; i < pairCount; i++) {
    lineIndices[i * 2] = candidates[i].a;
    lineIndices[i * 2 + 1] = candidates[i].b;
  }

  return {
    nodePositions,
    primaryCount: density.primary,
    totalCount: total,
    lineIndices,
    driftOffsets,
    isPrimary,
  };
}
