# Neural Glyph Hero — Requirements

**Status:** Ready for planning
**Date:** 2026-04-21
**Predecessor:** `.context/brainstorm-three-js-motion.md` (ce-ideate survivors)
**Next step:** `/ce-plan` on this document

## One-line summary

A single slow-rotating three.js point-and-line lattice, sitting as a full-bleed background layer behind the hero display type, that reads like an attention graph, magnetizes subtly to the cursor, and dissolves into drifting particles as the user scrolls past the hero — then the canvas quietly unmounts.

## Problem and motivation

The v2 hero is typography-only and competes unfavorably with the "one centered form in the dark" signature that resn and Framer use to set tone. The portfolio also has no visual moment that signals Joshua's ML identity — the current stats bar says he researches ML, but nothing *looks* like it. The Neural Glyph is one hero 3D moment that carries that identity without turning the page into a dev-rel demo.

## Goals

- Create a single unmistakable "signature moment" on first paint, on the resn axis (quiet, one form, breathing room).
- Signal ML/engineering identity via form language (attention-graph-like lattice), not via labels or copy.
- Preserve the v2 monochrome editorial feel — nothing in color, no gradients, no glow.
- Stay performant on mid-tier mobile (≥50fps) and respect `prefers-reduced-motion`.
- Degrade gracefully for no-WebGL clients via a baked poster image.

## Non-goals

- **No scroll-driven 3D projects timeline.** Projects keep the current grid — the hero is the one 3D moment.
- **No full-page persistent 3D canvas.** The glyph unmounts after the hero; it is not ambient texture behind every section.
- **No attention-map viewer inside project modals.**
- **No page loaders, curtain reveals, or first-paint theatre.** LCP matters more.
- **No magnetic-cursor or 3D-tilt effects on project cards** in this doc (tracked separately in the ideate survivors pool).
- **No color, gradients, or glow.** Monochrome only.
- **No labels, axes, or legend** on the glyph — it is not an explanatory diagram.
- **No device-orientation tilt on mobile** (dropped for complexity; revisit later if wanted).

## Users and usage

- **Primary audience:** recruiters, hiring managers, fellow engineers/researchers landing on the portfolio for the first time.
- **Usage surface:** hero section only (`#hero` on `/`). Visible on first paint; gone once the user has scrolled one viewport.
- **Frequency:** every first page view. Must not fatigue on reload — idle motion is slow and subtle.

## Visual language

### Form and geometry

- **Shape:** a loose volumetric lattice occupying a ~60% × 60% region centered in the hero, biased slightly upper-right to balance the left-weighted display name.
- **Composition (default density, desktop):**
  - ~100 **primary nodes** — slightly larger points (~3px at DPR 1), distributed on a perturbed sphere/ellipsoid surface.
  - ~2,200 **background points** — smaller (~1.2px), scattered inside the ellipsoid volume with noise-driven jitter.
  - ~70 **connecting lines** — thin (1px, opacity ~0.2–0.35) segments between *only the primary nodes*, drawn on the subset with the highest "attention weight" (precomputed at build; stable across loads for recognizability).
- **Mobile density (<768px):** ~50 primary nodes, ~1,200 background points, ~30 lines. Canvas clamped to DPR ≤ 1.5.
- **Reading:** the lattice should read as an **attention graph** to someone in ML, and as a **beautiful quiet form** to everyone else. No literal labels.

### Color, lighting, material

- **Dark theme:** points and lines in `foreground` (near-white, `hsl(0 0% 96%)`) on the page `background` (`hsl(0 0% 6%)`). Primary nodes at full opacity; background points at ~0.35; lines at ~0.25.
- **Light theme:** inverts — points and lines in near-black (`hsl(0 0% 8%)`) on near-white background (`hsl(0 0% 98%)`). Opacities adjusted downward so the glyph doesn't dominate on light (~0.25 primary, ~0.18 background, ~0.15 lines).
- **No color beyond monochrome.** No hue shifts, no emissive glow, no bloom.
- **Material:** custom shader material with soft-edged circular points (GLSL `smoothstep` on `gl_PointCoord`) — no PNG sprites. Additive blending off (straight alpha) to keep light-mode legible.
- **Lighting:** a single directional "key light" whose position is theme-linked (see Motion → Theme flip). No ambient, no fills — the light only affects node brightness via a custom shader uniform (dot product of normal vs. light direction clamped to a small gain range). Lines and background points ignore light (shader-flat).

### Placement in the hero

