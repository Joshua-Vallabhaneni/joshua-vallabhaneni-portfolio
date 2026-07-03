"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import {
  DENSITY,
  DensityPreset,
  GLYPH_SEED,
  generateGlyphGeometry,
} from "./geometry";
import { createPointUniforms, pointFragment, pointVertex } from "./shader";

interface SceneProps {
  scrollProgress: number;
  cursor: { x: number; y: number } | null;
  theme: "dark" | "light";
  reducedMotion: boolean;
  density: DensityPreset;
}

const DARK_COLOR: [number, number, number] = [0.96, 0.96, 0.96];
const LIGHT_COLOR: [number, number, number] = [0.08, 0.08, 0.08];
const DARK_LIGHT_DIR: [number, number, number] = [0.6, 0.8, 0.6];
const LIGHT_LIGHT_DIR: [number, number, number] = [-0.5, 0.9, 0.4];

const THEME_TWEEN_MS = 800;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerp3(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

export function Scene({
  scrollProgress,
  cursor,
  theme,
  reducedMotion,
  density,
}: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const { gl, size } = useThree();

  const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1;

  const geometry = useMemo(() => {
    const preset = DENSITY[density];
    return generateGlyphGeometry(GLYPH_SEED, preset);
  }, [density]);

  const pointsGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute(
      "position",
      new THREE.BufferAttribute(geometry.nodePositions, 3),
    );
    geom.setAttribute(
      "a_isPrimary",
      new THREE.BufferAttribute(geometry.isPrimary, 1),
    );
    geom.setAttribute(
      "a_drift",
      new THREE.BufferAttribute(geometry.driftOffsets, 3),
    );
    return geom;
  }, [geometry]);

  const linesGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(geometry.lineIndices.length * 3);
    for (let i = 0; i < geometry.lineIndices.length; i++) {
      const idx = geometry.lineIndices[i];
      positions[i * 3] = geometry.nodePositions[idx * 3];
      positions[i * 3 + 1] = geometry.nodePositions[idx * 3 + 1];
      positions[i * 3 + 2] = geometry.nodePositions[idx * 3 + 2];
    }
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [geometry]);

  const uniforms = useMemo(() => {
    const initial = createPointUniforms(dpr);
    initial.u_color.value = theme === "dark" ? DARK_COLOR : LIGHT_COLOR;
    initial.u_lightDir.value = theme === "dark" ? DARK_LIGHT_DIR : LIGHT_LIGHT_DIR;
    initial.u_opacityPrimary.value = theme === "dark" ? 0.55 : 0.28;
    initial.u_opacityBackground.value = theme === "dark" ? 0.09 : 0.05;
    return initial;
  }, [dpr, theme]);

  const pointMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: pointVertex,
        fragmentShader: pointFragment,
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
      }),
    [uniforms],
  );

  const lineMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color(theme === "dark" ? 0xf5f5f5 : 0x111111),
        transparent: true,
        opacity: theme === "dark" ? 0.09 : 0.07,
        depthWrite: false,
      }),
    [theme],
  );

  const themeTargetRef = useRef({
    color: theme === "dark" ? DARK_COLOR : LIGHT_COLOR,
    lightDir: theme === "dark" ? DARK_LIGHT_DIR : LIGHT_LIGHT_DIR,
    opacityPrimary: theme === "dark" ? 0.55 : 0.28,
    opacityBackground: theme === "dark" ? 0.09 : 0.05,
    lineColor: theme === "dark" ? 0xf5f5f5 : 0x111111,
    lineOpacity: theme === "dark" ? 0.09 : 0.07,
  });

  const themeRef = useRef(theme);
  const themeStartRef = useRef(0);
  if (themeRef.current !== theme) {
    themeStartRef.current = performance.now();
    themeRef.current = theme;
    themeTargetRef.current = {
      color: theme === "dark" ? DARK_COLOR : LIGHT_COLOR,
      lightDir: theme === "dark" ? DARK_LIGHT_DIR : LIGHT_LIGHT_DIR,
      opacityPrimary: theme === "dark" ? 0.55 : 0.28,
      opacityBackground: theme === "dark" ? 0.09 : 0.05,
      lineColor: theme === "dark" ? 0xf5f5f5 : 0x111111,
      lineOpacity: theme === "dark" ? 0.09 : 0.07,
    };
  }

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (reducedMotion) {
      uniforms.u_scrollDissolve.value = scrollProgress;
      uniforms.u_color.value = themeTargetRef.current.color;
      uniforms.u_lightDir.value = themeTargetRef.current.lightDir;
      uniforms.u_opacityPrimary.value = themeTargetRef.current.opacityPrimary;
      uniforms.u_opacityBackground.value = themeTargetRef.current.opacityBackground;
      lineMaterial.color.setHex(themeTargetRef.current.lineColor);
      lineMaterial.opacity = themeTargetRef.current.lineOpacity * (1 - scrollProgress);
      return;
    }

    const t = uniforms.u_time.value + delta;
    uniforms.u_time.value = t;

    // Idle Y rotation ~7°/s and ±3° X wobble over 12s
    groupRef.current.rotation.y += delta * (Math.PI / 180) * 7;
    groupRef.current.rotation.x =
      (Math.PI / 180) * 3 * Math.sin((t / 12) * Math.PI * 2);

    // Breath sine (8s period)
    uniforms.u_breath.value = Math.sin((t / 8) * Math.PI * 2);

    // Scroll dissolve
    uniforms.u_scrollDissolve.value = scrollProgress;

    // Cursor gravity (screen space to world-ish)
    if (cursor) {
      const nx = (cursor.x / size.width) * 2 - 1;
      const ny = -((cursor.y / size.height) * 2 - 1);
      uniforms.u_cursor.value = [nx * 1.4, ny * 0.9, 0.5];
      uniforms.u_cursorStrength.value = lerp(
        uniforms.u_cursorStrength.value,
        1.0,
        Math.min(1, delta * 4),
      );
    } else {
      uniforms.u_cursorStrength.value = lerp(
        uniforms.u_cursorStrength.value,
        0,
        Math.min(1, delta * 4),
      );
    }

    // Theme tween
    const elapsed = performance.now() - themeStartRef.current;
    const tweenT = Math.min(1, elapsed / THEME_TWEEN_MS);
    const eased = 1 - Math.pow(1 - tweenT, 3);
    const target = themeTargetRef.current;
    const cur = uniforms.u_color.value;
    uniforms.u_color.value = lerp3(
      [cur[0], cur[1], cur[2]],
      target.color,
      Math.min(1, delta * 4),
    );
    const ld = uniforms.u_lightDir.value;
    uniforms.u_lightDir.value = lerp3(
      [ld[0], ld[1], ld[2]],
      target.lightDir,
      Math.min(1, delta * 4),
    );
    uniforms.u_opacityPrimary.value = lerp(
      uniforms.u_opacityPrimary.value,
      target.opacityPrimary,
      Math.min(1, delta * 4),
    );
    uniforms.u_opacityBackground.value = lerp(
      uniforms.u_opacityBackground.value,
      target.opacityBackground,
      Math.min(1, delta * 4),
    );

    // Line material theme tween
    const curLineColor = lineMaterial.color.getHex();
    if (curLineColor !== target.lineColor && eased >= 1) {
      lineMaterial.color.setHex(target.lineColor);
    } else if (curLineColor !== target.lineColor) {
      const a = new THREE.Color(curLineColor);
      const b = new THREE.Color(target.lineColor);
      a.lerp(b, Math.min(1, delta * 4));
      lineMaterial.color.copy(a);
    }
    lineMaterial.opacity = target.lineOpacity * (1 - scrollProgress);
  });

  // Clamp DPR on the GL renderer
  gl.setPixelRatio(dpr);

  return (
    <group ref={groupRef}>
      <points ref={pointsRef} geometry={pointsGeometry} material={pointMaterial} />
      <lineSegments ref={linesRef} geometry={linesGeometry} material={lineMaterial} />
    </group>
  );
}
