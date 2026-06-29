import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listAuditLogs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ limit: z.number().int().min(1).max(500).default(200) }).parse(d ?? {}))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { data: roleRow } = await supabase
      .from("user_roles").select("role").eq("user_id", userId).in("role", ["owner", "admin"]).maybeSingle();
    if (!roleRow) throw new Error("Forbidden");
    const { data: rows, error } = await supabase
      .from("audit_logs").select("*").order("created_at", { ascending: false }).limit(data.limit);
    if (error) throw new Error(error.message);
    return { items: rows ?? [] };
  });
