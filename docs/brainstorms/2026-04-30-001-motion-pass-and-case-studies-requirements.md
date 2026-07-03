---
name: Motion Pass + Scroll-Pinned Case Studies — Requirements
description: Site-wide motion pass plus scroll-pinned project case study pages
type: feature
---

# Motion Pass + Scroll-Pinned Case Studies — Requirements

**Status:** Reviewed (ce-doc-review applied 2026-04-30) — ready for planning
**Date:** 2026-04-30
**Predecessors:**
- `docs/brainstorms/neural-glyph-hero-requirements.md` (Neural Glyph already shipped — Phase 1 of the wider motion strategy)
- `.context/brainstorm-three-js-motion.md` (origin ideate pool; this doc supersedes the relevant survivors)
**Next step:** `/ce-plan` on this document

## One-line summary

Add a deliberate, restrained motion pass (per-letter hero reveal, scrub-pinned image moments, magnetic CTAs, scroll progress) and replace project modals with scroll-pinned case study pages for three flagship projects — same monochrome editorial language, motion as quiet texture rather than choreography theatre.

## Problem and motivation

The v2 site after Neural Glyph ships is calm and well-made. It earned that calm and we keep it. Two genuine problems remain after the hero:

1. **Project modals truncate the work.** A 600px-wide modal can't show ML/infra projects the way they deserve — there's no room for system diagrams, before/after media, deeper narrative. Three flagship projects (CodeShot, SwitchConfigSim, EduPlanner) have body of work that visibly does not fit in the current modal pattern. This is the strongest argument for change.
2. **The hero is the only moment of choreographed motion.** Neural Glyph creates an opening signature; nothing carries the same craft signal past the first viewport. Section reveals are good but not deliberate.

Inspiration sites (resn.co.nz, framer.com, webflow.com — Playwright-pulled) showed a denser motion grammar than v2 has. We're **not** reproducing their density: those are tooling marketing sites whose job is to demo motion. We're borrowing the technique (GSAP ScrollTrigger for image scrub) where it earns its keep — primarily inside case studies — and keeping the home page restrained.

### Identity constraint (added per product/adversarial review)

Hero copy currently reads: "*from AI-native infrastructure to quiet, well-made interfaces.*" That copy stays. Every motion decision in this doc must read as **texture, not theatre.** Concretely:

- Motion serves comprehension or document structure (scroll progress, reveal-on-entry); it does not perform.
- No motion is added on top of a working static element unless removing it would make the page feel less considered.
- A first-time visitor describing the site as "calm" or "quiet" remains a success signal. A visitor describing it as "very animated" or "Webflow-y" is a failure signal.

## Goals

- **Replace truncating modals with full case study pages** for the three flagship projects (CodeShot, SwitchConfigSim, EduPlanner). This is the primary user-facing win.
- Add a **small, cohesive motion grammar** across the site: per-letter hero reveal, hairline reveals on entry (already partially present via Framer Motion), magnetic CTAs in the hero, a single 1px scroll-progress hairline.
- Reserve **scrub-pinning** for places where pinning earns its cost — image-scrub moments inside case studies. **Do not** scrub-pin Experience or Education; those are lists, not narratives.
- Reuse Neural Glyph's hydration, IntersectionObserver, density-tier, and reduced-motion patterns. Extract the reduced-motion + media-query helper into a shared `lib/hooks/` module before adding new motion primitives.
- Hold performance: **first-load JS delta on `/` ≤ 50KB gzipped**, **first-load JS for `/work/[slug]` ≤ 60KB gzipped** above current baseline (which already includes Neural Glyph + framer-motion + three.js). Hard cap: 80KB on `/`.

## Non-goals

