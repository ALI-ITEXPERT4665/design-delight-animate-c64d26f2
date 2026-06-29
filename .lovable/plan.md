## Strict design alignment pass

The current build deviates from the pasted PNGs in several visible ways. This plan fixes only those gaps — no new pages, no new business logic.

### Gaps found (audited via Playwright screenshots of `/`, `/projects`, `/services`, `/about`, `/process`, `/blog`, `/contact`, `/team`, `/project-detail`)

1. **Hero & section imagery is wrong.** Current site uses harvested heimarchitecture *blueprint/sketch* renders. The design uses photorealistic curved-white modern architecture (same building reused across hero of every page). Project tiles also show sketches instead of photo renders (Modern Family House, London Business Hub, Cambridge University, Luxury Hotel & Spa, Birmingham Apartments, Reading Office Complex, Private Villa, Mixed Use Development).
2. **Logo wordmark inconsistency.** Designs alternate between "UPPAL DESIGN" (home, about, team, process, blog, contact) and "UPPAL DECOR" (projects, services, project-detail). Match the per-page wordmark exactly.
3. **Process step icons are all identical** (sparkle). Design uses 5 distinct line icons: concept (nodes), planning (document), visualization (cube/atom), documentation (drawing), construction (helmet/person).
4. **Project category filter pills lack the small icons** shown in the design (home, building, book, bed, apartments).
5. **Featured project cards** are missing the "FEATURED" gold ribbon overlay on the image bottom-left.
6. **About-page collage** uses blueprint sketches; design uses 3 overlapping photo tiles (London skyline + glass tower + curved modern building) with a floating "15+ YEARS OF EXPERIENCE" card.
7. **Stats row on home** renders with award icons on every stat; design uses 5 distinct icons (building, badge, heart-badge, trophy, people).
8. **Team page leadership row** — current leadership tiles use placeholder avatars; design needs square portrait tiles with name + role under each.
9. **Footers differ per page in the design** (Home/About/Team use 4-col with social icons; Services/Projects/Contact use 5-col with newsletter; Blog uses centered minimal). Current site uses one footer everywhere.
10. **Contact page office cards** missing the studio photo and two address blocks (Head Office + Studio Office) with hours.
11. **Project-detail page** missing: signature graphic, project meta strip (6 columns), 4 design-highlight cards, challenge/solution split with arrow, related projects strip, footer with newsletter mini.
12. **Blog page** missing: featured article hero card, topic grid (6 icon tiles), recent insights row, newsletter strip.

### Approach

- **Replace imagery**: regenerate photorealistic architecture images via `imagegen` (premium not needed) for: 1 hero building (reused on every page hero per the design), 8 project photos (matching project titles + locations), 1 interior living-room (services page), 2 interiors (project-detail), 1 office studio (contact), 4 blog covers, 5 process-stage photos, 1 founder portrait (about quote block), 10 team headshots (team page) + 4 leadership portraits. Swap into `siteData` and section components — no layout changes.
- **Replace process icons** with `lucide-react`: `Lightbulb`, `FileText`, `Box`, `ClipboardList`, `HardHat` (mapped to stages 01–05). Apply both on Home and `/process`.
- **Replace stat icons**: `Building2`, `Award`, `HeartHandshake`, `Trophy`, `Users`.
- **Add category-pill icons** on `/projects`: `Grid3x3`, `Home`, `Building`, `BookOpen`, `BedDouble`, `Building2`.
- **Add FEATURED ribbon** to featured cards (absolute bottom-left gold badge).
- **Per-page wordmark**: pass `variant="design" | "decor"` prop to `SiteHeader` and switch the small subtitle text.
- **About collage**: 3 stacked image tiles with `15+ YEARS` floating card — pure CSS positions, reuse `media-hover`.
- **Per-page footers**: add `<SiteFooter variant="four-col" | "five-col-newsletter" | "centered-minimal" />` and select per route.
- **Contact offices**: studio photo + two address blocks with hours.
- **Project-detail**: build the missing blocks (signature SVG line art, 6-col meta strip, 4 highlight cards using `lucide` icons, challenge/solution with circular arrow, related projects row, mini-newsletter footer).
- **Blog page**: featured hero card, 6-icon topic grid, recent insights row, newsletter strip.
- **Keep all current motion** (hero video, sheen, reveal-up, lift-card, project-tile, media-hover) intact.

### Files touched (no new routes)

- `src/lib/site-data.ts` — swap asset imports to new photoreal images; add per-stage icon keys; add per-page footer variant.
- `src/components/site-shell.tsx` — header variant prop; stat/process/category icon maps; FEATURED ribbon; about collage; contact office cards; project-detail rebuild; blog rebuild; footer variants.
- `src/assets/*` — new `lovable-assets` pointers for the regenerated images (replacing the heimarchitecture-derived ones).

### Verification

Re-run the Playwright screenshot pass on all 9 routes and visually diff each against the matching PNG. The pass succeeds when every page's overall composition, image style, icon set, and footer variant matches the design.