- Full-bleed absolute layer inside `#hero`, behind the existing grid content (`z-index: 0`; hero grid content bumped to `z-index: 1`).
- Layer sits under `eyebrow`, `display` name, supporting paragraph, CTAs, and the hairline stats bar.
- Existing display type contrast must not degrade. If testing reveals legibility issues on either theme, reduce glyph opacity rather than change composition.

## Motion behavior

### Idle (no cursor, no scroll)

- **Rotation:** constant angular velocity around a tilted Y axis (≈ 7° per second). Secondary slow wobble on X axis (sin-based, ±3° over ~12s period). No randomness — deterministic so it looks composed, not jittery.
- **Breath:** primary nodes pulse ±6% in brightness on a slow 8s cycle, staggered by a noise offset so they don't pulse in unison.
- **Background points:** each has a tiny fbm-noise drift (±2% of radius) so the volume feels alive without obvious per-point motion.

### Cursor magnetism (desktop / fine pointer only)

- Cursor inside the hero → a soft 3D gravity well at the cursor's screen-projected position. Nodes within a ~25% radius bend toward it, max displacement ~8% of the glyph radius. Tween back to rest over ~600ms when the cursor leaves.
- Disabled on `(pointer: coarse)` (mobile/tablet).
- Effect is **subtle** — a first-time visitor should feel presence, not realize it's tracking them.

### Scroll dissolve

- Driver: hero element's scroll progress (0 at top, 1 when hero is fully out of view).
- `progress ∈ [0, 0.35]`: no change (glyph idles).
- `progress ∈ [0.35, 1.0]`: each point and line independently drifts downward with a noise-offset velocity, fades to 0 opacity, and the lattice slowly "thins out" — primary nodes dissolve last.
- At `progress = 1`, canvas opacity reaches 0 and `useFrame` is paused via `visible` + `IntersectionObserver` unmount.
- The dissolve is **one-way**. Scrolling back up re-mounts the canvas and snaps to idle (no reverse dissolve — it reads as gimmicky).

### Theme flip

- When the user toggles theme, animate the shader uniforms over **800ms ease-out**:
  - point + line colors crossfade
  - key light direction rotates from one side to the other (e.g., `(1, 0.5, 0.3)` → `(-1, 0.5, 0.3)`)
  - node opacities retune to the new theme's values
- Page background crossfades in parallel via the existing `next-themes` CSS transition.
- If user has `prefers-reduced-motion`, the flip is instantaneous (no animation).

## Performance budget

| metric | budget |
|---|---|
| Added JS (hero only, gzipped) | ≤ 120 KB |
| First canvas frame | ≤ 150ms after hero mount |
| Hero section idle FPS (M1 Air, Chrome) | ≥ 58 |
| Hero section idle FPS (mid-tier Android, Chrome) | ≥ 50 |
| CPU when scrolled past hero | ≤ 2% (canvas paused/unmounted) |
| Vertex count (desktop) | ≤ 2,500 |
| Draw calls | 2 (one points, one lineSegments) |
| Textures | 0 |
| DPR cap | `min(2, devicePixelRatio)` desktop; `min(1.5, devicePixelRatio)` mobile |
| LCP impact on hero | ≤ 50ms regression vs. current v2 |

Enforcement:
- `<AdaptiveDpr pixelated />` from drei to downshift DPR under load.
- `<PerformanceMonitor />` callback that reduces background-point count by 30% if avg FPS drops below 45 for > 2s.
- Canvas wrapped in `IntersectionObserver` — when hero is fully offscreen, component unmounts (not just pauses) to free GPU memory.
- Dev-only `leva` tuning for density, rotation speed, dissolve curve; tree-shaken in production.

## Accessibility and fallbacks

Two-tier fallback:

1. **`prefers-reduced-motion: reduce`** — canvas mounts, renders one frame at a deterministic idle pose, and freezes. No rotation, no cursor magnetism, no dissolve on scroll (canvas fades via CSS opacity tied to scroll instead — no WebGL animation). Theme flip is instant.
2. **No WebGL / feature-detect failure** — canvas never mounts. A prebaked monochrome PNG poster (`public/neural-glyph-poster-dark.webp`, `public/neural-glyph-poster-light.webp`, ~40 KB each) renders in its place at the same opacity/position as the live glyph.

Additional a11y:
- The glyph is purely decorative. Canvas element gets `aria-hidden="true"` and `role="presentation"`.
- All hero copy (eyebrow, name, supporting paragraph, CTAs) remains in the DOM, unaffected by the glyph.
- Keyboard focus is never trapped in or near the canvas.
- Focus-visible rings on hero CTAs must remain readable when the glyph overlaps them — test on both themes.