- **No "Webflow-grade" framing.** We borrow GSAP for one specific job (scrub-pin image moments inside case studies); we are not porting their site model.
- **No new color, gradients, or glow.** Same monochrome palette as v2.
- **No persistent 3D canvas behind every section.** Neural Glyph stays scoped to the hero.
- **No Lenis / locomotive-scroll site-wide.** And we will explicitly **remove** `html { scroll-behavior: smooth }` from `app/globals.css` to avoid double-smoothing when ScrollTrigger scrub is active. Anchor-link smooth scroll moves to `gsap.to(window, { scrollTo })` for the targeted callers (`TopNav.tsx`, `Hero.tsx`).
- **No scrub-pinning on Experience or Education.** Lists with date columns already read as timelines; pinning adds maintenance cost (re-tuning every time content changes) without proportional payoff.
- **No magnetic CTAs on coarse pointers.** Disabled via media query.
- **No scroll progress hairline + sticky nav z-index conflict.** The hairline renders inside `<header>` (TopNav), inheriting the nav's stacking context, not as a sibling of `<body>`.
- **No stat-row counter slot.** Ship stats as plain typeset numbers in body copy. Counter animations are a SaaS-landing-page tell that doesn't serve any stated goal.
- **No anchor TOC on case studies in v1.** Linear scroll is fine for three pages of three-to-five sections each. Add later if a project's narrative requires it.
- **No side-by-side or next-up slots in v1.** Drop until a project actually wants them.
- **No GSAP-replacement of Framer Motion.** Existing `motion.*` usage stays. Hairline reveals continue using Framer Motion `whileInView`. GSAP is added only for one capability Framer Motion can't easily express: ScrollTrigger pin + scrub for image moments.
- **No 404 on unmapped `/work/[slug]`.** Unmapped slugs `redirect()` to `/#work` so any URL that ever shipped stays valid.
- **No custom cursor.** Magnetic interactions adjust target elements only.

## Users and usage

- **Primary audience:** recruiters, hiring managers, fellow engineers and researchers — same as Neural Glyph's audience.
- **Usage surface:**
  - Coverage Area #1 (motion pass): every page on the site.
  - Coverage Area #2 (case studies): one route per flagship project at `/work/[slug]`. Linked from the home `Projects` section in place of the modal trigger for those three slugs only.
- **Frequency:** every page view. Motion must not feel performative on the second visit — entries fire once per session per element.

---

## Coverage Area #1: Site-wide motion pass

### Motion primitives (4, not 5)

The stat-row counter is dropped. Scroll progress and magnetic CTAs survive review with constraints noted.

1. **SplitText reveal** — characters or words fade and rise (8–14px, 600–800ms, `power3.out`) with a 12–20ms stagger. Used on display heads (`<h1>`, section heads, large eyebrows), once per element on intersect. **Implementation:** hand-rolled span splitter (≤80 lines, zero deps) — see Implementation note below.
2. **Hairline / element reveal** — already shipped via Framer Motion `whileInView` in section components. **Keep as-is.** Audit pass only: ensure stagger timing is consistent (50–80ms) and `viewport: { once: true }` is set everywhere.
3. **Magnetic CTA** — primary `<a>` and `<button>` elements in the hero subtly translate (≤6px) toward the cursor when within ~80px. Implemented with **Framer Motion** (already in bundle — `useMotionValue` + `useSpring`), not GSAP. Cursor leaves → spring back. Disabled on `pointer: coarse`. Translation clamped so element edge never moves closer than 8px to viewport edge. Adjacent magnetic CTAs translate independently — no exclusion zone.
4. **Scroll progress** — a 1px hairline rendered as the **last child of `<header>`** in `TopNav.tsx` (NOT as a sibling of body content). Fills left→right scaled by `window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)`. Uses Framer Motion's `useScroll` + `useTransform` — zero added dependencies.

ScrollTrigger is reserved for Coverage Area #2 image-scrub slots only. It is not loaded on the home page. This keeps the home `/` first-load JS delta well inside the 50KB target.

### Targeted surfaces (concrete inventory)

This is the canonical list. If a surface isn't here, it doesn't get touched.

- `app/components/Hero.tsx`
  - `<h1>` Joshua Vallabhaneni — replace existing `motion.h1` y/opacity with **SplitText per-character reveal**. Original text remains in DOM via `aria-label`; per-char spans are `aria-hidden`.
  - "Selected work" link — magnetic CTA.
  - "pjvallabhaneni@gmail.com" mailto — magnetic CTA.
- `app/components/TopNav.tsx`
  - Append the 1px scroll-progress hairline as the last child of `<header>`. Same `--foreground` token at 30% opacity.
  - Replace `scrollIntoView({ behavior: "smooth" })` calls with `gsap.to(window, { scrollTo: { y: el } })` ONLY if GSAP is already loaded for the route; otherwise fall back to `scrollIntoView` (which works once `scroll-behavior: smooth` is removed from `globals.css`).
- `app/components/Hero.tsx` mailto handler — same scroll-behavior consideration applies.
- `app/components/Projects.tsx`
  - Section heading: SplitText per-word.
  - Three rows for `switchconfigsim`, `codeshot`, `eduplanner` become `<Link href="/work/[slug]">` (inside the same `motion.div` reveal stagger). Other 10 projects keep the existing modal pattern. Branch on slug-allowlist.
- `app/globals.css`
  - **Remove `html { scroll-behavior: smooth }`.** Anchor-link smoothness moves to JS callers. (This is a one-line removal, but ScrollTrigger scrub correctness depends on it.)

