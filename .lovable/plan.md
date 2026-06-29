## Unified Header + Site-Wide Video Backgrounds

### 1. New unique header (locked, identical on every page)

Replace current `SiteHeader` in `src/components/site-shell.tsx` with a single premium header:

- **Transparent over hero** when at top, **frosted glass + shrink** (`backdrop-blur-xl`, height 96→64px, border-bottom appears) once scrolled >40px — tracked via scroll listener with `requestAnimationFrame`.
- **Wordmark left**: UPPAL with thin "DESIGN" / "DECOR" subline (kept per-route).
- **Nav center**: each link wrapped in a span with a gold underline that wipes in left→right on hover (`scaleX 0→1`, `transform-origin` swap on leave for the Hermès-style reverse-out).
- **Right cluster**: phone number + "Menu" button with two-line icon that morphs to X.
- **Side-drawer mega-menu** (right slide-in, 480px wide, dark): full nav list with large typography + 4 featured project thumbnails on the right half + contact block at bottom. Opens via Menu button; closes on ESC, route change, backdrop click. Body scroll locked while open. Staggered fade-up on links.
- **Active route**: gold dot before the active link.
- Mobile: drawer becomes full-screen, nav stacks.

### 2. Free architecture background videos (sourced from internet AND FROM USER UPLOADED FILES THAT HE WILL UPLOAD)

I'll fetch CC0/free-license architecture clips from Coverr/Pexels-style free CDNs (no Envato), upload via `lovable-assets`, and wire one per page:

- Home hero, About hero, Projects hero, Services hero, Process hero, Contact hero, Blog hero, Project-Detail hero, plus one shared CTA-band loop = ~8–9 clips total, 720p, ≤4MB each, muted/looping.
- Each is paired with a still poster (extracted first frame) so first paint stays instant.
- Existing `BackgroundVideo` (parallax + ken-burns zoom + `IntersectionObserver` pause + reduced-motion fallback) is reused —

### 3. "Unbelievable but professional" motion layer (no AI-cartoon look)

Subtle, editorial-grade only:

- **Page-enter curtain**: thin gold line wipes across viewport on route change (200ms), content fades up underneath.
- **Hero text reveal**: per-word mask reveal on first paint (translateY 100% → 0, 40ms stagger).
- **Scroll-reveal** (`.reveal-up`) already exists — applied to every section heading.
- **Magnetic CTA buttons**: primary buttons gently track cursor within 40px radius on hover.
- **Project tiles**: image zooms 1.08, title slides up, gold underline draws under category label, FEATURED ribbon glows.
- **Cursor-follow spotlight** on dark CTA bands (radial gradient that tracks mouse).
- **Number counters** count up on first scroll into view (stats band).
- All respect `prefers-reduced-motion`.

### 4. Per-page wiring

Every route's hero gets its dedicated `videoSrc`. The About CTA band, Contact hero, and Project-Detail hero get full-bleed video. No layout changes to any page already approved — only header swap + video assignment + motion polish.

### Files touched

- `src/components/site-shell.tsx` — replace `SiteHeader`, add `MegaDrawer`, magnetic-button hook, page-curtain wrapper
- `src/components/background-video.tsx` — already good, no changes
- `src/lib/site-data.ts` — add `pageVideos` map
- `src/routes/__root.tsx` — mount page-curtain + lock new header
- `src/routes/*.tsx` (8 files) — pass `videoSrc` prop to each hero
- `src/styles.css` — keyframes for curtain, underline wipe, word-mask reveal
- `src/assets/*.mp4.asset.json` — 8–9 new video pointers (uploaded via `lovable-assets`)

### Out of scope

- No layout restructuring of approved pages (Home, About, etc.)
- No Envato/Toffu sourcing — strictly free architecture stock
- No new pages  ,,WAIT FOR MY UPLOADS FILES CHOOSE BEST FOR THTA SECTION AND USE IT 