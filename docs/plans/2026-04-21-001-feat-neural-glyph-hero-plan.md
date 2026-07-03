---
title: feat — Neural Glyph hero
type: feat
status: active
date: 2026-04-21
origin: docs/brainstorms/neural-glyph-hero-requirements.md
---

# feat — Neural Glyph hero

## Overview

Add a single three.js point-and-line lattice as a full-bleed background layer inside `app/components/Hero.tsx`. The lattice reads as an attention graph, rotates slowly, magnetizes subtly to the cursor on desktop, and dissolves into drifting particles as the user scrolls past the hero — after which the canvas unmounts. Two fallback paths: a frozen deterministic pose for `prefers-reduced-motion`, and a baked `.webp` poster for no-WebGL clients. Monochrome only, no gradients or glow.

## Problem Frame

The v2 hero is typography-only and lacks the "one centered form in the dark" signature that resn and Framer use to set tone. The portfolio also has no visual moment that signals Joshua's ML identity. The Neural Glyph is the one 3D moment that carries that identity without turning the page into a dev-rel demo (see origin: `docs/brainstorms/neural-glyph-hero-requirements.md`).

## Requirements Trace

- R1. Full-bleed background layer behind hero grid content, does not regress display-type legibility (origin §Visual language → Placement).
- R2. Idle motion: ~7°/s Y rotation, ±3° X wobble over 12s, 8s brightness breath on primary nodes (origin §Motion → Idle).
- R3. Cursor magnetism on fine pointers only; disabled on `(pointer: coarse)` (origin §Motion → Cursor).
- R4. One-way scroll dissolve keyed to hero progress `[0.35, 1.0]`; canvas unmounts when fully offscreen (origin §Motion → Scroll dissolve).
- R5. Theme flip animates uniforms + key-light direction over 800ms ease-out; instant under reduced-motion (origin §Motion → Theme flip).
- R6. Two-tier fallback: frozen pose for `prefers-reduced-motion`; poster `.webp` for no-WebGL (origin §Accessibility).
- R7. Performance budget: ≤220KB gz added (three + fiber + drei floor; revised from 120KB after feasibility review), ≤2,500 verts, 2 draw calls, 0 textures, DPR capped, ≥58fps M1 Air / ≥50fps mid-tier Android (origin §Performance).
- R8. Monochrome only; no color, gradients, glow, loaders, or labels (origin §Non-goals).

## Scope Boundaries

- No scroll-driven 3D projects timeline — projects keep the current grid.
- No full-page persistent 3D canvas — glyph lives only in hero.
- No attention-map viewer inside project modals.
- No page loaders, curtain reveals, or first-paint theatre.
- No magnetic cursor or 3D tilt on project cards in this plan.
- No color, gradients, glow, or labels on the glyph.
- No device-orientation tilt on mobile.

## Context & Research

### Relevant Code and Patterns

- `app/components/Hero.tsx` — current hero; uses `motion.h1` / `motion.p` for enter transitions, `container-editorial` grid, and a hairline stats bar. The glyph inserts as a new absolute layer inside `<section id="hero">` without touching the grid content semantics.
- `app/components/AnimatedSectionHeader.tsx` — existing client-component motion pattern using `framer-motion`. Follow the same `"use client"` + viewport-triggered pattern for client boundaries.
- `app/layout.tsx` — already wraps children in `ThemeProvider` (next-themes). No layout-level change required.
- `app/globals.css` — monochrome HSL design tokens (`--foreground`, `--background`) for dark and light modes. The shader reads these via CSS custom-property → JS bridge in `NeuralGlyph.tsx`.
- `package.json` — `simplex-noise@4` already present; reuse for geometry seeding. `framer-motion@12` stays for component-level motion; only the glyph uses three.js.

### Institutional Learnings

- No `docs/solutions/` directory exists in the repo; no prior learnings to carry forward.
- No `AGENTS.md` or `CLAUDE.md`; `README.md` has no conventions relevant to this work.

### External References

