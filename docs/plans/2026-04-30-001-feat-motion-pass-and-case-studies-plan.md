---
title: Motion Pass + Scroll-Pinned Case Studies
type: feat
status: active
date: 2026-04-30
origin: docs/brainstorms/2026-04-30-001-motion-pass-and-case-studies-requirements.md
---

# Motion Pass + Scroll-Pinned Case Studies

## Overview

Add a small, deliberate motion grammar across the site (per-letter hero reveal, magnetic CTAs, scroll progress hairline) and replace project modals with full scroll-pinned case study pages for three flagship projects (CodeShot, SwitchConfigSim, EduPlanner). GSAP + ScrollTrigger is loaded only on `/work/[slug]` routes; the home page uses Framer Motion (already in bundle) + a hand-rolled SplitText. No new color, no choreography theatre — motion as quiet texture.

## Problem Frame

Two problems remain after Neural Glyph hero shipped (see origin: `docs/brainstorms/2026-04-30-001-motion-pass-and-case-studies-requirements.md`):

1. **Project modals truncate the work.** A 600px modal can't house a CodeShot or EduPlanner writeup. This is the primary user-facing win.
2. **Hero is the only choreographed moment.** Section reveals are fine but undeliberate — hero `<h1>` deserves the same craft signal Neural Glyph established.

The brainstorm reviewed against six personas; this plan implements the post-review revision (5 slots not 9, 4 primitives not 5, scrub-pin scoped to case-study image moments only, GSAP route-loaded, modals stay for non-flagship projects with sunset commitment).

## Requirements Trace