### Reduced motion + a11y

- All four primitives short-circuit to immediate end-state when `prefers-reduced-motion: reduce` matches. Implemented via shared `lib/hooks/useMediaQueryLive.ts` (extracted from `app/components/NeuralGlyph.tsx` — currently inlined there).
- SplitText keeps semantic text accessible: original string in `aria-label`; per-character spans `aria-hidden="true"`.
- Magnetic CTAs do not move on focus — only on cursor proximity. Keyboard users see standard underline behavior.
- Pinned sections (case study image-scrub only) jump to end-state on focus regardless of scroll position; pin-spacer does not set `overflow: hidden`.

### Performance budget (per-route)

- **Home `/`:** ≤50KB gzipped first-load delta over current baseline. Hard cap: 80KB.
  - SplitText: hand-rolled, ~0KB.
  - Magnetic + scroll progress: Framer Motion already in bundle, ~0KB.
  - Net delta: only the hand-rolled splitter and a `useMotionValue` wrapper. Should land at ≤5KB.
- **`/work/[slug]`:** ≤60KB gzipped first-load delta. GSAP core (~30KB) + ScrollTrigger (~14KB) ≈ 44KB. Slot system + page assets ≤16KB.
- Bundle measured via `npm run build` `First Load JS` for each route.
- All ScrollTriggers killed in `useEffect` cleanup via `gsap.context().revert()` and additionally by a route-level `usePathname` effect that calls `ScrollTrigger.getAll().forEach(t => t.kill())` on path change. `pagehide` is belt-and-suspenders only.

### Tech stack

- **gsap** (`gsap@^3.12`, npm) — core + ScrollTrigger. Loaded **only on `/work/[slug]` routes**, not on `/`. Use Next.js dynamic import inside slot components.
- **Framer Motion** (already installed `^12.4.4`) — used for SplitText animation, magnetic CTAs, scroll progress, hairline reveals.
- No Lenis / locomotive-scroll. ScrollTrigger drives off native scroll. `scroll-behavior: smooth` is removed from `globals.css`.
- New shared module: `lib/hooks/useMediaQueryLive.ts` (extracted from NeuralGlyph) + `lib/hooks/useReducedMotion.ts` (thin wrapper). Both used by Neural Glyph and the new motion primitives.

### React Strict Mode + cleanup contract (added per adversarial review)

Next 14 defaults `reactStrictMode: true`. The `useGsap` hook (or per-component effect for Framer-Motion-only primitives) MUST:
1. Wrap GSAP work in `gsap.context(() => { ... }, scope)`.
2. Cleanup: `ctx.revert()` — scoped, idempotent, removes pin-spacers.
3. Route-change cleanup: a layout-level `usePathname()` effect that calls `ScrollTrigger.getAll().forEach(t => t.kill())`.
4. Dev-mode assertion: after first paint, `ScrollTrigger.getAll().length` matches the inventory count for the current route.

### Mobile policy

- All scrub-pin behavior is disabled on `pointer: coarse`. Mobile users see image-scrub slots as plain `next/image` with the same scale crop applied via CSS transition on `IntersectionObserver` entry — no scroll-driven scrub.
- Magnetic CTAs disabled on `pointer: coarse`. Standard tap interaction.
- Scrub-pin minimum viewport height: if `window.innerHeight < 600`, all pinning falls back to non-pinned reveal-on-entry. Documented in the slot implementation.

---

## Coverage Area #2: Scroll-pinned project case studies

### Page model

Three projects get routes at `/work/[slug]`:

- `/work/codeshot` — CodeShot (CV/RL/agent system; H100 inference; quantitative results).
- `/work/switchconfigsim` — SwitchConfigSim (Go + REST/CLI parity; existing video at `youtu.be/GsN7T22HNzc`).
- `/work/eduplanner` — EduPlanner (1,300+ student users; AI scheduling).

The current `Projects.tsx` modal stays for the other 10 projects. The three flagship rows become `<Link>`s; the other 10 keep the `motion.button` + modal pattern. Both branches share the same outer card chrome.

**Sunset commitment:** the modal pattern is removed once 5 of 13 projects have case study routes (whichever ships first). After that, all 13 projects have routes — shorter case studies (Hero + Narrative + Links only) for the projects without rich media. This is documented as a follow-up issue, not bundled into this brainstorm.

### Slot system (5 slots, not 9)

Each case study page is a fixed sequence of typed slots. A project picks which slots to use; slot order within the page array is project-controlled. Slots:

