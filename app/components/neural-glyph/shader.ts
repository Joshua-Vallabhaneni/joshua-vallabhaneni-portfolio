import type { IUniform } from "three";

export interface PointShaderUniforms {
  u_time: IUniform<number>;
  u_breath: IUniform<number>;
  u_scrollDissolve: IUniform<number>;
  u_cursor: IUniform<[number, number, number]>;
  u_cursorStrength: IUniform<number>;
  u_color: IUniform<[number, number, number]>;
  u_opacityPrimary: IUniform<number>;
  u_opacityBackground: IUniform<number>;
  u_dpr: IUniform<number>;
  u_pointSizePrimary: IUniform<number>;
  u_pointSizeBackground: IUniform<number>;
  u_lightDir: IUniform<[number, number, number]>;
  [key: string]: IUniform<unknown>;
}

export const pointVertex = /* glsl */ `
  attribute float a_isPrimary;
  attribute vec3 a_drift;

  uniform float u_time;
  uniform float u_scrollDissolve;
  uniform vec3 u_cursor;
  uniform float u_cursorStrength;
  uniform float u_dpr;
  uniform float u_pointSizePrimary;
  uniform float u_pointSizeBackground;

  varying float v_isPrimary;
  varying vec3 v_worldPos;
  varying float v_dissolveAmt;

  void main() {
    vec3 pos = position;

    // Idle drift — only background points jitter softly
    float drift = (1.0 - a_isPrimary) * 0.02;
    pos.x += drift * sin(u_time * 0.6 + a_drift.x);
    pos.y += drift * sin(u_time * 0.5 + a_drift.y);
    pos.z += drift * sin(u_time * 0.7 + a_drift.z);

    // Cursor gravity well (screen-space-ish, done in world space for simplicity)
    vec3 toCursor = u_cursor - pos;
    float cursorDist = length(toCursor);
    float cursorKernel = exp(-cursorDist * cursorDist * 2.5) * u_cursorStrength;
    pos += normalize(toCursor + vec3(0.0001)) * cursorKernel * 0.08 * a_isPrimary;

    // Scroll dissolve — negative Y drift + per-vertex spread
    float dissolve = clamp((u_scrollDissolve - 0.35) / 0.65, 0.0, 1.0);
    v_dissolveAmt = dissolve;
    pos.y -= dissolve * (0.6 + 0.5 * sin(a_drift.x * 4.0));
    pos.x += dissolve * (a_drift.y - 3.14) * 0.15;
    pos.z += dissolve * (a_drift.z - 3.14) * 0.15;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;

    float baseSize = mix(u_pointSizeBackground, u_pointSizePrimary, a_isPrimary);
    // Gentle perspective scaling; keep points small so the field reads as texture, not cloud.
    float perspective = clamp(2.5 / max(0.001, -mvPos.z), 0.4, 1.2);
    gl_PointSize = baseSize * u_dpr * perspective;

    v_isPrimary = a_isPrimary;
    v_worldPos = pos;
  }
`;

export const pointFragment = /* glsl */ `
  precision mediump float;

  uniform vec3 u_color;
  uniform float u_opacityPrimary;
  uniform float u_opacityBackground;
  uniform float u_breath;
  uniform vec3 u_lightDir;

  varying float v_isPrimary;
  varying vec3 v_worldPos;
  varying float v_dissolveAmt;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float r = length(coord);
    if (r > 0.5) discard;

    // Soft disk falloff
    float alpha = smoothstep(0.5, 0.18, r);

    // Pseudo-normal from position → origin for key-light shading
    vec3 pseudoNormal = normalize(v_worldPos);
    float lambert = clamp(dot(pseudoNormal, normalize(u_lightDir)), 0.35, 1.0);

    // Breath brightness on primary nodes only
    float breath = mix(1.0, 1.0 + 0.25 * u_breath, v_isPrimary);

    float baseOpacity = mix(u_opacityBackground, u_opacityPrimary, v_isPrimary);
    float dissolveFade = 1.0 - v_dissolveAmt;

    float finalAlpha = alpha * baseOpacity * lambert * breath * dissolveFade;
    gl_FragColor = vec4(u_color, finalAlpha);
  }
`;

export function createPointUniforms(dpr: number): PointShaderUniforms {
  return {
    u_time: { value: 0 },
    u_breath: { value: 0 },
    u_scrollDissolve: { value: 0 },
    u_cursor: { value: [999, 999, 999] },
    u_cursorStrength: { value: 0 },
    u_color: { value: [0.96, 0.96, 0.96] },
    u_opacityPrimary: { value: 0.55 },
    u_opacityBackground: { value: 0.09 },
    u_dpr: { value: dpr },
    u_pointSizePrimary: { value: 2.0 },
    u_pointSizeBackground: { value: 0.55 },
    u_lightDir: { value: [0.6, 0.8, 0.6] },
  };
}
