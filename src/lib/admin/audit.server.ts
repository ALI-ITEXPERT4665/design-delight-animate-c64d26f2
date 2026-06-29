// Server-only audit log helper. Imported only from .functions.ts handlers.
import { supabaseAdmin } from "@/integrations/supabase/client.server";

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
