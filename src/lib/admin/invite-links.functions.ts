import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { logAudit } from "./audit.server";

type Slot = "admin" | "editor" | "temp_owner";
const TEMP_OWNER_MS = 2 * 60 * 60 * 1000; // 2 hours

function randomToken() {
  const a = new Uint8Array(24);
  crypto.getRandomValues(a);
  return Array.from(a).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function getCallerRoles(supabase: any, userId: string) {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  return (data ?? []).map((r: any) => r.role) as string[];
}

async function getCallerProfile(supabase: any, userId: string) {
  const { data } = await supabase.from("profiles").select("id,is_temp,is_protected,email").eq("id", userId).maybeSingle();
  return data;
}

/** List active invite slots. Owner sees all 3; admin sees admin+editor. */
export const listInviteSlots = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context as any;
    const roles = await getCallerRoles(supabase, userId);
    const profile = await getCallerProfile(supabase, userId);
    const isOwner = roles.includes("owner");
    const isAdmin = isOwner || roles.includes("admin");
    if (!isAdmin) throw new Error("Forbidden");
    // Temp owner cannot manage invite links at all
    if (profile?.is_temp) throw new Error("Temporary owners cannot manage invite links");

    const allowed: Slot[] = isOwner ? ["admin", "editor", "temp_owner"] : ["admin", "editor"];
    const { data, error } = await supabase
      .from("invite_links")
      .select("id,slot,token,created_at,redeemed_at,redeemed_email")
      .in("slot", allowed)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    const active: Record<string, any> = {};
    const history: Record<string, any[]> = {};
    for (const s of allowed) history[s] = [];
    for (const row of data ?? []) {
      if (row.redeemed_at === null && !active[row.slot]) active[row.slot] = row;
      else history[row.slot]?.push(row);
    }
    return { active, history, isOwner };
  });

/** Manually rotate a slot (invalidate current active token, mint a new one). */
export const rotateInviteSlot = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ slot: z.enum(["admin", "editor", "temp_owner"]) }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const roles = await getCallerRoles(supabase, userId);
    const profile = await getCallerProfile(supabase, userId);
    const isOwner = roles.includes("owner");
    const isAdmin = isOwner || roles.includes("admin");
    if (!isAdmin) throw new Error("Forbidden");
    if (profile?.is_temp) throw new Error("Temporary owners cannot rotate invite links");
    if (data.slot === "temp_owner" && !isOwner) throw new Error("Only the owner can manage the Temp Owner slot");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = supabaseAdmin as any;
    // Mark current active as revoked
    await admin.from("invite_links")
      .update({ redeemed_at: new Date().toISOString(), redeemed_email: "(revoked)" })
      .eq("slot", data.slot).is("redeemed_at", null);
    const token = randomToken();
    const { data: row, error } = await admin.from("invite_links")
      .insert({ slot: data.slot, token, created_by: userId }).select("*").single();
    if (error) throw new Error(error.message);
    await logAudit({ actorId: userId, action: "invite_link.rotate", entity: "invite_links", entityId: row.id, diff: { slot: data.slot } });
    return { item: row };
  });

/** Public: check a token's validity (returns slot if still valid). */
export const getInviteMeta = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ token: z.string().min(10).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = supabaseAdmin as any;
    const { data: row } = await admin.from("invite_links").select("slot,redeemed_at").eq("token", data.token).maybeSingle();
    if (!row) return { valid: false as const };
    return { valid: row.redeemed_at === null, slot: row.slot as Slot };
  });

/**
 * Public: redeem an invite link — creates a confirmed auth user, assigns role,
 * marks the token used, and mints a new token for that slot.
 * Client should then supabase.auth.signInWithPassword() to establish the session.
 */
export const redeemInvite = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({
      token: z.string().min(10).max(200),
      email: z.string().trim().toLowerCase().email().max(255),
      password: z.string().min(8).max(200),
      fullName: z.string().trim().max(120).optional(),
    }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = supabaseAdmin as any;

    const { data: invite } = await admin.from("invite_links").select("*").eq("token", data.token).maybeSingle();
    if (!invite) throw new Error("Invalid invite link");
    if (invite.redeemed_at) throw new Error("This invite link has already been used. Ask for a fresh one.");

    // Check duplicate email (list users by email is unavailable; try create and handle 422)
    const roleToAssign: "admin" | "editor" | "owner" =
      invite.slot === "temp_owner" ? "owner" : (invite.slot as "admin" | "editor");

    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.fullName ?? data.email, invited_via: invite.slot },
    });
    if (createErr || !created?.user) {
      const msg = (createErr?.message ?? "").toLowerCase();
      if (msg.includes("registered") || msg.includes("exists") || msg.includes("duplicate")) {
        throw new Error("An account with this email already exists. Sign in or use Forgot Password.");
      }
      throw new Error(createErr?.message ?? "Could not create account");
    }
    const newUserId = created.user.id;

    // Ensure profile row (trigger usually handles it) — set temp fields if temp_owner
    const isTemp = invite.slot === "temp_owner";
    const tempExpires = isTemp ? new Date(Date.now() + TEMP_OWNER_MS).toISOString() : null;
    await admin.from("profiles").upsert({
      id: newUserId,
      email: data.email,
      full_name: data.fullName ?? data.email,
      is_temp: isTemp,
      is_protected: false,
      temp_expires_at: tempExpires,
    }, { onConflict: "id" });

    // Assign role (owner is normally guarded — temp owner is unprotected so it works)
    const { error: roleErr } = await admin.from("user_roles").insert({ user_id: newUserId, role: roleToAssign });
    if (roleErr) {
      // rollback the auth user so slot doesn't get burned on a half-created account
      await admin.auth.admin.deleteUser(newUserId).catch(() => {});
      throw new Error(roleErr.message);
    }

    // Burn token + mint fresh one for this slot
    await admin.from("invite_links").update({
      redeemed_at: new Date().toISOString(),
      redeemed_by: newUserId,
      redeemed_email: data.email,
    }).eq("id", invite.id);
    const nextToken = randomToken();
    await admin.from("invite_links").insert({ slot: invite.slot, token: nextToken, created_by: invite.created_by });

    await logAudit({
      actorId: newUserId, actorEmail: data.email,
      action: "invite_link.redeem", entity: "invite_links", entityId: invite.id,
      diff: { slot: invite.slot, role: roleToAssign, temp_expires_at: tempExpires },
    });

    return { ok: true, role: roleToAssign, isTemp, tempExpiresAt: tempExpires };
  });
