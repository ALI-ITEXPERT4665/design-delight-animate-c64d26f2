## Plan: Premium hero video + Hermès-style hover system

### 1. Hero background video (design-matched)
- Wire the existing `src/assets/hero-video.mp4` asset into `HeroSection` (and any secondary page hero blocks) as a true full-bleed background layer behind the headline/CTAs — preserving the pasted PNG layout exactly (no composition changes).
- Stack order: `video` → dark gradient scrim → content. Scrim uses `linear-gradient(180deg, rgba(0,0,0,.15), rgba(0,0,0,.55))` so headline + gold accent stay legible.
- Performance attributes: `autoPlay muted loop playsInline preload="metadata" poster={firstFrameImg}` + `disableRemotePlayback`. 
- Lazy-load: use `IntersectionObserver` to only call `.play()` when the hero is ≥25% in view; pause when offscreen. Respect `prefers-reduced-motion` → show poster only.
- Mobile fallback: under `md`, render the poster image instead of the MP4 to save bandwidth.
- Add subtle Ken-Burns drift (`@keyframes heroDrift` scale 1 → 1.06 over 18s) for cinematic feel without re-encoding.
- Add a second short looping clip behind the About / Projects intro band where the design shows a media strip — same component, reused.

### 2. Hermès-style hover system (sitewide)
Add a reusable set of motion utilities in `src/styles.css` and apply them across the rebuilt components. None of these change layout — only motion.

- **Image cards (`.media-hover`)**: image scales `1 → 1.06` over 700ms cubic-bezier(.22,1,.36,1); gold overlay fades 0 → 0.18; caption slides up 8px and reveals a thin underline.
- **Project tiles (`.project-tile`)**: on hover, title shifts up, a small "View project →" line fades in, arrow translates 4px on repeat hover.
- **Buttons (`.btn-sheen`)**: gold sheen sweep (pseudo-element gradient translating across) + 1px lift; primary CTA also animates underline.
- **Nav links (`.story-link` extended)**: already present — extend with a small dot indicator and slower easing to match Hermès feel.
- **Service rows (`.row-reveal`)**: hover reveals chevron + faint bg tint `oklch(from var(--primary) l c h / 0.06)`.
- **Stat counters**: on first viewport entry, animate number from 0 → target with `requestAnimationFrame` (one-shot, not hover).
- **Section reveals (`.reveal-up`)**: IntersectionObserver toggles class → opacity 0→1, translateY 24→0, 700ms ease-out, staggered via `--i` CSS var.
- **Cursor affordance**: large media areas get `cursor: pointer` + a custom `.cursor-zoom` hint (small circular badge that follows cursor via CSS-only `:has` + transform — kept lightweight, desktop only).
- **Marquee strip** (if present in design): infinite horizontal scroll for client/awards row using pure CSS keyframes, pauses on hover.

### 3. Files touched
- `src/components/site-shell.tsx` — update `HeroSection` to render `<BackgroundVideo>`; add the new `BackgroundVideo` component; apply hover utility classes to `ProjectsShowcase`, `ServicesGrid`, footer media, related projects band.
- `src/styles.css` — add `@utility` blocks: `media-hover`, `project-tile`, `btn-sheen`, `row-reveal`, `reveal-up`, `cursor-zoom`, `marquee`; add `@keyframes heroDrift`, `sheen`, `marquee`.
- `src/hooks/use-in-view.ts` (new) — small IntersectionObserver hook used by video autoplay gate, reveal-up, and stat counters.
- `src/components/background-video.tsx` (new) — encapsulates lazy/poster/reduced-motion logic.
- Poster: extract first frame of `hero-video.mp4` with ffmpeg to `src/assets/hero-poster.jpg` and upload via `lovable-assets`.

### 4. Performance guardrails
- Single `<video>` per page max; secondary heroes reuse poster image until in view.
- `preload="metadata"` not `auto`; no `<source>` duplication.
- `prefers-reduced-motion: reduce` disables Ken-Burns, sheen, marquee, and video autoplay.
- All hover transforms use `transform`/`opacity` only (GPU-friendly, no layout thrash).
- No new dependencies.

### 5. Verification
- Run dev build, open `/`, `/about`, `/projects`, `/services` via Playwright headless: screenshot hero (poster + playing frame), hover a project card, hover a CTA — confirm transforms fire and layout is unchanged vs. pasted PNG.
- Check console for autoplay errors; confirm video pauses when scrolled out.
