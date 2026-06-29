
# Admin Panel + Full Site CMS

Build a complete, auth-gated admin panel that lets non-developers edit every text, image, and video on the public site. Roles: **owner** (immutable), **admin** (full access, can be suspended/removed), **editor** (drafts only → approval → publish). All powered by Lovable Cloud (Supabase: Postgres + Auth + Storage).

## 1. Enable Lovable Cloud
Required for DB, auth, storage. Triggered first.

## 2. Database schema (migration)

- `app_role` enum: `owner | admin | editor`
- `user_roles(user_id, role)` — separate table, RLS-safe, `has_role()` SECURITY DEFINER fn
- `profiles(id, email, full_name, avatar_url, status: active|suspended, created_at)`
- `site_content(key text PK, value jsonb, updated_at, updated_by)` — the **live published** content store. One row per content key (e.g. `home.hero.title`, `services.list`, `footer.address`).
- `content_drafts(id, key, value jsonb, status: pending|approved|rejected, created_by, reviewed_by, reviewer_note, created_at, reviewed_at)` — editor submissions.
- `media_assets(id, kind: image|video, storage_path, public_url, alt, size, mime, uploaded_by, created_at)` — registry of every uploaded file (linked from `site_content`).
- `invitations(id, email, role, token, invited_by, expires_at, accepted_at)` — invite-by-email flow.
- `audit_logs(id, actor_id, action, entity, entity_id, diff jsonb, ip, ua, created_at)` — every meaningful action.
- Storage buckets: `site-images` (public, 10MB cap, image/*), `site-videos` (public, 100MB cap, video/*).

**Owner protection**: DB trigger blocks `DELETE`/role-change/`status='suspended'` on the seeded owner row. Trigger also prevents anyone from inserting a second `owner` role.

**RLS**:
- `site_content`: public `SELECT` (so site renders); writes restricted to admin/owner via `has_role()`.
- `content_drafts`: editor can insert/select own rows; admin/owner can select/update all.
- `audit_logs`: admin/owner select only; inserts via SECURITY DEFINER fns.
- `profiles`/`user_roles`/`invitations`: admin/owner manage; users read own profile.

**Grants** added per public-schema-grants rules.

## 3. Owner seed (idempotent)
Migration calls a SECURITY DEFINER function that:
- Creates auth user `m.alinadeem4665@gmail.com` / `alitesting@123` via `auth.admin` (email auto-confirmed) if missing.
- Inserts profile + `owner` role row.
- No-op on re-run.

## 4. Content layer — zero-code-change editing

Replace the hardcoded `src/lib/site-data.ts` exports with a **runtime content provider**:

- New `src/lib/content.ts`: `getContent(key, fallback)` reads from a React context populated by a single SSR loader that pulls all `site_content` rows.
- Defaults seeded from current `site-data.ts` so site keeps rendering immediately after migration.
- Every page section (`HeroSection`, `ServicesGrid`, `ProcessTimeline`, `FounderQuoteBand`, `SiteFooter`, etc.) reads via `getContent('home.hero.title', '…')` — no layout/visual change.
- Images/videos: components consume URLs from `site_content` (which point to `media_assets.public_url`), with the current bundled assets as fallbacks.

Result: changing any row in `site_content` updates the live site instantly with no redeploy.

## 5. Admin panel routes (`/_authenticated/admin/*`)

Premium dark-glass UI matching site aesthetic (gold accent, frosted panels, framer-motion).

- `/auth` — public sign-in (email/password) + accept-invite via token.
- `/admin` — dashboard: pending approvals count, recent activity, role-scoped quick actions.
- `/admin/content` — tree of editable sections grouped by page (Home, About, Services, Process, Projects, Blog, Contact, Footer, Global). Inline editors: text, rich-text (textarea), list editor (add/remove/reorder), image picker, video picker. Live preview pane.
- `/admin/media` — upload, browse, replace, delete images/videos. Drag-drop, progress, validation (10MB/100MB).
- `/admin/approvals` — admin/owner only. Diff view of pending drafts (old vs new), approve/reject with note. Approve = atomic update of `site_content` + audit log.
- `/admin/users` — admin/owner: list users, change role, suspend/remove (owner row locked). Editors can't access.
- `/admin/invites` — send email invite with role; pending list; revoke; resend.
- `/admin/logs` — paginated, filterable audit log (actor, action, entity, date range).
- `/admin/settings` — owner only: site-wide flags.

**Editor UX**: same forms as admin, but `Save` writes to `content_drafts (status='pending')` and shows "Submitted for approval". A "My Drafts" tab shows status of own submissions.

## 6. Server functions (TanStack `createServerFn`)
All mutations server-side with `requireSupabaseAuth` + role checks:
- `updateContent` (admin/owner): write `site_content` + audit log.
- `submitDraft` (editor): insert `content_drafts`.
- `reviewDraft` (admin/owner): approve → apply to `site_content`; reject → mark with note.
- `uploadMedia` (signed upload URL flow): register in `media_assets`.
- `inviteUser`, `acceptInvite`, `setUserRole`, `suspendUser`, `removeUser` (owner-immutable guard).
- `listAuditLogs` with filters.
- All log to `audit_logs`.

## 7. Header integration
Tiny "Admin" link appears in header only when signed-in user has any role. Public site otherwise unchanged.

## 8. Out of scope (to keep this shippable)
- Real-time multi-editor collaboration.
- Versioning beyond drafts + audit diffs.
- 2FA (can be added later via Supabase MFA).
- Email delivery for invites uses Supabase magic-link/invite email (default templates).

## Technical notes
- TanStack Start patterns: `_authenticated` managed gate for `/admin/*`; public route loaders only call public server fns; `supabaseAdmin` (for auth.admin / role grants) loaded inside handler bodies via `await import('@/integrations/supabase/client.server')` after role check.
- Input validation with Zod on every server fn.
- Owner credential is seeded once via migration; user is told to change password on first login.

Confirm to proceed — this is a large multi-file build; I'll implement it in one batch once approved.
