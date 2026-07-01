import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ensureOwnerSeed } from "@/lib/admin/users.functions";
import { acceptInvitation } from "@/lib/admin/invites.functions";
import {
  submitSignupRequest,
  ensureTempOwnerSeed,
} from "@/lib/admin/signup-requests.functions";

type Search = { redirect?: string; invite?: string };
type Mode = "signin" | "request" | "forgot";

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>): Search => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
    invite: typeof s.invite === "string" ? s.invite : undefined,
  }),
  component: AuthPage,
});

function AuthPage() {
  const { redirect, invite } = useSearch({ from: "/auth" }) as Search;
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [requestedRole, setRequestedRole] = useState<"admin" | "editor">("editor");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "err" | "ok" | "info"; text: string } | null>(null);
  const [showResend, setShowResend] = useState(false);

  useEffect(() => {
    // Idempotent: ensure primary owner + temp owner exist so first logins work.
    ensureOwnerSeed({ data: undefined as any }).catch(() => {});
    ensureTempOwnerSeed({ data: undefined as any }).catch(() => {});
  }, []);

  // If already signed in, jump straight to the console.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: redirect || "/admin" });
    });
  }, [navigate, redirect]);

  function friendly(raw: string): string {
    const m = raw.toLowerCase();
    if (m.includes("failed to fetch")) {
      return "Network error connecting to the auth service. If you're inside the Lovable Preview, try the published site — the preview proxy can block sign-in.";
    }
    if (m.includes("email not confirmed")) return "Please verify your email first — check your inbox.";
    if (m.includes("invalid login")) return "Wrong email or password.";
    return raw;
  }

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(null); setShowResend(false);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        if (/email not confirmed/i.test(error.message)) setShowResend(true);
        throw error;
      }
      if (invite) { try { await acceptInvitation({ data: { token: invite } }); } catch {} }
      navigate({ to: redirect || "/admin" });
    } catch (e: any) {
      setMsg({ kind: "err", text: friendly(e?.message ?? "Sign in failed") });
    } finally { setBusy(false); }
  }

  async function requestAccess(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    try {
      const res: any = await submitSignupRequest({
        data: { email: email.trim(), fullName: fullName.trim() || undefined, requestedRole, message: reason.trim() || undefined },
      });
      if (!res?.ok) {
        setMsg({ kind: "info", text: res?.message ?? "Could not submit request." });
      } else {
        setMsg({ kind: "ok", text: "Request submitted. The owner will review and email you an invitation link if approved." });
        setFullName(""); setReason("");
      }
    } catch (e: any) {
      setMsg({ kind: "err", text: friendly(e?.message ?? "Could not submit request") });
    } finally { setBusy(false); }
  }

  async function forgot(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${origin}/reset-password`,
      });
      if (error) throw error;
      setMsg({ kind: "ok", text: "If that email is registered, a reset link is on its way." });
    } catch (e: any) {
      setMsg({ kind: "err", text: friendly(e?.message ?? "Could not send reset email") });
    } finally { setBusy(false); }
  }

  async function resendConfirmation() {
    if (!email.trim()) return;
    setBusy(true); setMsg(null);
    const { error } = await supabase.auth.resend({ type: "signup", email: email.trim() });
    setBusy(false);
    setMsg(error
      ? { kind: "err", text: friendly(error.message) }
      : { kind: "ok", text: "Confirmation email resent." });
  }

  return (
    <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-xl">
        <Link to="/" className="text-xs tracking-[0.4em] uppercase text-neutral-500">Uppal Design</Link>
        <h1 className="mt-3 text-2xl font-semibold text-neutral-900">
          {mode === "signin" ? "Sign in" : mode === "request" ? "Request access" : "Forgot password"}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          {mode === "signin" && "Admin & editor access."}
          {mode === "request" && "New accounts need owner approval before activation."}
          {mode === "forgot" && "We'll email you a secure reset link."}
        </p>

        {mode === "signin" && (
          <form onSubmit={signIn} className="mt-6 space-y-4">
            <Field label="Email" type="email" value={email} onChange={setEmail} />
            <Field label="Password" type="password" value={password} onChange={setPassword} minLength={6} />
            <Msg m={msg} />
            {showResend && (
              <button type="button" onClick={resendConfirmation} disabled={busy}
                className="text-xs text-amber-700 hover:underline">
                Resend confirmation email
              </button>
            )}
            <button disabled={busy} className="w-full rounded-md bg-neutral-900 text-white py-2.5 text-sm font-medium tracking-wide hover:bg-neutral-800 disabled:opacity-50">
              {busy ? "Please wait…" : "Sign in"}
            </button>
          </form>
        )}

        {mode === "request" && (
          <form onSubmit={requestAccess} className="mt-6 space-y-4">
            <Field label="Email" type="email" value={email} onChange={setEmail} />
            <Field label="Full name" type="text" value={fullName} onChange={setFullName} required={false} />
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1">Requested role</label>
              <select value={requestedRole} onChange={(e) => setRequestedRole(e.target.value as any)}
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm">
                <option value="editor">Editor (changes need approval)</option>
                <option value="admin">Admin (publish directly)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1">Why do you need access?</label>
              <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} maxLength={1000}
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm" />
            </div>
            <Msg m={msg} />
            <button disabled={busy} className="w-full rounded-md bg-amber-500 text-white py-2.5 text-sm font-medium tracking-wide hover:bg-amber-600 disabled:opacity-50">
              {busy ? "Submitting…" : "Submit request"}
            </button>
          </form>
        )}

        {mode === "forgot" && (
          <form onSubmit={forgot} className="mt-6 space-y-4">
            <Field label="Email" type="email" value={email} onChange={setEmail} />
            <Msg m={msg} />
            <button disabled={busy} className="w-full rounded-md bg-neutral-900 text-white py-2.5 text-sm font-medium tracking-wide hover:bg-neutral-800 disabled:opacity-50">
              {busy ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}

        <div className="mt-6 flex flex-wrap justify-between gap-2 text-xs text-neutral-500">
          {mode !== "signin" && (
            <button onClick={() => { setMode("signin"); setMsg(null); }} className="hover:text-neutral-900">← Back to sign in</button>
          )}
          {mode === "signin" && (
            <>
              <button onClick={() => { setMode("forgot"); setMsg(null); }} className="hover:text-neutral-900">Forgot password?</button>
              <button onClick={() => { setMode("request"); setMsg(null); }} className="hover:text-neutral-900">Need access? Request an account</button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function Field({
  label, type, value, onChange, minLength, required = true,
}: {
  label: string; type: string; value: string; onChange: (v: string) => void;
  minLength?: number; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1">{label}</label>
      <input type={type} required={required} minLength={minLength}
        value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500" />
    </div>
  );
}

function Msg({ m }: { m: { kind: "err" | "ok" | "info"; text: string } | null }) {
  if (!m) return null;
  const cls = m.kind === "err" ? "text-rose-600" : m.kind === "ok" ? "text-emerald-700" : "text-amber-700";
  return <p className={`text-sm ${cls}`}>{m.text}</p>;
}