- **R1.** Replace truncating modals with full case study pages for `codeshot`, `switchconfigsim`, `eduplanner` (origin: Goals, Coverage Area #2).
- **R2.** Add hero `<h1>` per-character SplitText reveal (origin: Coverage Area #1, Targeted surfaces).
- **R3.** Add magnetic CTA behavior on hero "Selected work" link and mailto, disabled on coarse pointer (origin: Coverage Area #1.3).
- **R4.** Add 1px scroll-progress hairline rendered inside `<header>` (origin: Coverage Area #1.4).
- **R5.** Remove `html { scroll-behavior: smooth }`; migrate anchor-link smoothness to JS callers (origin: Non-goals + Coverage Area #1).
- **R6.** Extract `useMediaQueryLive` and add `useReducedMotion` to `lib/hooks/` (origin: Notes for planning Step 0).
- **R7.** Image-scrub slot uses ScrollTrigger pin + scrub on fine pointers ≥600px viewport; `next/image` + IntersectionObserver fallback otherwise (origin: Coverage Area #2 slots, Mobile policy).
- **R8.** Unmapped `/work/[slug]` redirects to `/#work` server-side (origin: Non-goals).
- **R9.** First-load JS delta: `/` ≤50KB gz target / 80KB hard cap; `/work/[slug]` ≤60KB gz (origin: Performance budget).
- **R10.** ScrollTrigger cleanup via `gsap.context().revert()` + route-level `usePathname` effect; pass dev-mode leak check (origin: Strict Mode contract).
- **R11.** Reduced-motion users see end-state for all primitives (origin: Reduced motion + a11y).
- **R12.** Identity check: cold-read description "calm/considered" not "very animated/Webflow-y" (origin: Identity constraint).

## Scope Boundaries

- No new color, gradients, or glow.
- No persistent 3D canvas behind every section. Neural Glyph stays scoped to hero.
- No Lenis / locomotive-scroll site-wide.
- No scrub-pinning on Experience or Education sections (lists, not narratives).
- No magnetic CTAs on coarse pointers.
- No stat-row counter slot.
- No anchor TOC, side-by-side, or next-up slot in v1.
- No GSAP-replacement of Framer Motion. Existing `motion.*` usage stays.
- No 404 on unmapped `/work/[slug]` — redirect.
- No custom cursor.
- No `@playwright/test` devDependency added — Playwright MCP only.

### Deferred to Separate Tasks

- **Universal modal → route migration** (all 13 projects to case study routes): tracked as follow-up issue, gated on the first 3 case studies landing well. Not in this plan.
- **Anchor TOC slot, Side-by-side slot, Stat-row slot, Next-up slot:** revisit when content demands.
- **Smooth-scroll lib (Lenis) for pinned moments:** decide post-ship if Mac trackpad scrub feels janky on case study pages.

## Context & Research

### Relevant Code and Patterns

- `app/components/NeuralGlyph.tsx` — `useMediaQueryLive` (lines 28–43) and `useDensity` (lines 45–51) defined inline. Pointermove on wrapperRef (lines 138–154) and density-tier IntersectionObserver pattern (lines 100–126) are templates for the new motion primitives.
- `app/components/Hero.tsx` — current `motion.h1` y/opacity reveal (lines 28–37) gets replaced by SplitText. CTAs at lines 53–69 become magnetic.
- `app/components/TopNav.tsx` — fixed `z-40` header with `backdrop-blur-md bg-background/70 border-b` after `scrollY > 16`. The scroll-progress hairline appends as last child of `<header>` to inherit stacking context. `scrollIntoView({ behavior: "smooth" })` calls at lines 50–66 must migrate.
- `app/components/Projects.tsx` — `ProjectCard` (lines 27–256) wraps `motion.button` + portal modal. Three flagship rows branch to `<Link href="/work/[slug]">`; remaining 10 keep modal. Same outer card chrome both branches.
- `app/components/Experience.tsx`, `app/components/education-involvement/index.tsx`, `app/components/Contact.tsx` — keep current `whileInView` animations. Only audit for `viewport: { once: true }` consistency.
- `app/globals.css` line 56: `html { scroll-behavior: smooth }` — removed in Unit 1.
- `app/layout.tsx` — root layout wraps everything; case study pages inherit `next-themes` provider.
- `next.config.mjs` — no `reactStrictMode` override; defaults to `true` in Next 14.

### Institutional Learnings

- Neural Glyph's hydration pattern (`mounted && resolvedTheme` guard) and `useMediaQueryLive` cleanup are the canonical templates here. Reuse, don't reinvent.
- Bundle budgets in the previous Neural Glyph plan were initially set too tight (120KB) and revised to 220KB once measured. Set per-route budgets here to avoid the same retroactive correction.

### External References

- GSAP + React 18 Strict Mode: official guidance is `gsap.context()` with `ctx.revert()` cleanup (https://gsap.com/resources/React/). `useGSAP` hook from `@gsap/react` is the canonical wrapper but adds ~1KB; for this scope the inline `gsap.context()` pattern in a per-component effect is sufficient and avoids the extra dep.
- ScrollTrigger pin + Next.js App Router soft navigation: `pagehide` does not fire on App Router transitions. Cleanup must happen in component `useEffect` cleanup AND via `usePathname` effect at layout level.

## Key Technical Decisions

- **GSAP loaded only on `/work/[slug]` routes via `next/dynamic` with `ssr: false`.** Home `/` first-load stays untouched. (R9)
- **Hand-rolled SplitText** (≤80 lines, zero deps). Animation driven by Framer Motion `useInView` + per-span motion variants — no GSAP on hero. (R2, R9)
- **Magnetic CTAs use Framer Motion `useMotionValue` + `useSpring`**, attaching `pointermove` listener per-element (not document-wide). Honors existing `pointer: coarse` detection. (R3)
- **Scroll progress hairline uses Framer Motion `useScroll` + `useTransform`**, rendered as last child of `<header>` in `TopNav.tsx`. Inherits z-40 stacking context — no z-index conflict with backdrop-blur. (R4)
- **Image-scrub slot pin policy:** disabled on `pointer: coarse` OR `window.innerHeight < 600`. Falls back to `IntersectionObserver`-triggered scale-in via Framer Motion. (R7, Mobile policy)
- **Slot data lives in `lib/case-studies/`** as TS modules with discriminated union slot types. `index.ts` exports a `slug → CaseStudy` map. `app/work/[slug]/page.tsx` does `Object.keys(map).includes(slug) ? render : redirect("/#work")`. (R1, R8)
- **Modal stays for non-flagship slugs.** `Projects.tsx` branches on a slug-allowlist constant colocated with `lib/case-studies/index.ts`. Both branches share the outer `motion.div` reveal stagger. (R1)
- **ScrollTrigger cleanup contract:** `gsap.context(() => { ... }, scope)` per component, `ctx.revert()` on unmount, plus a layout-level `usePathname` effect that runs `ScrollTrigger.getAll().forEach(t => t.kill())` on path change. Dev-mode assertion: log `ScrollTrigger.getAll().length` on `/` to verify it's 0. (R10)
- **Anchor link migration:** when removing `scroll-behavior: smooth`, in-page anchor smoothness in `TopNav.tsx` and `Hero.tsx` becomes a small `smoothScrollTo(id)` helper using `window.scrollTo({ behavior: "smooth", top })`. No GSAP needed for this — `window.scrollTo` honors `behavior: "smooth"` independently of `html { scroll-behavior }`. (R5)
- **SwitchConfigSim video:** YouTube `<iframe>` embed (no bundle hit, third-party). Mp4 mirror only if iframe latency is unacceptable post-ship — defer.
- **Image-scrub assets:** CodeShot architecture diagram + EduPlanner planner screenshot need creation. Joshua provides via plan-time screenshot pull (browser dev tools or Figma). Tracked as Unit 7 deliverable, not blocker.

## Open Questions

### Resolved During Planning

- **SplitText source:** hand-rolled, Framer Motion-driven (origin Q1).
- **SwitchConfigSim video format:** YouTube iframe.
- **TopNav scroll progress z-index:** rendered inside `<header>` — inherits z-40, no separate z-index needed.
- **Strict-Mode cleanup pattern:** `gsap.context().revert()` per component + `usePathname` effect at layout level.

### Deferred to Implementation

- **Exact stagger timing on hand-rolled SplitText** (12ms vs 18ms vs 24ms) — feels-test in browser.
- **Image-scrub scale range** (90→100% vs 92→100% vs 95→100%) — feels-test in browser.
- **Magnetic CTA spring stiffness/damping** — feels-test.
- **Modal sunset timeline.** Tracked as follow-up issue post-ship; this plan does not commit a date.
- **Whether any image-scrub slot reads janky on Mac trackpad momentum** and would benefit from Lenis. Defer to post-ship.

### Deferred from Doc Review (2026-05-02)

- **F. Cut Magnetic CTAs entirely?** Cross-persona convergence flagged R3/Unit 3 as the highest identity-drift risk + perf concern + state-coverage gap. Plan's own risk table names magnetic CTAs as the first removal candidate. Decide during Unit 3 implementation: if the magnetic motion reads as "trying too hard" against the calm identity, ship without it (delete Unit 3, leave hero CTAs as plain Framer Motion `whileHover`).
- **G. SplitText reduced-motion DOM treatment.** Resolved in plan: reduced-motion returns plain text node, not per-character spans. (Was advisory; promoted to plan body.)
- **H. Collapse `lib/case-studies/types.ts` into `index.ts`; consider dropping the `VideoSlot` type variant in favor of inlining the SwitchConfigSim YouTube embed in its case-study module.** Single-consumer abstraction. Decide during Unit 5 implementation.
- **I. "Back to work" affordance + flagship-card hover differentiation.** Identical hover chrome ("View" + ArrowUpRight) for cards that route vs cards that modal is a UX inconsistency. Add a hover-time icon swap (ArrowRight for routes, ArrowUpRight for modals) during Unit 5, and a sticky "← Back to work" link in the case-study `<header>` row during Unit 6. Verify with Playwright MCP visual diff.
- **J. Replace hand-rolled SplitText with Framer Motion `staggerChildren`?** Could collapse Unit 2's component from ~80 to ~20 lines using already-loaded library primitives. Decide at start of Unit 2: if the Framer Motion variant pattern lands in <30 lines including font-load guard + reduced-motion branch, prefer it.

### Strategic / Out-of-Scope

- **Identity drift remains the load-bearing risk.** Unit 8 cold-read check is the only structural guard. Do the cold-read on a fresh browser session, not from the dev cache.
- **Modal-vs-route premise.** The wider-modal alternative was not formally weighed in brainstorm. This plan commits to routes; revisit if the 3 case studies do not measurably improve recruiter outreach within 8 weeks of ship.
- **Hairline scroll-progress visibly stalls during pinned image-scrub sections** because pin-spacers extend document height. Acceptable for v1; revisit if it reads as a bug during identity check.

## Output Structure

```
app/
  work/
    [slug]/
      page.tsx                           # server component, narrows slug → renders slots or redirects
      CaseStudy.tsx                      # client component, drives slots + ScrollTrigger
      slots/
        HeroSlot.tsx
        NarrativeSlot.tsx
        ImageScrubSlot.tsx               # GSAP ScrollTrigger pin + scrub (route-loaded)
        VideoSlot.tsx
        LinksSlot.tsx
  components/
    motion/
      SplitText.tsx                      # client, Framer Motion driven
      MagneticCTA.tsx                    # client, Framer Motion driven
      ScrollProgress.tsx                 # client, Framer Motion useScroll
      smoothScrollTo.ts                  # tiny utility
      ScrollTriggerCleanup.tsx           # client, layout-level usePathname effect
lib/
  hooks/
    useMediaQueryLive.ts                 # extracted from NeuralGlyph
    useReducedMotion.ts                  # thin wrapper
  case-studies/
    index.ts                             # slug → CaseStudy map + allowlist export
    types.ts                             # Slot discriminated union, CaseStudy interface
    codeshot.ts
    switchconfigsim.ts
    eduplanner.ts
public/
  case-studies/                          # image-scrub assets per project
    codeshot-architecture.png
    eduplanner-planner.png
    switchconfigsim-cli-rest.png
```

## High-Level Technical Design

> *This illustrates the intended approach and is directional guidance for review, not implementation specification. The implementing agent should treat it as context, not code to reproduce.*

### Slot system shape

```ts
type Slot =
  | { type: "hero"; title: string; eyebrow: string; tags: string[]; summary: string }
  | { type: "narrative"; paragraphs: string[] }
  | { type: "imageScrub"; src: string; alt: string }
  | { type: "video"; kind: "youtube"; videoId: string } | { type: "video"; kind: "mp4"; src: string; poster: string }
  | { type: "links"; links: Array<{ text: string; url: string; icon?: "github"|"youtube"|"external"|"paper" }> };

interface CaseStudy { slug: string; slots: Slot[] }
// title, date, tags live on the HeroSlot (origin: brainstorm Data shape).
```

### Render flow

```
/work/[slug] (server component)
  → look up slug in lib/case-studies/index.ts map
  → if missing: redirect("/#work")
  → if present: render <CaseStudy slots={...} />
        ↓
    CaseStudy (client)
      → wraps gsap.context() once
      → maps slots to slot components in array order
      → on unmount, ctx.revert()
        ↓
    For each slot type, lazy-load only what's needed:
      ImageScrubSlot uses next/dynamic({ ssr: false }) for ScrollTrigger import
      VideoSlot inlines an iframe or video element
```

### ScrollTrigger leak guard

```
RootLayout
  └── ScrollTriggerCleanup (client component)
        useEffect on usePathname change:
          ScrollTrigger.getAll().forEach(t => t.kill())
```

## Implementation Units

- [ ] **Unit 1: Hooks extraction + `scroll-behavior: smooth` removal**

**Goal:** Establish shared `useMediaQueryLive` and `useReducedMotion` in `lib/hooks/`. Remove `html { scroll-behavior: smooth }` from globals; migrate the two callers in `TopNav.tsx` and `Hero.tsx` to a small `smoothScrollTo()` utility. Refactor `NeuralGlyph.tsx` to consume the extracted hooks.

**Requirements:** R5, R6

**Dependencies:** None

**Files:**
- Create: `lib/hooks/useMediaQueryLive.ts`
- Create: `lib/hooks/useReducedMotion.ts`
- Create: `app/components/motion/smoothScrollTo.ts`
- Modify: `app/components/NeuralGlyph.tsx` (remove inline `useMediaQueryLive`; import from `lib/hooks`)
- Modify: `app/globals.css` (remove `scroll-behavior: smooth` from `html`)
- Modify: `app/components/TopNav.tsx` (replace `scrollIntoView` calls with `smoothScrollTo`)
- Modify: `app/components/Hero.tsx` (replace `scrollIntoView` call in "Selected work" handler)
- Modify: `app/components/floating-nav.tsx` (replace `scrollIntoView` at line 51 with `smoothScrollTo`)

**Approach:**
- **Step 0 — Bundle baseline.** Before any code changes, run `npm run build` and record First Load JS for `/` from the build output. Save the number to `docs/plans/2026-04-30-001-baseline.txt`. R9's "≤50KB delta" measures against this number, not against memory. Prior Neural Glyph work blew past its initial 120KB budget by 83%; this step prevents the same retroactive correction.
- `useMediaQueryLive(query, defaultValue?)` mirrors current inline implementation in `NeuralGlyph.tsx` lines 28–43 — `change` event listener, cleanup, SSR-safe default.
- `useReducedMotion()` returns `useMediaQueryLive("(prefers-reduced-motion: reduce)")` — single line.
- `smoothScrollTo(elementId: string)` looks up element, calls `window.scrollTo({ top: rect.top + window.scrollY - offset, behavior: "smooth" })`. Offset accounts for `TopNav` height (~64px on scroll, set once as constant).
- `NeuralGlyph.tsx` removes the local hook definitions and imports from `lib/hooks/`.

**Patterns to follow:**
- `app/components/NeuralGlyph.tsx` for hook signature and cleanup style.

**Test scenarios:**
- *Happy path:* loading `/` shows hero; clicking "Selected work" smooth-scrolls to `#work` section; clicking TopNav "Experience" smooth-scrolls to `#experience`. Verify via Playwright MCP — page snapshot before click + after click + during scroll show the y position changing smoothly over ~600ms.
- *Edge case:* `prefers-reduced-motion: reduce` set in browser → `useReducedMotion()` returns `true` immediately on hooked component; behavior unchanged for click handlers (browser still honors `behavior: "smooth"` per OS — acceptable for now since mainline browsers respect the user's reduce-motion preference at the API level).
- *Integration:* Neural Glyph still mounts/unmounts correctly after refactor (IntersectionObserver still gates canvas), and the `(prefers-reduced-motion: reduce)` path through `Scene.tsx` is unchanged.

**Verification:**
- Type check passes (`npm run lint`).
- Visual: Playwright MCP page-load on `/` shows Neural Glyph rendering as before, no console errors.
- `grep -r "scroll-behavior" app/` returns no matches.

---

- [ ] **Unit 2: SplitText component + hero `<h1>` integration**

**Goal:** Replace `Hero.tsx`'s `motion.h1` y/opacity reveal with a per-character SplitText animation. Animation driven by Framer Motion `useInView` + per-span motion variants. No GSAP. Reduced-motion users see the final string immediately.

**Requirements:** R2, R11

**Dependencies:** Unit 1

**Files:**
- Create: `app/components/motion/SplitText.tsx`
- Modify: `app/components/Hero.tsx`

**Approach:**
- Component API: `<SplitText kind="char" stagger={14} duration={700} y={12} once>{text}</SplitText>` returns a span containing `aria-label={text}`, with one inner `<span aria-hidden>` per character. Each inner span animates `opacity 0→1` and `y 12px→0` on parent `useInView` once.
- **Font-load guard:** wait for `document.fonts.ready` before splitting and animating, otherwise the per-character spans render at fallback-font metrics and reflow mid-animation when the web font swaps in (CLS + visible jump). Until fonts ready, render the plain text node so the `<h1>` has correct kerning/ligatures and screen readers see meaningful content. After fonts ready, swap to the split DOM and trigger `useInView`.
- Whitespace handling: collapse runs of whitespace into a single non-breaking inline space; do not animate spaces.
- `prefers-reduced-motion: reduce` → return the plain text node (`<>{text}</>` wrapped in the original `h1`) — do NOT render per-character spans. Per-char spans persist visually but break text selection, ligatures, and some screen-reader behaviors. End-state for reduced motion = no SplitText DOM at all.
- Hero `<h1>` content "Joshua\nVallabhaneni." stays as-is; SplitText receives the full string and inserts a `<br>` for the newline.

**Patterns to follow:**
- Framer Motion variants pattern already used in `app/components/Hero.tsx` and `app/components/Projects.tsx`.

**Test scenarios:**
- *Happy path:* on `/` first paint, hero `<h1>` characters animate in over ~800ms with ~14ms stagger; final state matches the static h1 visually.
- *Edge case:* `prefers-reduced-motion: reduce` → h1 renders fully visible at first paint; no animation. Tested via Chrome DevTools rendering tab + Playwright MCP screenshot.
- *Edge case:* viewport very narrow (mobile) → wrapping behavior identical to current `<h1>`. The `clamp(3.75rem, 11vw, 11rem)` font size still applies; no per-char wrap orphans worse than current.
- *Accessibility:* `aria-label` on outer span equals `Joshua Vallabhaneni.`; per-char spans are `aria-hidden="true"`. Verified by reading DOM in Playwright MCP.

**Verification:**
- Visual diff via Playwright MCP screenshot: end-state matches the previous `motion.h1` final position pixel-for-pixel.
- Lighthouse Performance ≥ 90 on `/` mobile.

---

- [ ] **Unit 3: Magnetic CTA component + hero CTAs**

**Goal:** Apply magnetic translation to hero "Selected work" link and `pjvallabhaneni@gmail.com` mailto. Disabled on coarse pointer.

**Requirements:** R3, R11

**Dependencies:** Unit 1

**Files:**
- Create: `app/components/motion/MagneticCTA.tsx`
- Modify: `app/components/Hero.tsx`

**Approach:**
- Component wraps a child `<a>` or `<button>` and tracks `pointermove` on its bounding rect (radius 80px). When cursor within radius, sets `x = clamp((cursor.x - center.x) * 0.15, -6, 6)` and similar for y. Springs back on `pointerleave`.
- Uses Framer Motion `useMotionValue` + `useSpring` (stiffness 150, damping 18).
- Disabled when `useMediaQueryLive("(pointer: coarse)")` returns true → renders child unchanged.
- Disabled when `useReducedMotion()` returns true.
- Edge clamp: translation clamped to 8px from viewport edge — done via `Math.min(maxX, viewportRight - elementRight - 8)` style guard.
- Adjacent CTAs: each `MagneticCTA` listens independently. Both CTAs translating toward cursor between them is acceptable (they don't collide because each is bounded by 6px).

**Patterns to follow:**
- Framer Motion spring usage in `app/components/Projects.tsx` modal animations.

**Test scenarios:**
- *Happy path (desktop):* cursor 50px from "Selected work" link → link translates ~3px toward cursor; cursor leaves → link springs back to origin within 200ms. Verified via Playwright MCP (`mcp__playwright__browser_hover` + screenshot).
- *Edge case (coarse pointer):* iPhone emulation in Playwright MCP → tap on "Selected work" works; element does not translate.
- *Edge case (reduced motion):* `prefers-reduced-motion: reduce` set → no translation, only hover underline.
- *Edge case (focus):* Tab to "Selected work" via keyboard → element does not translate; standard underline visible.

**Verification:**
- Both CTAs in hero respond on fine pointer, do not respond on coarse.
- No console warnings from Framer Motion about ref forwarding.

---

- [ ] **Unit 4: ScrollProgress component + TopNav integration**

**Goal:** Add a 1px hairline at the top of `<header>` that fills left→right as the user scrolls. Inherits TopNav's z-40 stacking context. Single instance for the whole site.

**Requirements:** R4

**Dependencies:** Unit 1

**Files:**
- Create: `app/components/motion/ScrollProgress.tsx`
- Modify: `app/components/TopNav.tsx`

**Approach:**
- Use Framer Motion `useScroll()` (returns `scrollYProgress` 0→1) and apply via `style={{ scaleX: scrollYProgress, transformOrigin: "left" }}` on a positioned child `<motion.div>`.
- Render as last child of `<header>` element in `TopNav.tsx`. Position: `absolute bottom: 0; left: 0; right: 0; height: 1px; background: hsl(var(--foreground) / 0.3)`.
- Reduced-motion users still see progress fill — it's not animated motion, it's scroll-linked state. (Per origin: reduced-motion short-circuits motion, not state.)

**Patterns to follow:**
- TopNav's existing inner div structure.

**Test scenarios:**
- *Happy path:* scroll halfway down `/` → hairline fills 50% width. Scroll to bottom → fills 100%. Scroll back up → fills retract.
- *Edge case:* very short page (single section, no scroll possible) → `scrollYProgress` stays at 0; hairline stays at scaleX 0 (invisible). No errors.
- *Edge case:* `/work/codeshot` scroll → hairline tracks document scroll on that route too. Verified after Unit 6 lands.
- *Visual:* hairline is not occluded by `backdrop-blur-md bg-background/70` because it is inside the same `<header>` element above the blur layer.

**Verification:**
- Visual on `/` at scroll positions 0%, 25%, 50%, 75%, 100% via Playwright MCP screenshots.
- z-index inheritance verified: hairline visible at all scroll positions, not behind blur.

---

- [ ] **Unit 5: Case study route + redirect handler + slot type system**

**Goal:** Stand up `/work/[slug]` route. Server component looks up slug in `lib/case-studies/index.ts` and either renders `<CaseStudy>` client component or `redirect("/#work")`. Slot type definitions and registry land in this unit.

**Requirements:** R1, R8

**Dependencies:** Unit 1

**Files:**
- Create: `app/work/[slug]/page.tsx`
- Create: `app/work/[slug]/CaseStudy.tsx`
- Create: `lib/case-studies/types.ts`
- Create: `lib/case-studies/index.ts`
- Modify: `app/components/Projects.tsx` (branch flagship slugs to `<Link>` instead of modal trigger)

**Approach:**
- `lib/case-studies/types.ts` defines the discriminated `Slot` union and `CaseStudy` interface (see High-Level Technical Design).
- `lib/case-studies/index.ts` exports a `CASE_STUDIES: Record<string, CaseStudy>` map and a `CASE_STUDY_SLUGS: Set<string>` allowlist used by `Projects.tsx`.
- `app/work/[slug]/page.tsx` is a Server Component: imports `CASE_STUDIES`, narrows `params.slug`, calls `redirect("/#work")` if absent, otherwise returns `<CaseStudy data={CASE_STUDIES[slug]} />`. Includes Next.js `generateStaticParams` exporting known slugs.
- `app/work/[slug]/CaseStudy.tsx` is a Client Component, mounts the gsap.context for the page, maps slots to slot components (built in Unit 6).
- `Projects.tsx`: `ProjectCard` accepts a new optional prop `caseStudySlug?: string`. If present, the outer wrapper is `<Link href={`/work/${caseStudySlug}`}>` instead of `<motion.button onClick={open modal}>`. Both branches share the inner card chrome. Modal logic only mounts for non-flagship cards.
- `CASE_STUDY_SLUGS` exported from `lib/case-studies/index.ts` and used at the call site to decide branch: `caseStudySlug={CASE_STUDY_SLUGS.has(p.id) ? p.id : undefined}`.

**Patterns to follow:**
- App Router `params: { slug: string }` conventions; `redirect()` from `next/navigation`.
- `app/components/Projects.tsx` `ProjectCard` props shape.

**Test scenarios:**
- *Happy path:* navigate to `/work/codeshot` → page renders the (eventually full) case study. (At end of Unit 5, slots are stubbed; Unit 6 fills behavior.)
- *Happy path:* navigate to `/work/foo` (unmapped) → server-side redirect to `/#work`. Verified via curl + Playwright MCP follow-redirect check. **Pre-implementation verification:** hash fragments may be stripped from server-side `Location` headers in some Next 14 builds. Before committing the slot system, run a one-line spike in a fresh route to confirm `redirect("/#work")` round-trips the fragment to the browser. If it does not, fall back to `redirect("/")` and accept that the user lands at the top of home instead of the Work section.
- *Happy path:* on `/`, click flagship project card → routes to `/work/[slug]`. Click non-flagship card → opens modal as before.
- *Edge case:* slug with special characters (`/work/foo%20bar`) → still redirects, doesn't 500.
- *Integration:* `generateStaticParams` returns three slugs at build time; `npm run build` produces three static `/work/[slug]` chunks.

**Verification:**
- `npm run build` succeeds; build output shows three static case study routes.
- Visual via Playwright MCP: home → click each of 3 flagship cards → URL changes to `/work/[slug]`. Click each of 2 non-flagship cards → modal opens.
- `/work/nonexistent` redirects to `/#work` and the home Projects section is in view.

---

- [ ] **Unit 6: Slot components — Hero, Narrative, ImageScrub, Video, Links**

**Goal:** Implement the five slot components. ImageScrub uses GSAP ScrollTrigger pin+scrub on fine pointers ≥600px viewport; falls back to Framer Motion `whileInView` scale-in otherwise. Other slots are presentational + Framer Motion `useInView` reveals.

**Requirements:** R7, R10, R11

**Dependencies:** Unit 5

**Files:**
- Create: `app/work/[slug]/slots/HeroSlot.tsx`
- Create: `app/work/[slug]/slots/NarrativeSlot.tsx`
- Create: `app/work/[slug]/slots/ImageScrubSlot.tsx`
- Create: `app/work/[slug]/slots/VideoSlot.tsx`
- Create: `app/work/[slug]/slots/LinksSlot.tsx`
- Create: `app/components/motion/ScrollTriggerCleanup.tsx`
- Modify: `app/work/[slug]/CaseStudy.tsx` (slot dispatch table, gsap context wrapper)
- Modify: `app/layout.tsx` (mount `<ScrollTriggerCleanup />` once at root; renders nothing, runs `usePathname` effect that kills all triggers on path change)
- Modify: `package.json` (add `gsap@^3.12`)

**Approach:**
- **HeroSlot:** typeset title using `<SplitText kind="char">`, eyebrow using `<SplitText kind="word">`, tags as static `<span>` chips, summary as a Framer Motion `useInView` body block.
- **NarrativeSlot:** maps `paragraphs[]` to `<p>` elements; each paragraph is a Framer Motion `useInView` reveal (8px y / 0→1 opacity / 600ms / `power2.out`). Once-per-element. Not pinned in v1.
- **ImageScrubSlot (the only GSAP consumer):**
  - Coarse pointer or `innerHeight < 600`: render `<Image>` with `whileInView` scale 0.92→1 transition. No ScrollTrigger.
  - Fine pointer + tall viewport: import `gsap` and `ScrollTrigger` via `next/dynamic({ ssr: false })`. On mount, `gsap.context(() => { ScrollTrigger.create({ trigger, start, end, pin: true, scrub: 0.5, ... }) }, ref)`. On unmount: `ctx.revert()`. Inside scrub, animate `image.scale 0.92 → 1` and overlay opacity.
  - **Pin-offset stability:** ScrollTrigger computes `start`/`end` in pixels at registration. Three sources of late layout shift will move the pin offsets after registration: (1) `next/image` lazy-loading the architecture image, (2) web fonts swapping above the trigger, (3) viewport resize. Mitigate all three: register the trigger only after `document.fonts.ready` resolves; pass `next/image`'s `onLoadingComplete` callback to call `ScrollTrigger.refresh()`; keep the existing 200ms-debounced `resize` handler.
  - Use `ScrollTrigger.refresh()` debounced 200ms on `resize`.
- **VideoSlot:** if `kind === "youtube"`, render `<iframe src="https://www.youtube-nocookie.com/embed/{videoId}?...">` lazy-loaded via `IntersectionObserver` (load `src` only when visible). If `kind === "mp4"`, render `<video preload="metadata" muted playsInline>` with `IntersectionObserver`-driven play/pause.
- **LinksSlot:** maps each link to a `<MagneticCTA>` wrapping `<Link>` or `<a>` with the appropriate icon.
- **ScrollTriggerCleanup:** client component, returns `null`. `useEffect` on `usePathname()` that on path change kills only triggers whose `trigger` element is no longer in the document (`!document.contains(t.trigger)`). This avoids a race where the new route's just-mounted triggers are killed alongside the old route's stale ones. **Critical:** the file MUST use `await import("gsap/ScrollTrigger")` *inside* the effect — never a top-level `import { ScrollTrigger } from "gsap/ScrollTrigger"`. A static import lands GSAP in the root layout chunk and breaks the `/` ≤50KB budget. Effect short-circuits via `if (!pathname.startsWith("/work/") && !previouslyOnWorkRoute) return` so home-to-home transitions don't pay the import cost. Per-component `ctx.revert()` remains the primary cleanup; this is a belt-and-braces guard for trigger-leak edge cases.

**Execution note:** Implement ImageScrubSlot last among the slots. It carries the highest implementation risk (Strict Mode interaction, refresh on resize, pin-spacer overflow). Land Hero/Narrative/Video/Links first, get the route rendering, then layer ImageScrub.

**Patterns to follow:**
- `app/components/NeuralGlyph.tsx` for `next/dynamic({ ssr: false })` pattern and `IntersectionObserver` cleanup.

**Test scenarios:**
- *Happy path Hero:* `/work/codeshot` first paint → title splits per character, animates in.
- *Happy path Narrative:* scroll narrative slot into view → paragraphs reveal staggered; second visit to same scroll position does not re-trigger (`once: true`).
- *Happy path ImageScrub (fine pointer, ≥600px viewport):* scroll past image → image scales 92→100% over the pin duration; pin releases at end; document continues scrolling normally.
- *Edge case ImageScrub (coarse pointer):* iPhone emulation → image renders, scales in once on intersect, no pin behavior.
- *Edge case ImageScrub (short viewport):* resize browser to 500px tall → no pinning; scale-in fallback runs.
- *Happy path Video (YouTube):* iframe `src` is empty until the slot enters viewport, then loads. Verified via Playwright MCP `mcp__playwright__browser_network_requests`.
- *Happy path Links:* each link is a magnetic CTA on fine pointer; tap target on coarse pointer.
- *Integration ScrollTriggerCleanup:* navigate `/` → `/work/codeshot` → `/`; after each step, log `ScrollTrigger.getAll().length` in console (DevTools), expect counts: 0 (on `/`), N (on `/work/codeshot`, where N = number of ImageScrub slots on that page), 0 (back on `/`).
- *Integration Strict Mode:* in dev mode, mount/unmount cycle does not duplicate ScrollTrigger instances. Verified by inspecting `ScrollTrigger.getAll().length` in dev console after first paint.
- *Error path:* malformed slot data (e.g., `imageScrub` with empty `src`) → slot is omitted at render time, not crashed. (TS narrowing should make this unreachable; safety net handler logs warning.)

**Verification:**
- All five slot types render content for `/work/codeshot`, `/work/switchconfigsim`, `/work/eduplanner` (with stub content from Unit 7).
- Bundle measurement: `npm run build` shows `/work/[slug]` First Load JS ≤ 60KB delta over `/`.
- Bundle measurement: `npm run build` shows `/` First Load JS ≤ 50KB delta over the prior baseline (Neural Glyph already shipped).
- ScrollTrigger leak check passes (counts above).

---

- [ ] **Unit 7: Three case study content modules + asset prep**

**Goal:** Author the three case study content modules (TS) and provide image-scrub assets. Pure content work — no new components. Joshua provides asset screenshots; this unit composes them and writes the narrative.

**Requirements:** R1

**Dependencies:** Unit 6

**Files:**
- Create: `lib/case-studies/codeshot.ts`
- Create: `lib/case-studies/switchconfigsim.ts`
- Create: `lib/case-studies/eduplanner.ts`
- Create: `public/case-studies/codeshot-architecture.png` (asset)
- Create: `public/case-studies/eduplanner-planner.png` (asset)
- Create: `public/case-studies/switchconfigsim-cli-rest.png` (asset)
- Modify: `lib/case-studies/index.ts` (register the three modules)

**Approach:**
- Each TS module exports a default `CaseStudy` object: hero slot (title, eyebrow with date+tags, summary), narrative slot (3–5 paragraphs of body copy), 1 image-scrub slot, optional video slot (only SwitchConfigSim has one), links slot.
- Hero summary lifted from `Projects.tsx` description for parity, expanded slightly for room.
- Narrative paragraphs are net-new writing (Joshua provides text or approves a draft).
- Asset images are produced by Joshua via screenshot + light retouch; placed in `public/case-studies/`. Plan-time deliverable; if not ready when Unit 7 starts, the image-scrub slot is omitted from that project's case study and added in a follow-up.

**Test scenarios:**
- *Test expectation: none — content data; correctness verified by visual review.*

**Verification:**
- Visual review of all three pages via Playwright MCP screenshots at three viewport sizes (mobile, tablet, desktop).
- Each page renders end-to-end without console errors.
- Each page contains at minimum: hero, narrative, links. SwitchConfigSim additionally has video. CodeShot and EduPlanner additionally have image-scrub if assets are ready.

---

- [ ] **Unit 8: Verification pass — ship gate**

**Goal:** Final verification before merge. Bundle size, leak check, visual pass on `/` + three case studies, identity check.

**Requirements:** R9, R10, R12

**Dependencies:** Unit 7

**Files:**
- Modify: none (verification only). Any fixes loop back to the relevant unit's files.

**Approach:**
- Run `npm run build` and capture `First Load JS` for `/` and `/work/[slug]`. Confirm `/` ≤ 50KB delta (target) / ≤ 80KB (hard cap), `/work/[slug]` ≤ 60KB.
- Run Lighthouse mobile + desktop on `/`, `/work/codeshot`, `/work/switchconfigsim`, `/work/eduplanner`. Confirm Performance ≥ 90, CLS ≤ 0.05.
- ScrollTrigger leak check: navigate `/ → /work/codeshot → / → /work/eduplanner → /` and verify `ScrollTrigger.getAll().length` returns to 0 after each return-to-home.
- Reduced-motion check: enable `prefers-reduced-motion: reduce` in DevTools, reload `/` and each case study, verify no motion fires (h1 jumps to end-state, image-scrub slots show static, magnetic CTAs do not move).
- Coarse-pointer check: iPhone emulation → no magnetic CTA translation, no scrub-pin (image-scrub slots scale-in via Framer Motion only).
- Identity check: cold-read description (Joshua self-test or trusted peer): does the site read as "calm/considered" rather than "very animated"? If not, identify the offending primitive and either tune or remove.
- Console: zero errors and zero warnings from Framer Motion, GSAP, or React across all four routes.

**Test scenarios:**
- *Test expectation: none — verification only. All test scenarios are owned by Units 1–7.*

**Verification:**
- All bundle, performance, leak-check, reduced-motion, and coarse-pointer thresholds pass.
- Identity check: passes (or, if fails, the failure is documented and the offending unit is iterated before merge).

---

## System-Wide Impact

- **Interaction graph:** Hero `<h1>` reveal pattern changes from Framer Motion `motion.h1` to SplitText. Hero CTAs gain magnetic behavior. TopNav gains a scroll-progress hairline child. Projects.tsx branches flagship slugs to `<Link>` (10 modals stay). Layout gains `<ScrollTriggerCleanup>` mount.
- **Error propagation:** Unmapped `/work/[slug]` redirects server-side; no client-side error path. Slot data is build-time-typed; malformed data is unreachable in TS but a runtime fallback in `CaseStudy.tsx` skips unknown slot types with a `console.warn`.
- **State lifecycle risks:** ScrollTrigger pin spacers leaking across route transitions. Mitigated by per-component `ctx.revert()` AND layout-level `ScrollTriggerCleanup`. Verified by leak check in Unit 8.
- **API surface parity:** No public API changes. `/work/[slug]` is net-new; `/` route shape is unchanged.
- **Integration coverage:** Cross-route ScrollTrigger cleanup is the integration scenario unit tests can't prove — verified manually via the Unit 8 leak check.
- **Unchanged invariants:** `app/components/Hero.tsx` text content is unchanged. Neural Glyph hero behavior unchanged. Existing `whileInView` reveals on Experience, Education, Contact unchanged. The 10 non-flagship project modals unchanged.

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| ScrollTrigger leaks across App Router soft navigations | `ctx.revert()` per component + layout-level `usePathname` effect killing all triggers; Unit 8 leak check. |
| Strict Mode double-mount in dev produces ghost pin-spacers | `gsap.context()` makes cleanup idempotent; verified in dev with leak count assertion. |
| Bundle delta on `/work/[slug]` exceeds 60KB | GSAP loaded only on case study route via `next/dynamic({ ssr: false })`; SplitText hand-rolled; Framer Motion already in bundle. Measured at Unit 8. Fallback: drop ImageScrubSlot's GSAP path and use Framer Motion `whileInView` scale-in for all viewports (loses scrub effect, removes ~45KB GSAP). |
| Identity drift — site reads as "very animated" | Identity check at Unit 8; specific tuning levers: shorten SplitText stagger, reduce magnetic radius, narrow image-scrub scale range. Last-resort: remove magnetic CTAs entirely. |
| Image-scrub jank on Mac trackpad momentum scroll | Tested at Unit 8 ship gate; if jank is observed on case study pages, file follow-up to evaluate Lenis (deferred per origin doc). |
| Asset gaps (CodeShot diagram, EduPlanner screenshot) block Unit 7 | Slots are optional in TS; missing image-scrub omitted at module level, follow-up issue tracks asset creation. |
| `next-themes` hydration mismatch on case study pages | Pages inherit root layout's `ThemeProvider` (verified — no separate provider); same `mounted` guard pattern in client components. |
| `scrollIntoView` smooth behavior regression after removing CSS rule | `smoothScrollTo` utility uses `window.scrollTo({ behavior: "smooth" })` which is independent of `html { scroll-behavior }`. Verified at Unit 1. |
| TopNav backdrop-blur occludes scroll progress hairline | Hairline rendered as last child of `<header>`, inheriting z-40 stacking — sits above the blur layer in the same compositing context. Verified at Unit 4. |

## Documentation / Operational Notes

- No production rollout concerns — static site deployed to Vercel; `npm run build` and deploy.
- No env vars added.
- No monitoring/alerting changes.
- Update `README.md` only if it currently lists a feature inventory and the inventory needs to mention case studies. Otherwise no docs change.
- Vercel build cache will pick up `gsap` automatically.

## Sources & References

- **Origin document:** `docs/brainstorms/2026-04-30-001-motion-pass-and-case-studies-requirements.md`
- Predecessor plan: `docs/plans/2026-04-21-001-feat-neural-glyph-hero-plan.md`
- Predecessor brainstorm: `docs/brainstorms/neural-glyph-hero-requirements.md`
- Related code: `app/components/NeuralGlyph.tsx`, `app/components/Projects.tsx`, `app/components/Hero.tsx`, `app/components/TopNav.tsx`, `app/globals.css`
- External: GSAP + React 18 official guidance (`gsap.context()` pattern); Next.js App Router redirect API.
