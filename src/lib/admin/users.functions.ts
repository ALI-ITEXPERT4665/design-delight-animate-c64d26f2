import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { logAudit } from "./audit.server";

const OWNER_EMAIL = "m.alinadeem4665@gmail.com";

async function assertOwnerOrAdmin(supabase: any, userId: string) {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId).in("role", ["owner", "admin"]).maybeSingle();
  if (!data) throw new Error("Forbidden");
  return data.role as "owner" | "admin";
}

export const listAppUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context as any;
    await assertOwnerOrAdmin(supabase, userId);
    const { data: profiles, error } = await supabase
      .from("profiles").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    const { data: roles } = await supabase.from("user_roles").select("user_id,role");
    const byUser: Record<string, string[]> = {};
    for (const r of roles ?? []) {
      byUser[r.user_id] ??= [];
      byUser[r.user_id].push(r.role);
    }
    return { items: (profiles ?? []).map((p: any) => ({ ...p, roles: byUser[p.id] ?? [] })) };
  });

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      targetUserId: z.string().uuid(),
      role: z.enum(["owner", "admin", "editor"]),
    }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const callerRole = await assertOwnerOrAdmin(supabase, userId);
    if (data.role === "owner") throw new Error("Owner role cannot be assigned");
    if (data.targetUserId === userId && callerRole === "owner") throw new Error("Cannot change owner role");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Replace any existing non-owner role.
    await (supabaseAdmin as any).from("user_roles").delete().eq("user_id", data.targetUserId).neq("role", "owner");
    const { error } = await (supabaseAdmin as any).from("user_roles").insert({ user_id: data.targetUserId, role: data.role });
    if (error) throw new Error(error.message);
    await logAudit({ actorId: userId, action: "user.role_set", entity: "profiles", entityId: data.targetUserId, diff: { role: data.role } });
    return { ok: true };
  });

export const suspendUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ targetUserId: z.string().uuid(), suspend: z.boolean() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    await assertOwnerOrAdmin(supabase, userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: target } = await (supabaseAdmin as any).from("profiles").select("id,is_protected,email").eq("id", data.targetUserId).single();
    if (!target) throw new Error("Not found");
    if (target.is_protected && data.suspend) throw new Error("Owner cannot be suspended");
    const { error } = await (supabaseAdmin as any).from("profiles")
      .update({ status: data.suspend ? "suspended" : "active" }).eq("id", data.targetUserId);
    if (error) throw new Error(error.message);
    await logAudit({ actorId: userId, action: data.suspend ? "user.suspend" : "user.activate", entity: "profiles", entityId: data.targetUserId });
    return { ok: true };
  });

export const removeUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ targetUserId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    await assertOwnerOrAdmin(supabase, userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: target } = await (supabaseAdmin as any).from("profiles").select("id,is_protected,email").eq("id", data.targetUserId).single();
    if (!target) throw new Error("Not found");
    if (target.is_protected) throw new Error("Owner account is protected");
    const { error } = await (supabaseAdmin as any).auth.admin.deleteUser(data.targetUserId);
    if (error) throw new Error(error.message);
    await logAudit({ actorId: userId, action: "user.remove", entity: "profiles", entityId: data.targetUserId, diff: { email: target.email } });
    return { ok: true };
  });

// Idempotent owner bootstrap — creates the protected owner account if missing.
// Safe to expose: it only acts when no owner exists yet, and the credentials
// are the hard-coded ones the client provided.
export const ensureOwnerSeed = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const admin = supabaseAdmin as any;
  const { data: existing } = await admin.from("user_roles").select("user_id").eq("role", "owner").maybeSingle();
  if (existing) return { ok: true, created: false };

  // Look up by email via admin API (list pages may need pagination but 0 owners + fresh project = empty list).
  let ownerId: string | null = null;
  const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  const found = list?.users?.find((u: any) => (u.email ?? "").toLowerCase() === OWNER_EMAIL);
  if (found) ownerId = found.id;

  if (!ownerId) {
    const { data: created, error } = await admin.auth.admin.createUser({
      email: OWNER_EMAIL,
      password: "alitesting@123",
      email_confirm: true,
      user_metadata: { full_name: "Owner" },
    });
    if (error) throw new Error(error.message);
    ownerId = created.user.id;
  }

  await admin.from("profiles").upsert({
    id: ownerId, email: OWNER_EMAIL, full_name: "Owner", is_protected: true, status: "active",
  });
  await admin.from("user_roles").insert({ user_id: ownerId, role: "owner" }).select();
  await admin.from("audit_logs").insert({
    actor_id: ownerId, actor_email: OWNER_EMAIL, action: "owner.seed", entity: "profiles", entity_id: ownerId,
  });
  return { ok: true, created: true };
});

// Returns the caller's profile + roles.
export const getMe = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context as any;
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    return { profile, roles: (roles ?? []).map((r: any) => r.role) as Array<"owner" | "admin" | "editor"> };
  });
