import { createFileRoute } from "@tanstack/react-router";

/**
 * Cron endpoint: deletes expired temporary owner accounts.
 * Called by pg_cron every 5 minutes with the Supabase anon key in `apikey` header.
 * /api/public/* bypasses auth; we still validate the anon key inside the handler.
 */
export const Route = createFileRoute("/api/public/cron/expire-temp-owners")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const providedKey = request.headers.get("apikey") ?? "";
        const expected = process.env.SUPABASE_PUBLISHABLE_KEY ?? "";
        if (!expected || providedKey !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const admin = supabaseAdmin as any;

        const nowIso = new Date().toISOString();
        const { data: expired, error } = await admin
          .from("profiles")
          .select("id,email")
          .eq("is_temp", true)
          .not("temp_expires_at", "is", null)
          .lt("temp_expires_at", nowIso);
        if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });

        let removed = 0;
        for (const row of expired ?? []) {
          const { error: delErr } = await admin.auth.admin.deleteUser(row.id);
          if (!delErr) removed++;
          else console.error("temp-owner cleanup failed", row.id, delErr.message);
        }
        return Response.json({ ok: true, checked: expired?.length ?? 0, removed, at: nowIso });
      },
    },
  },
});
