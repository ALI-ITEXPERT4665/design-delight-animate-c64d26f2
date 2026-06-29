import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { logAudit } from "./audit.server";

function randomToken() {
  const a = new Uint8Array(24);
  crypto.getRandomValues(a);
  return Array.from(a).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const inviteUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      email: z.string().email().max(255),
      role: z.enum(["admin", "editor"]),
    }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { data: roleRow } = await supabase
      .from("user_roles").select("role").eq("user_id", userId).in("role", ["owner", "admin"]).maybeSingle();
    if (!roleRow) throw new Error("Forbidden");
    const token = randomToken();
    const { data: row, error } = await supabase.from("invitations").insert({
      email: data.email.toLowerCase(),
      role: data.role,
      token,
      invited_by: userId,
    }).select("*").single();
    if (error) throw new Error(error.message);
    await logAudit({ actorId: userId, action: "invite.create", entity: "invitations", entityId: row.id, diff: { email: data.email, role: data.role } });
    return { item: row };
  });

export const listInvitations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context as any;
    const { data, error } = await supabase.from("invitations").select("*").order("created_at", { ascending: false }).limit(200);
    if (error) throw new Error(error.message);
    return { items: data ?? [] };
  });

export const revokeInvitation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { error } = await supabase.from("invitations").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await logAudit({ actorId: userId, action: "invite.revoke", entity: "invitations", entityId: data.id });
    return { ok: true };
  });

// Public: accept invite. Caller must already be signed in via auth flow.
export const acceptInvitation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ token: z.string().min(10).max(200) }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId, claims } = context as any;
    const email = (claims?.email ?? "").toLowerCase();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = supabaseAdmin as any;
    const { data: inv } = await admin.from("invitations").select("*").eq("token", data.token).maybeSingle();
    if (!inv) throw new Error("Invitation not found");
    if (inv.accepted_at) throw new Error("Invitation already used");
    if (new Date(inv.expires_at).getTime() < Date.now()) throw new Error("Invitation expired");
    if (inv.email.toLowerCase() !== email) throw new Error("Sign in with the invited email address");

    await admin.from("user_roles").upsert({ user_id: userId, role: inv.role });
    await admin.from("invitations").update({ accepted_at: new Date().toISOString() }).eq("id", inv.id);
    await logAudit({ actorId: userId, actorEmail: email, action: "invite.accept", entity: "invitations", entityId: inv.id, diff: { role: inv.role } });
    return { ok: true, role: inv.role };
  });
