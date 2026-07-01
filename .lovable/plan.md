## Auth Overhaul Plan

### 1. Fix core auth errors

- **"Failed to fetch"**: caused by Lovable Preview's fetch proxy on Supabase POST. Add clear messaging that sign-in must be tested on published URL; add retry + better error surfacing in `src/routes/auth.tsx`.
- **"Email not confirmed"**: turn ON email confirmation properly (currently half-configured). Signups will send verification mail; sign-in blocks until confirmed with a clear "Resend verification" button.
- **Race condition**: wrap session hydration with `getSession()` → `onAuthStateChange` pattern in `useSession` so RLS queries don't fire before auth is ready.

### 2. Persistent 24h login (cookies)

- Configure Supabase client with `persistSession: true`, `autoRefreshToken: true`, `storage: localStorage` (already default) + set session cookie mirror so refresh keeps user logged in ≥ 24h.
- Verify no aggressive `signOut()` calls on route changes.

### 3. Signup → Owner approval workflow

- New `signup_requests` table: `email`, `password_hash` (temp), `requested_role`, `status` (pending/approved/rejected), `created_at`.
- Signup form no longer creates auth user directly. Instead inserts a pending request + emails owner (`m.alinadeem4665@gmail.com`) with approve/reject links.
- New `/admin/approvals` tab lists pending requests. On approve: server fn creates the auth user via `supabaseAdmin.auth.admin.createUser` (email_confirm: true), assigns role, deletes request, emails user "you're approved, sign in".
- On reject: delete request + email user.
- Duplicate check: if email already exists in `auth.users` or `signup_requests`, return **"Account already created — use your password or Forgot Password"**.

### 4. Forgot password flow

- Add "Forgot password?" link on `/auth`.
- Calls `supabase.auth.resetPasswordForEmail(email, { redirectTo: origin + '/reset-password' })`.
- New public `/reset-password` route: reads recovery token from hash, calls `supabase.auth.updateUser({ password })`.

### 5. Email verification (one-time)

- Enable email confirmations in Supabase auth config.
- Custom branded auth email templates via `scaffold_auth_email_templates` (signup confirm + recovery only).
- After first confirm, user never sees verification again.

### 6. Second admin account

- Seed `pitbwebdev@gmail.com` with password `talha@123`, role `admin`, `email_confirm: true`, marked non-protected.
- Extend `ensureOwnerSeed` server fn to also create this admin idempotently.

### 7. Admin UI additions

- `/admin/approvals` page: pending signup requests table with Approve / Reject buttons + role selector.
- Owner-only guard.

---

### Technical bits (for reference)

- Migration: `signup_requests` table + GRANTs + RLS (only owner/admin can read/update; anon can INSERT own request).
- Server fns in `src/lib/admin/signup-requests.functions.ts`: `submitSignupRequest`, `listSignupRequests`, `approveSignupRequest`, `rejectSignupRequest`.
- Email: use existing Lovable email infra + `scaffold_auth_email_templates`; approval notifications via `enqueue_email` into `transactional_emails`.
- `src/routes/auth.tsx`: refactor to 3 modes (signin / request-access / forgot), better error handling, "Resend confirmation" action.
- Add `src/routes/reset-password.tsx` (public, ssr:false).
- `AdminShell.tsx`: add "Approvals" nav item with pending-count badge.

### Confirmation before I build

1. Should signup requests store the user's chosen password (encrypted) so they log in immediately after approval, OR should approval trigger an invite email where they set their own password? **Ans :invite email —then they choose their password again so flow will be after owner approval =email confirmation= pass choose link and save that pass and etc**
2. `pitbwebdev@gmail.com` — confirm role should be **temporary owner main owner will not be replaced but the temporary owner can be r|moved suspend etc but temporary also have all owners rights like ai chatbot page and etc**
3. OK to enable email confirmation site-wide now  but existing unconfirmed users not need to confirm on next login