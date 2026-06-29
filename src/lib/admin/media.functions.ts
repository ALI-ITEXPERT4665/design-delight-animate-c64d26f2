import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { logAudit } from "./audit.server";

const IMG_MAX = 10 * 1024 * 1024;
const VID_MAX = 100 * 1024 * 1024;

// Returns a short-lived signed URL the client uses to upload directly to storage.
export const createMediaUpload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      kind: z.enum(["image", "video"]),
      filename: z.string().min(1).max(200),
      mime: z.string().min(1).max(100),
      size: z.number().int().positive(),
      alt: z.string().max(500).optional(),
    }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    if (data.kind === "image" && data.size > IMG_MAX) throw new Error("Image exceeds 10MB");
    if (data.kind === "video" && data.size > VID_MAX) throw new Error("Video exceeds 100MB");
    const bucket = data.kind === "image" ? "site-images" : "site-videos";
    const safe = data.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${userId}/${Date.now()}-${safe}`;
    const { data: signed, error } = await supabase.storage.from(bucket).createSignedUploadUrl(path);
    if (error) throw new Error(error.message);
    return { bucket, path, token: signed.token, signedUrl: signed.signedUrl };
  });

// After upload completes, register the asset.
export const registerMediaAsset = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      kind: z.enum(["image", "video"]),
      path: z.string(),
      mime: z.string(),
      size: z.number().int().positive(),
      alt: z.string().max(500).optional(),
    }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const bucket = data.kind === "image" ? "site-images" : "site-videos";
    // Long-lived signed URL (1 year) — stored as public_url.
    const { data: signed, error: sErr } = await supabase.storage.from(bucket).createSignedUrl(data.path, 60 * 60 * 24 * 365);
    if (sErr) throw new Error(sErr.message);
    const { data: row, error } = await supabase.from("media_assets").insert({
      kind: data.kind,
      storage_path: `${bucket}/${data.path}`,
      public_url: signed.signedUrl,
      alt: data.alt ?? null,
      size_bytes: data.size,
      mime: data.mime,
      uploaded_by: userId,
    }).select("*").single();
    if (error) throw new Error(error.message);
    await logAudit({ actorId: userId, action: "media.upload", entity: "media_assets", entityId: row.id, diff: { path: data.path, kind: data.kind } });
    return { item: row };
  });

export const listMediaAssets = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ kind: z.enum(["image", "video", "all"]).default("all") }).parse(d ?? {}))
  .handler(async ({ data, context }) => {
    const { supabase } = context as any;
    let q = supabase.from("media_assets").select("*").order("created_at", { ascending: false }).limit(500);
    if (data.kind !== "all") q = q.eq("kind", data.kind);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return { items: rows ?? [] };
  });

export const deleteMediaAsset = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { data: row } = await supabase.from("media_assets").select("*").eq("id", data.id).single();
    if (!row) throw new Error("Not found");
    const [bucket, ...rest] = (row.storage_path as string).split("/");
    await supabase.storage.from(bucket).remove([rest.join("/")]);
    await supabase.from("media_assets").delete().eq("id", data.id);
    await logAudit({ actorId: userId, action: "media.delete", entity: "media_assets", entityId: data.id });
    return { ok: true };
  });
