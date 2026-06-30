import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { logAudit } from "./audit.server";

// Public: read all site content (used by SSR loader to hydrate the site).
export const getAllSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const supabase = supabaseAdmin;
  const { data, error } = await supabase.from("site_content").select("key,value,updated_at");
  if (error) throw new Error(error.message);
  return { items: (data ?? []) as Array<{ key: string; value: any; updated_at: string }> };
});

// Admin/Owner: update content directly (live publish).
export const updateSiteContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ key: z.string().min(1).max(200), value: z.any() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { data: roleRow } = await supabase
      .from("user_roles").select("role").eq("user_id", userId).in("role", ["owner", "admin"]).maybeSingle();
    if (!roleRow) throw new Error("Forbidden");
    const { error } = await supabase
      .from("site_content")
      .upsert({ key: data.key, value: data.value, updated_by: userId, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    await logAudit({ actorId: userId, action: "content.update", entity: "site_content", entityId: data.key, diff: data.value });
    return { ok: true };
  });

// Editor: submit a draft for approval.
export const submitContentDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ key: z.string().min(1).max(200), value: z.any() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { data: rows } = await supabase
      .from("user_roles").select("role").eq("user_id", userId);
    const roles = (rows ?? []).map((r: any) => r.role);
    if (!roles.length) throw new Error("Forbidden");
    const { error } = await supabase.from("content_drafts").insert({
      key: data.key, value: data.value, created_by: userId, status: "pending",
    });
    if (error) throw new Error(error.message);
    await logAudit({ actorId: userId, action: "draft.submit", entity: "content_drafts", entityId: data.key });
    return { ok: true };
  });

// List drafts (admins see all, editors see own)
export const listContentDrafts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ status: z.enum(["pending", "approved", "rejected", "all"]).default("pending") }).parse(d ?? {}))
  .handler(async ({ data, context }) => {
    const { supabase } = context as any;
    let q = supabase.from("content_drafts").select("*").order("created_at", { ascending: false }).limit(200);
    if (data.status !== "all") q = q.eq("status", data.status);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return { items: rows ?? [] };
  });

// Admin/Owner: approve or reject a draft.
export const reviewContentDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      draftId: z.string().uuid(),
      action: z.enum(["approve", "reject"]),
      note: z.string().max(1000).optional(),
    }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { data: roleRow } = await supabase
      .from("user_roles").select("role").eq("user_id", userId).in("role", ["owner", "admin"]).maybeSingle();
    if (!roleRow) throw new Error("Forbidden");

    const { data: draft, error: dErr } = await supabase
      .from("content_drafts").select("*").eq("id", data.draftId).single();
    if (dErr || !draft) throw new Error("Draft not found");

    if (data.action === "approve") {
      await supabase.from("site_content").upsert({
        key: draft.key, value: draft.value, updated_by: userId, updated_at: new Date().toISOString(),
      });
    }
    await supabase.from("content_drafts").update({
      status: data.action === "approve" ? "approved" : "rejected",
      reviewer_note: data.note ?? null,
      reviewed_by: userId,
      reviewed_at: new Date().toISOString(),
    }).eq("id", data.draftId);

    await logAudit({
      actorId: userId,
      action: data.action === "approve" ? "draft.approve" : "draft.reject",
      entity: "content_drafts",
      entityId: data.draftId,
      diff: { key: draft.key, note: data.note ?? null },
    });
    return { ok: true };
  });
