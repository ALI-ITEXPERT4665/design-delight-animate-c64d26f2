// Server-only audit log helper.
// supabaseAdmin is lazy-imported so this file is safe to import from .functions.ts modules.
export async function logAudit(opts: {
  actorId: string | null;
  actorEmail?: string | null;
  action: string;
  entity?: string;
  entityId?: string;
  diff?: unknown;
  ip?: string;
  userAgent?: string;
}) {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await (supabaseAdmin as any).from("audit_logs").insert({
      actor_id: opts.actorId,
      actor_email: opts.actorEmail ?? null,
      action: opts.action,
      entity: opts.entity ?? null,
      entity_id: opts.entityId ?? null,
      diff: opts.diff ?? null,
      ip: opts.ip ?? null,
      user_agent: opts.userAgent ?? null,
    });
  } catch (e) {
    console.error("audit log failed", e);
  }
}