## Integration points

- **`app/components/Hero.tsx`** — wrap the existing `<section id="hero">` content in a relative container; insert a new absolute-positioned `<NeuralGlyph />` layer at `inset-0 z-0 pointer-events-none`. Bump the existing `container-editorial` div to `relative z-10`. No change to the display type, stats bar, or CTAs.
- **`app/components/NeuralGlyph.tsx`** (new) — r3f `<Canvas>` wrapper. Owns WebGL feature detection, `prefers-reduced-motion` detection, `IntersectionObserver` mount/unmount, scroll-progress hook, and theme subscription via `next-themes`. Renders the poster fallback when WebGL unavailable.
- **`app/components/neural-glyph/Scene.tsx`** (new) — the actual `<points>` + `<lineSegments>` with the shader material. Takes props: `reducedMotion`, `scrollProgress`, `cursor`, `theme`.
- **`app/components/neural-glyph/shader.ts`** (new) — vertex + fragment GLSL as strings or `glsl` tagged template.
- **`app/components/neural-glyph/geometry.ts`** (new) — deterministic node / line generation (seeded PRNG + simplex-noise, already a dep).
- **`public/neural-glyph-poster-dark.webp`** (new, baked at dev time) — fallback image.
- **`public/neural-glyph-poster-light.webp`** (new, baked at dev time) — fallback image.
- **`app/layout.tsx`** — no changes expected. Scroll progress is hero-local; theme already provides via `next-themes`.
- **`package.json`** — add `three`, `@react-three/fiber`, `@react-three/drei`; dev-add `leva`, `@types/three`.

## Dependencies and assumptions

- `three` r15x, `@react-three/fiber` 8.x, `@react-three/drei` 9.x — latest stable as of 2026-04. Verify at install.
- `simplex-noise` 4.x already in `package.json` — reuse for geometry seeding.
- `next-themes` 0.4.x already in `package.json` — use `useTheme()` hook for theme subscription; no provider changes needed.
- Next 14 App Router + `"use client"` on `NeuralGlyph.tsx`. r3f is client-only.
- Assumption to verify before planning: `@react-three/fiber` v8 ships as ESM-compatible with Next 14.2.16 App Router without custom webpack config. (Recent versions do; confirm at install.)

## Success criteria

Ship-gate checks:

- [ ] Side-by-side screenshots on both themes at 1440px, 1024px, 768px, 420px — hero copy fully legible; glyph visible but not dominant.
- [ ] Lighthouse mobile performance score ≥ 92 on `/` after ship (current v2 baseline: verify just before merge).
- [ ] Lighthouse accessibility score = 100 (unchanged from v2).
- [ ] Hero FPS ≥ 58 on M1 Air, ≥ 50 on a mid-tier Android in Chrome DevTools throttled "Mid-tier mobile" profile.
- [ ] `prefers-reduced-motion: reduce` emulation → no rotation, no dissolve, no magnetism.
- [ ] WebGL disabled in chrome://flags → poster PNG renders at correct position on both themes.
- [ ] Scrolling past the hero and back leaves the canvas in a clean idle state (no stuck frames, no memory leak observable in DevTools memory tab over 30s).
- [ ] Theme toggle from dark→light→dark: key-light direction animates smoothly; no flash-of-wrong-theme on either side.
- [ ] Canvas carries `aria-hidden="true"`; keyboard tab order unchanged from v2.

Qualitative check (owner):

- [ ] First impression on a 27" display feels "one centered form in the dark" (resn axis), not "portfolio with an effect."
- [ ] An ML reader recognizes the attention-graph reading without being told.

## Open questions for planning

1. **SplitText licensing** — Club GSAP became free in 2025 for SplitText. Confirm current policy at install time, or swap to `splitting.js`. Tracked for the broader motion work; not a blocker for the glyph itself.
2. **Poster image pipeline** — bake via a one-off Playwright script (render Scene to canvas, `toDataURL`, write to `public/`) vs. a dev-only Node script using offscreen three. Planning call.
3. **Scroll progress source** — native `IntersectionObserver` + `getBoundingClientRect` vs. adding GSAP ScrollTrigger now (GSAP arrives in Phase 1 of the motion plan anyway). Planning call.

## Deferred for later

- Cursor-following behavior on touch devices (device-orientation tilt).
- Ambient particle texture persisting into subsequent sections (the "Contact aurora" reuse is separate work).
- Baking the node/line geometry into a compact binary format if payload becomes an issue.
