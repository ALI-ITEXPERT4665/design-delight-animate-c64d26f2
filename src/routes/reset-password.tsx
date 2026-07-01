import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);
  const isWelcome = typeof window !== "undefined" && window.location.search.includes("welcome=1");

  useEffect(() => {
    // Supabase parses the recovery/invite token from the URL hash automatically
    // and fires PASSWORD_RECOVERY / SIGNED_IN. Wait until a session exists.
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (pwd.length < 8) { setMsg("Password must be at least 8 characters."); return; }
    if (pwd !== pwd2) { setMsg("Passwords do not match."); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pwd });
    setBusy(false);
    if (error) { setMsg(error.message); return; }
    setOk(true);
    setTimeout(() => navigate({ to: "/admin" }), 800);
  }

  return (
    <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-xl">
        <Link to="/" className="text-xs tracking-[0.4em] uppercase text-neutral-500">Uppal Design</Link>
        <h1 className="mt-3 text-2xl font-semibold text-neutral-900">
          {isWelcome ? "Set your password" : "Reset your password"}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          {isWelcome
            ? "Welcome — choose a password to activate your account."
            : "Enter a new password to finish resetting your account."}
        </p>

        {!ready && !ok && (
          <p className="mt-6 text-sm text-neutral-500">
            Verifying your link… If nothing happens, request a fresh reset from the sign-in page.
          </p>
        )}

        {ready && !ok && (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1">New password</label>
              <input type="password" required minLength={8} value={pwd} onChange={(e) => setPwd(e.target.value)}
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1">Confirm password</label>
              <input type="password" required minLength={8} value={pwd2} onChange={(e) => setPwd2(e.target.value)}
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500" />
            </div>
            {msg && <p className="text-sm text-rose-600">{msg}</p>}
            <button disabled={busy} className="w-full rounded-md bg-neutral-900 text-white py-2.5 text-sm font-medium tracking-wide hover:bg-neutral-800 disabled:opacity-50">
              {busy ? "Saving…" : "Save password"}
            </button>
          </form>
        )}

        {ok && (
          <p className="mt-6 text-sm text-emerald-700">
            Password saved. Redirecting to your admin console…
          </p>
        )}

        <div className="mt-6 text-xs text-neutral-500">
          <Link to="/auth" className="hover:text-neutral-900">Back to sign in</Link>
        </div>
      </div>
    </main>
  );
}
