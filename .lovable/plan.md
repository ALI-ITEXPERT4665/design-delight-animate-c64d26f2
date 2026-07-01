# Invite Link System + Temp Owner Access

## Goal

Owner (and Admin, for admin/editor links only) can copy a single "always-fresh" invite link per role. Redeem it once → account created instantly (no email verify) → auto-logged in → link auto-rotates to a new token. Temp Owner is a special 2-hour explore session.

## Roles & Slots

Owner dashboard shows **3 invite slots** (each = one active link, single-use, auto-rotating):


| Slot              | Who can create | Role granted            | Session length | On expiry                                                |
| ----------------- | -------------- | ----------------------- | -------------- | -------------------------------------------------------- |
| Admin invite      | Owner,         | `admin`                 | Permanent      | —                                                        |
| Editor invite     | Owner, Admin   | `editor`                | Permanent      | —                                                        |
| Temp Owner invite | Owner only     | `owner` (non-protected) | **2 hours**    | Force sign-out + delete auth user + delete profile/roles |


Temp Owner has full owner UI access **except** protected actions (cannot suspend/delete/demote the protected owner accounts, cannot create new permanent owners, cannot generate new Temp Owner links). Enforced by `is_protected` flag already on profiles + new `is_temp` flag.

## Flow

1. Owner opens `/admin/invites` → sees 3 cards, each with "Copy link" button showing `https://uppaldb.site/invite/{token}`.
2. Recipient opens link → `/invite/$token` route validates token server-side.
3. Page shows: *"Owner sent you an invite to join as {role}. Create your account."* — email + password form.
4. On submit: server fn creates auth user with `auto_confirm: true` (invite flow bypass), assigns role, marks `is_temp=true` + `temp_expires_at` if temp-owner, marks token `redeemed_at`, auto-generates new token for that slot, signs the user in.
5. Duplicate email → *"Account already exists — sign in or reset password."*

## Temp Owner expiry

- Cron server route `/api/public/cron/expire-temp-owners` (called every 5 min by pg_cron using stable URL) finds `profiles` where `is_temp=true AND temp_expires_at < now()`, revokes sessions via admin API, deletes auth user (cascades roles/profile).
- Client-side: temp owner session includes `temp_expires_at`; a hook checks every 30s; when expired → force sign-out + toast.

## Database (migration)

```
invite_links (slot enum: admin|editor|temp_owner UNIQUE, token text UNIQUE, created_by uuid,
              created_at, redeemed_at, redeemed_by uuid)
-- Only one active row per slot (redeemed_at IS NULL). On redeem, insert new row.

profiles: add is_temp bool default false, temp_expires_at timestamptz
```

RLS: owner/admin can SELECT invite_links; anon can SELECT a single row by token via SECURITY DEFINER RPC `get_invite_by_token(token)` returning only `{slot, valid}`.

## Files to add/change

- `supabase/migrations/*` — schema above + RPCs `redeem_invite(token, email, password)` (calls admin API through server fn, not SQL), `rotate_invite_slot(slot)`.
- `src/lib/invites.functions.ts` — `listInviteSlots`, `rotateInvite`, `redeemInvite`, `getInviteMeta`.
- `src/routes/_authenticated/admin/invites.tsx` — 3-card UI with copy buttons + rotate + last-redeemed audit.
- `src/routes/invite.$token.tsx` — public redemption page.
- `src/routes/api/public/cron/expire-temp-owners.ts` — cleanup route (HMAC-verified via `CRON_SECRET`).
- Admin sidebar: add "Invite Links" entry (visible to owner + admin; Temp Owner card owner-only).
- Guard existing owner-only pages so `is_temp=true` users cannot hit protected actions.

## Security

- Tokens: 32-byte base64url, single-use, auto-rotated on redeem.
- Invite creation gated by `has_role(auth.uid(),'owner')` (or admin for admin/editor slots).
- Email verification stays ON globally; invite redemption path uses admin API `auto_confirm: true`.
- Protected owner accounts (`m.alinadeem4665@…`, `pitbwebdev@…`) remain untouchable by temp owner.

## Out of scope

Zero visual changes to the public site. Only admin panel gets new "Invite Links" page + the public `/invite/$token` form (styled to match existing auth page).

After you approve, I'll run the migration first, then wire the server fns and pages.