import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ensureOwnerSeed } from "@/lib/admin/users.functions";
import { acceptInvitation } from "@/lib/admin/invites.functions";

type Search = { redirect?: string; invite?: string };

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
    invite: typeof s.invite === "string" ? s.invite : undefined,
  }),
  component: AuthPage,
});

function AuthPage() {
  const { redirect, invite } = useSearch({ from: "/auth" }) as Search;
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    // Idempotent: ensure owner exists so the first login works.
    ensureOwnerSeed({ data: undefined as any }).catch(() => {});
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg("Account created. Check your email if confirmation is required.");
      }
      if (invite) {
        try { await acceptInvitation({ data: { token: invite } }); } catch (e: any) { setMsg(e?.message ?? "Could not accept invite"); }
      }
      navigate({ to: redirect || "/admin" });
    } catch (e: any) {
      setMsg(e?.message ?? "Authentication failed");
    } finally { setBusy(false); }
  }

  return (
    <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-xl">
        <Link to="/" className="text-xs tracking-[0.4em] uppercase text-neutral-500">Uppal Design</Link>
        <h1 className="mt-3 text-2xl font-semibold text-neutral-900">{mode === "signin" ? "Sign in" : "Create account"}</h1>
        <p className="mt-1 text-sm text-neutral-500">Admin & editor access</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1">Password</label>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500" />
          </div>
          {msg && <p className="text-sm text-rose-600">{msg}</p>}
          <button disabled={busy} className="w-full rounded-md bg-neutral-900 text-white py-2.5 text-sm font-medium tracking-wide hover:bg-neutral-800 disabled:opacity-50">
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 text-xs text-neutral-500 hover:text-neutral-900">
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </main>
  );
}