1. **Hero slot** (required) — title, eyebrow (date + tags), one-sentence summary. Uses SplitText reveal on entry. Empty state: never — title and date are required fields.
2. **Narrative slot** — body block (3–5 paragraphs, ≤900 words) revealing per-word as scrolled into view. **Not pinned** in v1. Empty state: project doesn't include the slot.
3. **Image-scrub slot** — single image that scales 92%→100% width and fades a hairline overlay as the user scrolls past it. Pinned for ~0.8 viewport via ScrollTrigger. **Disabled on `pointer: coarse` and `innerHeight < 600`** — falls back to plain `next/image` with `IntersectionObserver`-triggered scale-in. Loading state: `next/image` blurDataURL placeholder. Missing-asset state: slot is omitted at build time (TS narrowing on optional `image` field).
4. **Video slot** — single muted autoplay `<video>` (loops or one-shot per project). Plays only when in view via `IntersectionObserver`. `preload="metadata"`, `playsInline`. Loading state: poster image. Autoplay-blocked state: visible play button overlay (default browser controls hidden, single overlay button shown).
5. **Links slot** (typically closing) — GitHub, paper, demo, video, news. Magnetic CTAs.

The slot inventory is kept this small because three projects with five slots each is fifteen slot instances; that is enough to validate the abstraction without designing slots that have no consumer.

Dropped from v1 (recoverable later, no architectural commitment burned):
- Anchor TOC slot (linear scroll is fine for ≤5 sections; not worth right-rail complexity yet)
- Side-by-side slot (no project currently needs it)
- Stat row slot (counter animation is the wrong tone; numbers go inline in body copy)
- Next-up slot (browser back is sufficient navigation; no pagination story needed for three pages)

### Data shape

Case study content lives in `lib/case-studies/`. Each project is a TypeScript module exporting a typed object:

```ts
export type Slot =
  | { type: "hero"; title: string; eyebrow: string; tags: string[]; summary: string }
  | { type: "narrative"; paragraphs: string[] }
  | { type: "imageScrub"; src: string; alt: string }
  | { type: "video"; src: string; poster?: string; loops: boolean }
  | { type: "links"; links: Array<{ text: string; url: string; icon?: string }> };

export interface CaseStudy {
  slug: string;
  slots: Slot[];
}
```

`/work/[slug]/page.tsx` imports `lib/case-studies/index.ts` (a slug→CaseStudy map), narrows on slug, renders slots in array order. Unknown slug → `redirect("/#work")`.

### Initial project content

Plan-time deliverables for Joshua before shipping:
- **CodeShot:** narrative paragraphs (already strong material in Projects.tsx description), 1–2 image-scrub assets (system architecture diagram + before/after similarity comparison), no video required.
- **SwitchConfigSim:** narrative paragraphs, 1 image-scrub asset (CLI/REST parity diagram), 1 video slot (existing YouTube link — use direct mp4 mirror or YouTube embed; decide at plan).
- **EduPlanner:** narrative paragraphs, 1 image-scrub asset (planner UI screenshot), 0 video required.

Asset gap acknowledged: CodeShot and EduPlanner image-scrub assets may need to be created. Tracked as plan-time deliverable, not a brainstorm-time blocker.

### Navigation back

- TopNav appears on case study pages (already sitewide). The "Work" link uses `gsap.to(window, { scrollTo })` to anchor back to `/#work` on the home page.
- Browser back returns to home with the project row in view (App Router scroll restoration).
- Cmd/Ctrl+click opens new tab; standard.
- Unmapped `/work/[slug]` → `redirect("/#work")` server-side. Never 404.

### Reduced motion + a11y on case studies

- Same short-circuit rules as Coverage Area #1.
- Pages render readable HTML server-side; pinning + scrubs are progressive enhancement only.
- Pin-spacer does not set `overflow: hidden`; focused elements jump to end-state regardless of scroll position.

---

## Out of scope (deferred for later)

- **Locomotive / Lenis smooth scroll site-wide.**
- **Cursor visualizer (the resn dot).**
- **3D inside case studies.**
- **MDX-based case studies.** TS modules first.
- **Anchor TOC slot, Side-by-side slot, Stat-row slot, Next-up slot.** Dropped from v1; revisit when content demands it.
- **Universal route migration (modal → route for all 13 projects).** Tracked as follow-up; gated on the first 5 projects landing well.

---

## Success criteria