- `@react-three/fiber` v8 is compatible with Next 14 App Router when the component is marked `"use client"`. No `next.config` change required for tree-shaken builds; check bundle size after install.
- `@react-three/drei` is **not** used (dropped to keep bundle inside R7's 220KB gz budget). DPR clamp and FPS-based downshift are implemented inline in Unit 4 — see Approach there.
- `simplex-noise@4` exports `createNoise3D(rng?)` — pass the seeded mulberry32 PRNG (see Unit 2) so noise sampling is fully deterministic and does not fall back to `Math.random`.

## Key Technical Decisions

- **r3f over vanilla three.js.** Declarative React ownership of scene, lifecycle gating, and theme subscription is cheaper to maintain than an imperative three.js class. Bundle cost is acceptable inside the 220KB budget with proper tree-shaking.
- **Single shader material for points; a second material for lines.** Meets R7's two-draw-call budget. Lines use `LineBasicMaterial` (flat shaded) — no custom shader needed.
- **Screen-space gravity well for cursor magnetism, no raycasting.** Cheaper than per-frame raycast; R3 only needs soft displacement, not picking.
- **Deterministic seeded geometry.** A fixed seed means the lattice looks the same on every load, so first-time visitors and returning visitors see a recognizable signature shape. Seed lives as a constant in `geometry.ts`.
- **Theme uniforms read from JS, not GLSL.** The shader takes a `vec3 u_color` and a scalar `u_opacity`. `NeuralGlyph.tsx` reads the current theme via `useTheme()` and tweens uniforms; the shader never parses CSS. Keeps the shader pure.
- **Mount/unmount over pause/resume.** When hero exits viewport, the Canvas component fully unmounts. Cheaper than pausing `useFrame` and keeps GPU memory reclaimable. Re-entry re-mounts and the deterministic seed gives the same lattice.
- **Poster images baked via a Node-only `node-canvas` script.** A pure-Node 2D-canvas rasterizer re-runs the deterministic geometry at t=0 and draws the points + line pairs directly to a canvas, then writes WebP via `sharp`. No dev-only Next route, no Playwright dependency, no risk of the bake route leaking to prod. Script is dev-only; posters ship as static files in `public/`.
- **Scroll progress from `IntersectionObserver` + `getBoundingClientRect`, not GSAP.** GSAP is earmarked for the later motion-foundation phase; this plan does not introduce it. Native API is sufficient for one-axis hero-local progress.

## Open Questions

### Resolved During Planning

- **Scroll driver.** Native IntersectionObserver + rAF reads of `getBoundingClientRect` — no GSAP dependency introduced here.
- **Poster pipeline.** One-off `node-canvas` + `sharp` Node script writing `public/neural-glyph-poster-{dark,light}.webp` — no Next route, no browser automation.
- **Geometry seed.** Fixed constant (documented in `geometry.ts`) for recognizability across loads.

### Deferred to Implementation

- Exact fbm/noise frequencies for background-point drift — tune with `leva` during Unit 2 implementation.
- Exact tween curve for the theme-flip light rotation — pick from `framer-motion` easings or a cubic-bezier after visual review in Unit 4.
- Final opacity constants for light-mode (origin specifies ~0.25/0.18/0.15 as starting points) — adjust during visual regression check in Unit 6.
- Whether `<PerformanceMonitor />` downshifts background-point count at runtime by swapping geometry buffers or by opacity — decide when implementing Unit 4.

## Output Structure

    app/components/
    ├── Hero.tsx                          # MODIFIED
    ├── NeuralGlyph.tsx                   # NEW — client wrapper, mount gating, fallbacks
    └── neural-glyph/
        ├── Scene.tsx                     # NEW — r3f <points> + <lineSegments>
        ├── shader.ts                     # NEW — GLSL vertex + fragment strings
        └── geometry.ts                   # NEW — seeded geometry generator

    public/
    ├── neural-glyph-poster-dark.webp     # NEW — no-WebGL fallback (dark theme)
    └── neural-glyph-poster-light.webp    # NEW — no-WebGL fallback (light theme)

    scripts/
    └── bake-neural-glyph-poster.ts       # NEW — dev-only one-off bake script

## High-Level Technical Design

> *This illustrates the intended component shape and is directional guidance for review, not implementation specification. The implementing agent should treat it as context, not code to reproduce.*

```
Hero.tsx
└─ <section id="hero" className="relative">
   ├─ <NeuralGlyph className="absolute inset-0 z-0 pointer-events-none" />
   │    └─ branch by (hasWebGL × reducedMotion):
   │       ├─ WebGL + full motion    → <Canvas><Scene .../></Canvas>
   │       ├─ WebGL + reduced motion → <Canvas frameloop="demand"><Scene frozen .../></Canvas>
   │       └─ no WebGL               → <img src="/neural-glyph-poster-{theme}.webp" alt="" aria-hidden="true" .../>
   │
   └─ <div className="container-editorial relative z-10"> …existing hero grid…
```

```
Scene.tsx  (r3f)
  props: { scrollProgress, cursor, theme, reducedMotion, density }
  children:
    <points geometry={nodeGeom} material={pointShaderMaterial} />
    <lineSegments geometry={lineGeom} material={lineMaterial} />
  useFrame(({ clock }) => {
    if (reducedMotion) return
    rotate group by Δθ; sample fbm noise for background-point jitter;
    apply cursor gravity well to primary nodes;
    drive scroll-dissolve opacity/drift from scrollProgress prop;
    tween theme uniforms toward current theme;
  })
```

```
geometry.ts
  generate(seed, density) → {
    nodePositions: Float32Array,        // primary nodes first, then background
    primaryCount: number,               // slice boundary
    lineIndices: Uint16Array,           // pairs between primary nodes
    driftOffsets: Float32Array,         // per-vertex noise phase
  }
```

## Implementation Units

- [ ] **Unit 1: Add three.js dependencies and client boundary**

**Goal:** Install the 3D stack and confirm it builds clean on Next 14 App Router.

**Requirements:** R7 (budget), R8 (monochrome-only — no color deps).

**Dependencies:** none.

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json` (regenerated by install)
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`

**Approach:**
- Add runtime deps: `three`, `@react-three/fiber`. Drop `@react-three/drei` entirely — `<AdaptiveDpr/>` and `<PerformanceMonitor/>` are replaced with ~15-line inline equivalents in Unit 4. Keeps bundle inside R7's 220KB gz budget without depending on drei's tree-shaking.
- Add dev deps: `@types/three`, `vitest`, `@vitest/ui`, `jsdom`. `leva` is optional and deferred (see Open Questions below) — only install if tuning UI is actually wired.
- Verify versions as of 2026-04: `three@~0.16x`, `@react-three/fiber@~8.x`. If fiber v9/v10 is current, confirm Next 14 compatibility before upgrading past the known-good v8 line.
- `vitest.config.ts`: `environment: 'jsdom'`, `setupFiles: ['./tests/setup.ts']`, alias `@` → repo root to match existing `tsconfig` paths.
- Run `next build` to confirm tree-shaken bundle size delta stays within R7's 220KB gz budget against the hero route.

**Patterns to follow:**
- Existing `"use client"` pattern in `app/components/AnimatedSectionHeader.tsx`.

**Test scenarios:**
- Happy path: `npm install` succeeds; `next build` succeeds; TypeScript passes with no new errors.
- Edge case: bundle analyzer (or `next build` output) shows `/` route JS payload ≤ current baseline + 220KB gz.

**Verification:**
- Build passes. Bundle delta inside budget. No new TypeScript errors.

---

- [ ] **Unit 2: Geometry generator module**

**Goal:** Deterministic seeded generation of primary-node positions, background points, connecting line pairs, and per-vertex drift phases.

**Requirements:** R2 (idle breath/drift phases), R4 (per-vertex dissolve offsets), R7 (vertex count caps).

**Dependencies:** Unit 1.

**Files:**
- Create: `app/components/neural-glyph/geometry.ts`
- Create: `app/components/neural-glyph/geometry.test.ts`

**Approach:**
- Pure function `generateGlyphGeometry(seed, density)` returning `{ nodePositions, primaryCount, lineIndices, driftOffsets }` as typed arrays.
- Seed deterministic PRNG (mulberry32 from the fixed glyph seed) and thread it into `createNoise3D(rng)` so the noise field is fully deterministic — no `Math.random` fallback anywhere in the geometry pipeline.
- Primary nodes on a perturbed ellipsoid surface; background points inside the ellipsoid volume with noise jitter.
- Line pairs: connect only primary nodes whose dot-product distance falls under a threshold, then cap at `density.lineCount` by highest "weight" (e.g., 1/distance).
- Density presets: `desktop = { primary: 100, background: 2200, lines: 70 }`, `tablet = { primary: 75, background: 1700, lines: 50 }`, `mobile = { primary: 50, background: 1200, lines: 30 }`.
- No three.js imports in this file — pure math. Makes it unit-testable in Node.

**Patterns to follow:**
- Existing `simplex-noise@4` functional API (`createNoise3D`).

**Test scenarios:**
- Happy path: `generate(seedA, desktop)` returns typed arrays with primary count = 100, total nodes = 2300, line pairs = 70.
- Edge case: same seed produces byte-identical output across two calls (determinism).
- Edge case: different seeds produce measurably different outputs (non-trivial variance in positions).
- Edge case: mobile preset stays within its density caps.
- Error path: invalid density (negative counts, zero primary) throws a clear error.

**Verification:**
- All scenarios pass. Module is pure and has no three.js or DOM dependency.

---

- [ ] **Unit 3: Custom point shader and materials**

**Goal:** GLSL vertex + fragment for soft-edged circular points with theme-driven color, opacity, and key-light uniforms. Plain line material for connecting lines.

**Requirements:** R2 (breath brightness), R5 (theme uniforms + light direction), R8 (no textures, no glow).

**Dependencies:** Unit 1.

**Files:**
- Create: `app/components/neural-glyph/shader.ts`

**Approach:**
- Vertex shader: pass per-vertex `a_isPrimary`, `a_drift` attributes to fragment. Apply a per-vertex drift offset when `u_scrollDissolve > 0` (drift magnitude grows with dissolve progress along -Y). Compute `gl_PointSize` as primary-vs-background scaled by DPR uniform.
- Fragment shader: circular point via `smoothstep` on `length(gl_PointCoord - 0.5)`. Brightness modulated by `dot(u_lightDir, worldNormal)` clamped, but since points have no normal use a pseudo-normal from position → center. Mix in `u_breath` sine for primary nodes.
- Line material: `LineBasicMaterial` with opacity + color uniforms — no custom shader.
- Expose uniform names as a TypeScript type so Scene.tsx gets autocomplete.

**Patterns to follow:**
- r3f `shaderMaterial` helper via `@react-three/drei` if ergonomic, else plain `THREE.ShaderMaterial`.

**Test scenarios:**
- Test expectation: none — this unit is shader source only. Visual verification happens in Unit 4's Scene test.

**Verification:**
- Shader strings compile without warnings when instantiated in a minimal test scene. Uniform types exported correctly.

---

- [ ] **Unit 4: Scene component (r3f)**

**Goal:** The actual 3D scene — `<points>` + `<lineSegments>`, idle rotation, cursor magnetism, scroll dissolve, theme-linked uniforms, reduced-motion freeze.

**Requirements:** R2, R3, R4, R5, R7.

**Dependencies:** Units 2, 3.

**Files:**
- Create: `app/components/neural-glyph/Scene.tsx`

**Approach:**
- Props: `{ scrollProgress: number, cursor: {x, y} | null, theme: 'dark' | 'light', reducedMotion: boolean, density: 'desktop' | 'tablet' | 'mobile' }`.
- On mount, call `generateGlyphGeometry` with fixed seed + density; build `BufferGeometry` for points and `BufferGeometry` for line segments.
- **Composition:** position camera + glyph centroid so the lattice's projected bounding box falls within the upper-right 60% × 60% of the canvas viewport. The lower-left 40% stays clear so the hero display type and stats bar read against a quiet field.
- `useFrame(({ clock }, delta)`:
  - Skip all motion when `reducedMotion` is true.
  - Apply Y rotation at 7°/s (~0.122 rad/s) and X wobble `±3°` over 12s.
  - Update `u_breath` uniform to a sine.
  - Update `u_scrollDissolve` uniform from `scrollProgress` (ramp starts at 0.35 per R4).
  - Apply cursor gravity well: project cursor screen coords to world ray at z=0, write a single `u_cursor` vec3 + `u_cursorStrength` scalar. Shader-side falloff: peak displacement = 25% of mean primary-node spacing, exponential radial decay with 8% half-width (`exp(-d²/0.0064)` in normalized scene units). On `pointerleave` the wrapper ramps `u_cursorStrength` from 1 → 0 with a 600ms ease-out so magnetism unwinds cleanly.
  - **Theme tween:** uniforms `u_color`, `u_opacity`, and `u_lightDir` interpolate over 800ms using `cubic-bezier(0.4, 0, 0.2, 1)` (Tailwind default). Light-dir targets: dark = `normalize(vec3(0.3, 0.8, 0.5))`, light = `normalize(vec3(-0.4, 0.7, 0.6))`. **Re-entrancy:** a theme flip mid-tween restarts the 800ms tween from the *current* interpolated uniform value toward the new target — do not snap back to the previous start. Track `tweenStartValue` per uniform on every theme change.
- **Inline drei-replacements** (drei is not installed; see Unit 1):
  - `<AdaptiveDpr>` replacement: clamp `gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))` on mount and on `resize`; further halve to `0.9` if the monitor (below) trips decline.
  - `<PerformanceMonitor>` replacement: rolling 60-frame average via `performance.now()` deltas. If `avgFps < 45` for 90 consecutive frames, set `u_bgOpacity *= 0.7` (one-shot, idempotent). No mid-frame buffer swaps.

**Patterns to follow:**
- r3f idiomatic `useFrame` + refs over imperative three.js.

**Test scenarios:**
- Happy path (manual): Scene mounts with desktop density; verify visual output in a story/dev page — soft-disk points, thin lines, slow rotation.
- Happy path (unit): with `reducedMotion = true`, `useFrame` is a no-op — geometry stays at t=0 pose across multiple frame advances.
- Integration: setting `scrollProgress = 1` produces fully transparent points (Y-drift applied, opacity=0 in fragment).
- Integration: theme prop change from `'dark'` to `'light'` advances color uniform toward light-theme target over simulated 800ms.
- Edge case: `cursor = null` disables gravity well with no residual displacement.

**Verification:**
- All Scene test scenarios pass. Scene hits ≥58fps on M1 Air at desktop density in a harness page. Runs at ≥50fps on a throttled mid-tier Android profile in DevTools.

---

- [ ] **Unit 5: NeuralGlyph wrapper (feature detection, gating, fallbacks)**

**Goal:** Public client component that branches between `<Canvas><Scene/></Canvas>`, reduced-motion frozen pose, and no-WebGL poster image. Owns scroll-progress calc, cursor tracking, theme subscription, and IntersectionObserver mount/unmount.

**Requirements:** R1, R4 (unmount past hero), R5 (theme subscription), R6 (two-tier fallback), R7 (gating).

**Dependencies:** Unit 4.

**Files:**
- Create: `app/components/NeuralGlyph.tsx`

**Approach:**
- `"use client"`.
- Feature detect WebGL once on mount: try to create a `<canvas>`, call `getContext('webgl2') || getContext('webgl')`. If null → poster branch, never mount `<Canvas>`.
- `useMediaQuery('(prefers-reduced-motion: reduce)')` and `useMediaQuery('(pointer: coarse)')` hooks — **must attach a `change` listener on the MediaQueryList and cleanup on unmount**, not a one-shot read. Users can toggle reduced-motion mid-session; the Scene prop must track it live.
- `useTheme()` from `next-themes` → pass resolved theme into Scene. **Guard hydration:** `resolvedTheme` is `undefined` on first client render. Gate the entire `<NeuralGlyph>` output behind a `mounted` state (set in `useEffect`) — render `null` (or the SSR-neutral poster) until `mounted && resolvedTheme` are both truthy. Prevents FOWT and hydration mismatches.
- IntersectionObserver on hero section with a **debounced unmount**: start a 500ms timer when `intersectionRatio === 0`; cancel the timer if the section re-enters before it fires; unmount `<Canvas>` when the timer fires. Prevents GL context churn on fast-scroll-then-scroll-back. Scroll progress computed via `rAF` loop that reads `getBoundingClientRect()` while the section is visible.
- **React 18 StrictMode safety:** every effect (IntersectionObserver, rAF, MediaQueryList listeners, pointer listeners, theme-tween timers) must tolerate the dev-only mount → unmount → re-mount cycle. Each `useEffect` returns a cleanup that calls `observer.disconnect()`, `cancelAnimationFrame(rafId)`, `mql.removeEventListener('change', …)`, and clears any pending `setTimeout`/`setInterval`. Use `useRef` for rAF ids and timer handles so the cleanup closure reads the latest value, not the stale one from the first invocation.
- **WebGL context-loss path:** attach `onContextLost` (e.g., via r3f's Canvas `onCreated` to `gl.domElement.addEventListener('webglcontextlost', e => { e.preventDefault(); setContextLost(true); })`). When `contextLost` is true, unmount `<Canvas>` and render the poster `<img>` for the rest of the session. Do **not** subscribe to `webglcontextrestored` — silent re-mount after a transient loss creates retry storms on iOS Safari backgrounding (see Risks). The page reloads to recover, which is the right behavior for a decorative element.
- Cursor tracking: listen to `pointermove` on the hero section, listen to `pointerleave` and ramp `u_cursorStrength` to 0 over 600ms (Unit 4) before clearing the cursor prop. Skip cursor handlers entirely when `(pointer: coarse)`.
- **Reduced-motion scroll fade:** under reduced-motion, `useFrame` is a no-op (R5), so the WebGL dissolve is skipped. Instead, the wrapper applies a plain CSS opacity transition on the `<Canvas>` container keyed to the IntersectionObserver's `intersectionRatio` — fade from `opacity: 1` at ratio ≥ 0.4 to `opacity: 0` at ratio ≤ 0.05, with `transition: opacity 250ms linear`. This is a static opacity change, not motion, and is acceptable under `prefers-reduced-motion` per WCAG 2.3.3 guidance.
- **Poster `<img>` alt:** the poster is decorative — render with `alt=""` and `aria-hidden="true"` so screen readers skip it. The canvas branch is already `aria-hidden="true"` per Unit 6.
- Density prop: three-way breakpoint — `matchMedia('(max-width: 767px)')` → `'mobile'`, `matchMedia('(min-width: 768px) and (max-width: 1023px)')` → `'tablet'`, else `'desktop'`. Listen for `change` on the matchMedia so rotation + resize hit the right preset.

**Patterns to follow:**
- Existing `next-themes` `useTheme()` usage in `components/mode-toggle.tsx`.

**Test scenarios:**
- Happy path: in jsdom with mocked WebGL context, component renders a `<Canvas>`. With WebGL mocked-null, renders `<img src="/neural-glyph-poster-dark.webp">` (or light per theme).
- Integration: with `prefers-reduced-motion: reduce` matched, Scene is passed `reducedMotion=true`.
- Integration: with `(pointer: coarse)` matched, cursor handler never attaches (spy on `addEventListener`).
- Edge case: theme changes from dark to light — poster `src` switches immediately (when in no-WebGL branch); Scene receives updated theme prop (when in WebGL branch).
- Edge case: hero fully offscreen for ≥500ms → `<Canvas>` unmounts. Scroll-down-then-scroll-back within 500ms → Canvas stays mounted (debounce).
- Edge case: `matchMedia('(prefers-reduced-motion: reduce)')` toggles mid-session → Scene `reducedMotion` prop updates within one frame (MediaQueryList listener fires).
- Edge case: initial SSR render → `<NeuralGlyph>` returns null until `mounted && resolvedTheme` — no hydration warning, no FOWT.

**Verification:**
- All wrapper test scenarios pass. Manual check: DevTools Memory → no detached three.js objects after scroll-away + scroll-back + scroll-away.

---

- [ ] **Unit 6: Hero integration**

**Goal:** Wire `<NeuralGlyph />` into `app/components/Hero.tsx` as a full-bleed background layer without disturbing existing display type, paragraph, or stats bar.

**Requirements:** R1, R8.

**Dependencies:** Unit 5.

**Files:**
- Modify: `app/components/Hero.tsx`

**Approach:**
- The existing `<section id="hero">` already has `relative` positioning via Tailwind classes. Insert `<NeuralGlyph className="absolute inset-0 z-0 pointer-events-none" />` as the first child.
- Wrap the existing `container-editorial` div with explicit `relative z-10` so hero content sits above the glyph.
- No change to display-type classes, motion variants, or stats bar structure.
- Verify hero copy contrast holds on both themes — if not, reduce `NeuralGlyph` wrapper opacity via a prop rather than changing the glyph itself.

**Patterns to follow:**
- Existing Tailwind layering conventions in this file.

**Test scenarios:**
- Visual (manual): screenshots at 1440px, 1024px, 768px, 420px × `{dark, light}` × `{full-motion, reduced-motion}` = 16 combinations. Hero copy remains fully legible.
- Integration: Playwright smoke — hero section renders, display name text node is present in DOM (glyph is decorative and must not replace accessible content), `aria-hidden="true"` on canvas.

**Verification:**
- All 16 visual combinations pass the legibility check. DOM structure for hero copy unchanged from v2.

---

- [ ] **Unit 7: Poster images + bake script**

**Goal:** Produce `public/neural-glyph-poster-{dark,light}.webp` as no-WebGL fallbacks matching the live glyph's idle pose.

**Requirements:** R6 (no-WebGL fallback), R7 (≤40KB each per origin §Accessibility).

**Dependencies:** Units 2, 3, 4.

**Files:**
- Create: `scripts/bake-neural-glyph-poster.ts`
- Create: `public/neural-glyph-poster-dark.webp`
- Create: `public/neural-glyph-poster-light.webp`

**Approach:**
- Node-only script. Install `canvas` (node-canvas) + `sharp` as **devDependencies** only — they never enter the client bundle because the script is invoked via `tsx scripts/bake-neural-glyph-poster.ts`, not imported from any app route.
- Script imports `generateGlyphGeometry` from `app/components/neural-glyph/geometry.ts` (pure — no three.js needed) and draws the t=0 pose directly on a 2D canvas: project each 3D node through a simple orthographic projection matching the Scene's idle camera, render primary nodes as filled circles with the shader-equivalent radial falloff (approximated with `createRadialGradient`), render background points as smaller filled circles, render line pairs as 1px strokes.
- Reads `--foreground` / `--background` HSL tokens from a local copy of `app/globals.css` (parsed, not imported) for color parity between dark and light variants.
- Writes PNG buffer → `sharp(buf).webp({ quality: 80 }).toFile(...)` for each theme.
- Script is not part of the prod bundle; runs locally when the seed or density changes. Zero Next route, zero browser automation, zero risk of leaking a `/__bake` endpoint to prod.
- Posters committed to the repo so no dev-only step is needed at deploy.

**Test scenarios:**
- Happy path: script outputs two `.webp` files; each ≤40KB; dimensions 1920×1080.
- Edge case: re-running the script produces byte-identical files (determinism from fixed seed + t=0).

**Verification:**
- Files exist, sizes within budget, visible in the no-WebGL branch when WebGL is disabled in browser flags.

---

- [ ] **Unit 8: Ship-gate validation**

**Goal:** Prove the implementation meets every acceptance criterion in the origin document's §Success criteria before merge.

**Requirements:** all of R1–R8.

**Dependencies:** Units 1–7.

**Files:**
- Test: `tests/neural-glyph.playwright.ts` (or wherever the repo's Playwright setup lands) — optional if a scripted checklist suffices.

**Approach:**
- Run Lighthouse mobile on `/`. Record score. Compare against a baseline run taken on `main` just before merge.
- FPS check via DevTools Performance recording for 5s of hero idle + 5s of scroll dissolve.
- Visual regression: the 16 screenshots from Unit 6 kept as reference artifacts.
- Accessibility: axe-core DevTools pass on `/` with glyph mounted — must equal v2 baseline (no new violations).
- Memory: DevTools Memory → take two heap snapshots 30s apart with hero in/out/in — no growing detached three.js objects.

**Test scenarios:**
- Integration: Lighthouse mobile performance score ≥ 92.
- Integration: `prefers-reduced-motion: reduce` emulation → no rotation, no dissolve, no magnetism (validated via a recorded performance trace with no `useFrame` work).
- Integration: WebGL disabled in chrome flags → poster `.webp` renders at correct position on both themes.
- Integration: theme toggle dark→light→dark produces smooth 800ms light-direction animation with no flash-of-wrong-theme.
- Integration: canvas `aria-hidden="true"`; keyboard tab order matches v2 (manual tab-through).

**Verification:**
- Every checkbox in origin §Success criteria passes.

## System-Wide Impact

- **Interaction graph:** new client component mounted only inside `app/components/Hero.tsx`. No other section changes. `next-themes` subscription is read-only. No middleware, no API routes, no server-side behavior touched.
- **Error propagation:** WebGL context loss → `<Canvas>`'s `onContextLost` callback unmounts the canvas and swaps to the poster fallback. No error should ever propagate to hero content.
- **State lifecycle risks:** IntersectionObserver + rAF loop must clean up on unmount (`disconnect()` + `cancelAnimationFrame`) to avoid memory leaks. Covered by Unit 5 tests.
- **API surface parity:** n/a — no public API changes. The only new exported component is internal.
- **Integration coverage:** Unit 6's Playwright smoke + Unit 8's memory-snapshot check cover the cross-layer integration (DOM + WebGL + theme).
- **Unchanged invariants:** existing hero copy DOM structure, CTAs, stats bar, display-type classes, and motion variants are unchanged. Projects, Experience, Education, Contact components untouched. Theme tokens in `app/globals.css` unchanged. `app/layout.tsx` unchanged.

## Risks & Dependencies

| Risk | Mitigation |
|---|---|
| `@react-three/fiber` v9/v10 ships a breaking API before install. | Pin to a known-good v8 minor range on install; upgrade later as a separate PR. |
| Bundle size regression pushes JS payload past the 220KB gz budget. | Verify at Unit 1 exit. If over, drop drei entirely (replace `<AdaptiveDpr/>` and `<PerformanceMonitor/>` with 15-line inline equivalents) before dropping shader complexity. |
| Light-theme legibility degrades with glyph present. | Reduce wrapper opacity (Unit 6 fallback path) before merge. Visual regression check is a hard gate. |
| iOS Safari WebGL context is flaky on aggressive backgrounding. | `onContextLost` handler swaps to poster; no retry storm. |
| `prefers-reduced-motion` still produces motion because of CSS tween on poster swap. | Reduced-motion branch uses an instant `src` swap (no CSS transition), per Unit 5 approach. |
| Cursor magnetism feels laggy on low-end GPUs because `u_cursor` update runs every frame. | GPU-side falloff keeps per-frame CPU cost at one vec3 uniform write; no JS-side per-node math. |
| Determinism breaks if `simplex-noise@4` signature changes on a minor bump. | Pin `simplex-noise` version (already pinned in `package.json`). |

## Documentation / Operational Notes

- Add a one-paragraph note in `README.md` under a "Notable components" section pointing to `app/components/NeuralGlyph.tsx` so future contributors know why three.js is a dep.
- No runtime config, monitoring, or rollout concerns. No feature flag — this is a first-paint visual change that either works or falls back to the poster.

## Deferred / Open Questions

### From 2026-06-05 review

- **`leva` listed as deferred but absent from package.json** — Unit 1 / Open Questions (P1, feasibility, confidence 100)

  Plan lists `leva` as a dev-dep and references "tune with `leva` during Unit 2 implementation," but `leva` is not actually installed and there is no in-app tuning panel wired. Either install + wire `leva` (with a `process.env.NODE_ENV === 'development'` gate to keep it out of prod), drop the references and tune via hard-coded constants in `geometry.ts`, or document a leva-free tuning loop. Decide before Unit 2 starts so the implementing agent does not spin on a missing dep.

  <!-- dedup-key: section="unit 1 open questions" title="leva listed as deferred but absent from packagejson" evidence="add dev deps types/three leva" -->

- **220KB bundle budget revision lacks recruiter-cost justification** — Key Technical Decisions / R7 (P1, product-lens, confidence 75)

  R7 was revised from 120KB → 220KB gz "after feasibility review" without articulating the trade-off against the portfolio's primary audience: recruiters on mid-tier networks who bounce on slow first paint. A portfolio hero is a marketing surface, not an app. Re-examine whether 220KB is acceptable, whether the WebGL signature is worth the cost vs. a 30KB Canvas2D alternative, and document the recruiter-cost-vs-identity tradeoff explicitly.

  <!-- dedup-key: section="key technical decisions" title="220kb budget revision lacks recruiter-cost justification" evidence="bundle cost is acceptable inside the 220kb budget" -->

- **ML-identity signal asserted, not demonstrated** — Problem Frame (P1, product-lens, confidence 75)

  The plan asserts the Neural Glyph signals "Joshua's ML identity," but a monochrome point-and-line lattice reads generically as "tech / data viz" without text or labels indicating ML specifically. There is no validation that target viewers (recruiters, research collaborators) decode the visual as ML rather than "generic abstract motion." Worth a sanity check with 3–5 representative viewers, or pairing the glyph with explicit copy (e.g., hero eyebrow text), before committing.

  <!-- dedup-key: section="problem frame" title="ml-identity signal asserted not demonstrated" evidence="the portfolio also has no visual moment that signals joshua's ml identity" -->

- **220KB on portfolio hero mobile recruiter cost unexamined** — R7 / Performance (P1, product-lens, confidence 75)

  Even with the revised 220KB budget, a portfolio hero is the first paint and likely seen primarily on mobile. The plan does not analyze whether 220KB of WebGL JS plus a runtime canvas is appropriate for a marketing-surface first paint vs. the static poster being the primary path. Quantify the trade: target % of viewers on slow networks, expected first-paint regression, and whether the glyph should default to poster-only on mobile.

  <!-- dedup-key: section="r7 performance" title="220kb on portfolio hero mobile recruiter cost unexamined" evidence="220kb gz added three fiber drei floor revised from 120kb" -->

- **Poster bake — live shader vs node-canvas rasterizer mismatch** — Unit 7 (P1, feasibility, confidence 75)

  The bake script approximates the GLSL fragment shader (point falloff, breath, light-direction shading) with `createRadialGradient` in node-canvas. The two render paths are independent implementations of the same visual, so they will drift as the shader evolves. Options: (a) accept visual drift between live and poster and document it; (b) run a headless WebGL bake via `headless-gl` or `puppeteer` to use the actual shader; (c) simplify the live shader to a falloff that node-canvas can match 1:1. Pick one before Unit 7 ships.

  <!-- dedup-key: section="unit 7" title="poster bake live shader vs node-canvas rasterizer mismatch" evidence="render primary nodes as filled circles with the shader-equivalent radial falloff approximated with createradialgradient" -->

- **Reduced-motion + frameloop='demand' interaction with scroll/theme** — Unit 5 / R5 (P1, feasibility, confidence 75)

  Unit 5 sets `frameloop="demand"` under reduced-motion, but the plan also wants reduced-motion scroll-fade (now spec'd as CSS opacity) and instant theme flip (R5). Verify the on-demand frameloop still allows the theme-instant snap to render and that the CSS fade does not require any `requestRender()` invalidate calls. Failure mode: theme toggle under reduced-motion paints the wrong-theme glyph until the next manual invalidate.

  <!-- dedup-key: section="unit 5" title="reduced-motion frameloop demand interaction with scrolltheme" evidence="canvas frameloopdemand scene frozen" -->

- **`eased` variable dead computation in Unit 7 scene** — Unit 7 / motion-pass (P2, coherence, confidence 75)

  Inherited from motion-pass: an `eased` value is computed but only the unsmoothed `t` is used downstream. Either remove the dead computation or thread `eased` into the consumer (likely the scrub progress). Audit before Ship-gate.

  <!-- dedup-key: section="unit 7 motion-pass" title="eased variable dead computation in unit 7 scene" evidence="eased variable computed but not consumed" -->

- **Visual regression — baseline and diff tool not chosen** — Unit 6 / Unit 8 (P2, scope-guardian, confidence 75)

  "16 visual combinations pass the legibility check" appears as a verification step without a concrete tool: Playwright + pixelmatch, Percy, Chromatic, or manual side-by-side. Without a baseline workflow, the gate is unenforceable and regressions will land silently. Pick a tool (Playwright screenshot snapshots are cheapest given Playwright is already in the repo) and commit baselines before Unit 6 merges.

  <!-- dedup-key: section="unit 6 unit 8" title="visual regression baseline and diff tool not chosen" evidence="screenshots at 1440px 1024px 768px 420px dark light full-motion reduced-motion 16 combinations" -->

- **Focus-visible CTA ring legibility against glyph** — Accessibility (P2, design-lens, confidence 75)

  Hero CTAs sit in front of the upper-right 60% × 60% glyph region. The focus ring (Tailwind default `ring-2 ring-ring`) needs an explicit contrast check against the busiest part of the glyph (clusters of primary nodes at peak breath). Likely fine on dark theme; light theme is the risk. Test before Unit 6 ship-gate.

  <!-- dedup-key: section="accessibility" title="focus-visible cta ring legibility against glyph" evidence="hero copy contrast holds on both themes" -->

- **Poster bake desktop-only geometry for tablet/mobile posters** — Unit 7 (P2, feasibility, confidence 75)

  Bake script generates one geometry density (desktop). Mobile and tablet visitors with no-WebGL fall back to a poster that doesn't match the density they'd otherwise see live. Options: bake three posters (`-desktop`, `-tablet`, `-mobile`) and serve the right one via `srcset`, accept the desktop poster as the universal fallback, or skip the poster on mobile entirely (rare no-WebGL on mobile). Decide before Unit 7.

  <!-- dedup-key: section="unit 7" title="poster bake desktop-only geometry for tabletmobile posters" evidence="script imports generateglyphgeometry from app/components/neural-glyph/geometryts and draws the t0 pose" -->

- **Mobile path keeps full WebGL stack** — R7 / Mobile (P2, scope-guardian, confidence 75)

  Even with a `'mobile'` density preset (1200 background points), the mobile path still ships the full three.js + fiber stack and runs the shader. Consider whether mobile should default to poster-only (skip WebGL even when supported) to protect first-paint perf on the primary recruiter device. Couples to the 220KB-on-mobile question above.

  <!-- dedup-key: section="r7 mobile" title="mobile path keeps full webgl stack" evidence="mobile primary 50 background 1200 lines 30" -->

- **"Effect-y" failure-mode preventive mechanism undefined** — Risks (P2, adversarial, confidence 75)

  Origin requirements explicitly call out the risk of the glyph reading as "design student effect" rather than ML signature. No gating step exists between implementation and merge to catch that subjective failure mode — visual regression passes 16 pixel-matched combinations but does not catch "looks like a screensaver." Recommend a hard checkpoint after Unit 4 with 3+ stakeholders rating identity vs. effect on a Likert scale, or kill criteria committed in advance.

  <!-- dedup-key: section="risks" title="effecty failure-mode preventive mechanism undefined" evidence="generic abstract motion vs ml signature" -->

- **220KB budget revision invalidates r3f vs vanilla decision rationale** — Key Technical Decisions (P3, adversarial, confidence 50)

  The "r3f over vanilla three.js" decision was made when the budget was 120KB. At 220KB the trade calculus shifts — vanilla three.js without fiber's React reconciler runtime is ~30–40KB smaller and gives back budget for content. Revisit whether the declarative React ergonomics are worth the residual fiber cost now that the budget has doubled.

  <!-- dedup-key: section="key technical decisions" title="220kb budget revision invalidates r3f vs vanilla decision rationale" evidence="r3f over vanilla threejs declarative react ownership of scene lifecycle gating and theme subscription is cheaper to maintain" -->

## Sources & References

- **Origin document:** `docs/brainstorms/neural-glyph-hero-requirements.md`
- **Predecessor ideation:** `.context/brainstorm-three-js-motion.md`
- Related code: `app/components/Hero.tsx`, `app/components/AnimatedSectionHeader.tsx`, `app/layout.tsx`, `app/globals.css`
- External: `@react-three/fiber` Next 14 integration notes; `simplex-noise@4` functional API.
