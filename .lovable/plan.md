## Goal
Make ~100% of the public site editable from /admin without changing any visual design. Today the public pages read from hardcoded `src/lib/site-data.ts`, so the admin "content editor" doesn't actually drive the site. This plan wires every page section into `site_content` and adds full collection editors for every list (projects, blog, services, FAQs, testimonials, team, process steps, stats, values, nav, footer, settings).

## Approach

### 1. Single source of truth: `site_content`
- Seed `site_content` (via migration) with one row per editable key, defaulting to the current values from `site-data.ts`. Nothing visual changes on day one.
- Keys are namespaced: `settings.*`, `nav.items`, `home.hero.*`, `home.stats`, `home.intro.*`, `about.*`, `services.*`, `process.steps`, `projects.items`, `projects.hero.*`, `blog.items`, `blog.hero.*`, `contact.*`, `footer.*`, `faqs.items`, `testimonials.items`, `team.leads`, `team.members`, plus per-section media (`*.video`, `*.image`).

### 2. Public site reads from `site_content`
- Root loader calls `getAllSiteContent()` once and seeds React Query cache (`["site","content"]`).
- New hook `useContent(key, fallback)` reads from that cache; every section in `site-shell.tsx` swaps hardcoded `site-data` imports for `useContent("…", fallbackFromSiteData)`.
- `site-data.ts` becomes the fallback/seed only — visuals identical if DB is empty.

### 3. Admin editor coverage (every section, every page)
Rebuild `/admin/content` as a page-tree editor instead of a flat key list:

```text
Pages
├── Global
│   ├── Site settings (name, tagline, email, phone, address)
│   ├── Navigation (label, href, order)
│   └── Footer (columns, links, brand tagline, video)
├── Home (hero text/video/cta, intro, stats, featured projects ref)
├── About (hero, story, mission, values, founder, metrics)
├── Services (hero, items, why-choose-us, cta)
├── Process (hero, 5 steps, principles, value grid, faqs)
├── Projects (hero, list, categories)
├── Project detail template (specs, gallery captions)
├── Blog (hero, featured, list, topics)
├── Contact (hero, address, email, phone, map, faqs)
└── Collections
    ├── Projects   ├── Blog posts   ├── Services
    ├── FAQs       ├── Testimonials ├── Team leads / members
    ├── Process steps             └── Stats / Values
```

Each section card: inline text inputs, textareas, image/video pickers (Media Library), Publish (staff) / Submit for approval (editor), draft status badge.

### 4. Collections — full CRUD for every list
Extend `SCHEMAS` in `/admin/collections` to include:
- projects (+ gallery array, highlights, challenge/solution)
- blog (+ content/body)
- services, faqs, testimonials (new), team-leads (new), team-members (new), process-steps (new), stats (new), values (new)
Each supports add/remove/reorder, media preview, Publish/Submit-for-approval.

### 5. Live Preview already shows the changes
Because the public site now reads from `site_content`, the existing `/admin/preview` iframe will reflect published edits without further work.

### 6. QA pass (the "test 206 times" ask)
- Script a checklist that opens every page, lists every editable key it touched, and confirms the rendered text/image/video matches the DB row.
- Build + run a Playwright sweep against `/`, `/about`, `/services`, `/process`, `/projects`, `/blog`, `/contact`, `/project-detail`, `/team` after seeding to confirm no visual regressions.

## Technical Notes
- Migration only seeds rows that don't already exist (`ON CONFLICT DO NOTHING`).
- No schema changes — `site_content` already exists with `key`/`value JSONB`.
- Public reads use the existing publishable-key server fn `getAllSiteContent` (already public).
- No design tokens or layout changes — only data wiring.
- The chatbot, header, and footer are global so they're edited under "Global".

## Out of Scope
- No new pages, no design changes, no copy rewrites.
- No multi-locale / versioning beyond existing drafts+approvals flow.
- No per-field permissioning beyond current owner/admin/editor roles.

## Deliverable
After this, opening `/admin` lets you edit literally every visible string, image, and video on every page (Home, About, Services, Process, Projects, Project Detail, Blog, Contact, Team, Footer, Header, Chatbot greeting) and manage every list (projects, blog, services, FAQs, testimonials, team, process steps, stats, values).