- **Three case study pages live** at `/work/codeshot`, `/work/switchconfigsim`, `/work/eduplanner`. Each page is readable without JS and reads as a deliberate writeup at three viewport heights.
- **Hero `<h1>` reveals per character** on first paint; reduced-motion users see the final string without animation.
- **Scroll progress hairline** fills accurately on long pages (case studies); does not fight TopNav backdrop blur z-index.
- **Magnetic CTAs** in hero translate ≤6px on cursor proximity on fine pointers; do not move on coarse pointers or on keyboard focus.
- **`scroll-behavior: smooth` removed** from `globals.css`; anchor-link smoothness preserved via JS callers.
- **No regressions** on existing pages. Type-checking clean (`npm run lint`), no console errors during scroll on Playwright Chromium pull.
- **ScrollTrigger leak check:** Navigate `/` → `/work/codeshot` → `/` and verify `ScrollTrigger.getAll().length` returns to 0 (or to the home-route baseline if any home-route triggers survive).
- **Bundle delta within budget.** `/` first-load JS delta ≤50KB gzipped (target) / ≤80KB gzipped (hard cap). `/work/[slug]` ≤60KB. Measured via `npm run build`.
- **Identity check (subjective):** a peer engineer shown the home page cold describes the site as "calm" or "considered," not as "very animated" or "Webflow-y."
- **Lighthouse Performance ≥ 90** on mobile and desktop on `/` and on each new `/work/[slug]` route. CLS ≤ 0.05.

---

## Open questions

1. **SplitText source.** Resolved: hand-roll a 50–80-line span splitter (Option C from previous draft). Zero dep cost; covers per-char and per-word; no rotation/3D needed. Plan time: confirm exact API surface (`<SplitText kind="char" stagger={0.012}>...</SplitText>` or similar).
2. **Smooth scroll for pinned image moments.** Default: skip Lenis. Test scrub on case study pages first; only revisit if a specific image-scrub feels janky on Mac trackpad momentum.
3. **SwitchConfigSim video slot:** YouTube embed (small bundle, third-party) vs. direct mp4 mirror (larger first-load, full control). Decision at plan.
4. **Image-scrub asset creation:** CodeShot system diagram + EduPlanner planner screenshot may need to be created. Plan-time list owners and timing.
5. **Modal sunset:** explicit timeline for retiring the modal pattern after first 5 case studies ship. Plan-time decision (date or event-gated).

---

## Dependencies and assumptions

- Neural Glyph hero is shipped on the same branch (`Joshua-Vallabhaneni/check-ce-plugin-v1`) and works in `/`. Verified.
- `lib/case-studies/` does not yet exist — created as part of plan.
- `lib/hooks/useMediaQueryLive.ts` and `lib/hooks/useReducedMotion.ts` do not yet exist — extracted from `NeuralGlyph.tsx` as a Step 0 of the plan.
- `app/work/[slug]/page.tsx` and `app/work/[slug]/layout.tsx` do not exist — created as part of plan.
- `gsap@^3.12` not yet installed — added in plan, route-loaded only.
- Existing Framer Motion (`^12.4.4`) provides `useScroll`, `useTransform`, `useMotionValue`, `useSpring` — sufficient for SplitText, magnetic, hairline reveal, scroll progress.
- `simplex-noise@^4.0.3`, `three@^0.160.1`, `@react-three/fiber@^8.18.0` already installed.
- Playwright MCP (Claude Code tool) available for visual verification — same approach as Neural Glyph. No `@playwright/test` devDependency added; verification is MCP-driven manual screenshot pulls, not a committed test suite.

---

## Notes for planning

- **Step 0 (must come first):** extract `useMediaQueryLive` and add `useReducedMotion` into `lib/hooks/`. Refactor `NeuralGlyph.tsx` to consume them. No motion primitives can land before this.
- Wrap each motion primitive in its own `"use client"` component so initial server-rendered HTML stays untouched.
- GSAP + ScrollTrigger imported only inside `app/work/[slug]/` slot components, never at the top level of `app/page.tsx`. Use `next/dynamic` if needed to keep them out of the home-route bundle.
- ScrollTrigger cleanup pattern is defined above (Strict Mode contract). Plan must include a Step that verifies this with a leak check before each case study slot ships.
- The home `Projects.tsx` keeps the modal for projects without a case study route. Branch on a slug-allowlist constant colocated with `lib/case-studies/`.
- Plan should split work into roughly:
  1. Step 0: extract `useMediaQueryLive` / `useReducedMotion` hooks.
  2. Remove `scroll-behavior: smooth`; migrate scroll callers.
  3. SplitText component + hero application.
  4. Magnetic CTA component + hero application.
  5. Scroll progress hairline component + TopNav integration.
  6. `/work/[slug]` route + slot system (5 slot types).
  7. Three case study content modules.
  8. Cross-route ScrollTrigger leak verification.
  9. Playwright MCP visual verification on `/` and three case study pages.
