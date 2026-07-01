import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { logAudit } from "./audit.server";

// Public: anyone can submit a signup request
export const submitSignupRequest = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({
      email: z.string().trim().email().max(255),
      fullName: z.string().trim().min(1).max(120).optional(),
      requestedRole: z.enum(["admin", "editor"]).default("editor"),
      message: z.string().trim().max(1000).optional(),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = supabaseAdmin as any;
    const email = data.email.toLowerCase();

    // Duplicate check: already has an auth account?
    const { data: users } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const existing = users?.users?.find((u: any) => (u.email ?? "").toLowerCase() === email);
    if (existing) {
      return {
        ok: false,
        code: "already_registered",
        message: "Account is already created. Please sign in or use Forgot Password.",
      } as const;
    }

    // Duplicate pending request?
    const { data: pending } = await admin
      .from("signup_requests")
      .select("id")
      .ilike("email", email)
      .eq("status", "pending")
      .maybeSingle();
    if (pending) {
      return {
        ok: false,
        code: "already_pending",
        message: "A request for this email is already pending owner approval.",
      } as const;
    }

    const { error } = await admin.from("signup_requests").insert({
      email,
      full_name: data.fullName ?? null,
      requested_role: data.requestedRole,
      message: data.message ?? null,
      status: "pending",
    });
    if (error) throw new Error(error.message);

    await logAudit({
      actorId: null,
      actorEmail: email,
      action: "signup_request.submit",
      entity: "signup_requests",
      diff: { role: data.requestedRole },
    });

    return { ok: true } as const;
  });

async function assertReviewer(supabase: any, userId: string) {
  const { data } = await supabase
    .from("user_roles").select("role").eq("user_id", userId)
    .in("role", ["owner", "admin"]).maybeSingle();
  if (!data) throw new Error("Forbidden");
}

export const listSignupRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context as any;
    await assertReviewer(supabase, userId);
    const { data, error } = await supabase
      .from("signup_requests").select("*").order("created_at", { ascending: false }).limit(200);
    if (error) throw new Error(error.message);
    return { items: data ?? [] };
  });

export const approveSignupRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      id: z.string().uuid(),
      role: z.enum(["admin", "editor"]).optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId, claims } = context as any;
    await assertReviewer(supabase, userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = supabaseAdmin as any;

    const { data: req, error: reqErr } = await admin
      .from("signup_requests").select("*").eq("id", data.id).single();
    if (reqErr || !req) throw new Error("Request not found");
    if (req.status !== "pending") throw new Error("Request already reviewed");

    const role = data.role ?? req.requested_role;
    const email = String(req.email).toLowerCase();
    const origin =
      process.env.SITE_URL ||
      process.env.PUBLIC_SITE_URL ||
      "https://uppaldb.site";

    // Send Supabase invitation email — user clicks link, sets their password, then is signed in.
    const { data: invited, error: invErr } = await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${origin}/reset-password?welcome=1`,
      data: { full_name: req.full_name ?? null, invited_role: role },
    });
    if (invErr) {
      // If user already exists (race), fall back to reset link
      if (!/already/i.test(invErr.message)) throw new Error(invErr.message);
    }

    const newUserId: string | undefined = invited?.user?.id;
    if (newUserId) {
      await admin.from("profiles").upsert({
        id: newUserId, email, full_name: req.full_name ?? null, status: "active", is_protected: false,
      });
      await admin.from("user_roles").upsert({ user_id: newUserId, role });
    }

    await admin.from("signup_requests")
      .update({ status: "approved", reviewed_by: userId, reviewed_at: new Date().toISOString(), review_note: `Role: ${role}` })
      .eq("id", data.id);

    await logAudit({
      actorId: userId, actorEmail: claims?.email ?? null,
      action: "signup_request.approve", entity: "signup_requests", entityId: data.id,
      diff: { email, role },
    });

    return { ok: true, role };
  });

export const rejectSignupRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid(), note: z.string().max(500).optional() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId, claims } = context as any;
    await assertReviewer(supabase, userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = supabaseAdmin as any;
    const { error } = await admin.from("signup_requests")
      .update({ status: "rejected", reviewed_by: userId, reviewed_at: new Date().toISOString(), review_note: data.note ?? null })
      .eq("id", data.id).eq("status", "pending");
    if (error) throw new Error(error.message);
    await logAudit({
      actorId: userId, actorEmail: claims?.email ?? null,
      action: "signup_request.reject", entity: "signup_requests", entityId: data.id,
    });
    return { ok: true };
  });

export const deleteSignupRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    await assertReviewer(supabase, userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await (supabaseAdmin as any).from("signup_requests").delete().eq("id", data.id);
    await logAudit({ actorId: userId, action: "signup_request.delete", entity: "signup_requests", entityId: data.id });
    return { ok: true };
  });

// Idempotent: seed the pitbwebdev@gmail.com temporary-owner account.
// Given owner rights but NOT protected — the primary owner can suspend/remove.
export const ensureTempOwnerSeed = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const admin = supabaseAdmin as any;
  const email = "pitbwebdev@gmail.com";
  const password = "talha@123";

  const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  let user = list?.users?.find((u: any) => (u.email ?? "").toLowerCase() === email);

  if (!user) {
    const { data: created, error } = await admin.auth.admin.createUser({
      email, password, email_confirm: true, user_metadata: { full_name: "Pitb Webdev" },
    });
    if (error) throw new Error(error.message);
    user = created.user;
  } else {
    // Ensure password + confirmed
    await admin.auth.admin.updateUserById(user.id, { password, email_confirm: true });
  }

  await admin.from("profiles").upsert({
    id: user.id, email, full_name: "Pitb Webdev", status: "active", is_protected: false,
  });
  // Grant owner role (unprotected so primary owner can revoke/suspend)
  const { data: existingRole } = await admin.from("user_roles")
    .select("user_id").eq("user_id", user.id).eq("role", "owner").maybeSingle();
  if (!existingRole) {
    await admin.from("user_roles").delete().eq("user_id", user.id);
    await admin.from("user_roles").insert({ user_id: user.id, role: "owner" });
  }
  return { ok: true };
});
