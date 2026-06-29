## Plan

### What I will build
- Recreate the full prototype as a multi-page TanStack site matching your pasted design screenshots as closely as possible:
  - Home
  - About
  - Services
  - Projects
  - Project detail
  - Process
  - Blog
  - Contact
  - Team
- Keep the pasted design as the visual source of truth for layout, spacing, hierarchy, sections, card counts, and overall composition.
- Use the original website only to extract and adapt real business content where useful.
- Use the benchmark sites only to inform motion quality, hover behavior, and performant video treatment.

### Content and design rules I will follow
- No redesigning the structure.
- No extra sections, guessed layouts, or invented page compositions.
- Use your pasted PNG designs as the exact page references.
- Remove the visible Ali watermark from the implementation by rebuilding the UI rather than embedding the screenshots.
- Keep the same premium architecture look: light palette, warm gold accent, refined minimal typography, large property visuals, and soft luxury presentation.

### Motion and video approach
- Add subtle, premium interactions inspired by the benchmark sites:
  - image hover lift / zoom
  - card hover elevation
  - button hover motion
  - soft section reveals
  - tasteful nav and CTA transitions
- Introduce new, matched architecture video only where it fits the pasted design layout without changing the composition.
- Prioritize performance:
  - compressed video assets
  - lazy loading for below-the-fold media
  - preload only the main hero media
  - avoid heavy always-on effects
- Keep motion restrained and elegant rather than flashy.

### Data/content sourcing
- Pull real business wording, services, contact details, and project-related references from the original site where usable.
- Keep placeholders only where the original site lacks clean usable source content.
- Normalize and polish extracted copy so it reads consistently across pages while still staying grounded in the real source.

### Implementation steps
1. Establish shared site shell and global tokens to match the pasted design.
2. Build reusable header, footer, buttons, section wrappers, cards, metrics, and media blocks from the screenshot references.
3. Create route files for all required pages and reproduce each screenshot composition faithfully.
4. Add optimized image/video assets and hook them into the exact hero/media areas that exist in the pasted designs.
5. Apply hover states and lightweight entrance animations inspired by the benchmark sites.
6. Add route-specific metadata and polish responsive behavior while preserving the desktop design language.
7. Verify preview quality across the main pages and ensure the placeholder starter page is fully replaced.

### Technical details
- Stack: TanStack Start + React + Tailwind v4
- Routing: separate route files for each page under `src/routes/`
- Assets: optimized local/CDN-backed assets for images and videos
- SEO: route-specific title/description/Open Graph text on each page
- Performance: semantic HTML, lazy media, restrained animation, no unnecessary client-heavy effects

### Output of this prototype phase
- A working front-end prototype of all pages
- Strictly based on your pasted design set
- Enriched with real audited content from the original site
- Enhanced with benchmark-inspired hover/motion and matched architecture video