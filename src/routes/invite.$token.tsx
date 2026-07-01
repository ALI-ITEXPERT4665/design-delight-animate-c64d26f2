import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getInviteMeta, redeemInvite } from "@/lib/admin/invite-links.functions";

export const Route = createFileRoute("/invite/$token")({
  head: () => ({
    meta: [
      { title: "You've been invited · Uppal Design" },
      { name: "description", content: "Accept your invitation to the Uppal Design admin panel." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: InviteRedeemPage,
});

const ROLE_LABEL: Record<string, string> = {
  admin: "Admin",
  editor: "Editor",
  temp_owner: "Temporary Owner (2 hours)",
};

function InviteRedeemPage() {
  const { token } = Route.useParams();
  const navigate = useNavigate();

  const [state, setState] = useState<
    | { status: "checking" }
    | { status: "invalid"; reason: string }
    | { status: "ready"; slot: string }
    | { status: "submitting"; slot: string }
    | { status: "error"; slot: string; message: string }
  >({ status: "checking" });

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const meta = await getInviteMeta({ data: { token } });
        if (cancelled) return;
        if (!meta.valid || !meta.slot) {
          setState({ status: "invalid", reason: "This invite link is no longer valid. Ask the owner for a fresh link." });
          return;
        }
        setState({ status: "ready", slot: meta.slot });
      } catch (e: any) {
        if (!cancelled) setState({ status: "invalid", reason: e?.message ?? "Invalid link" });
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state.status !== "ready" && state.status !== "error") return;
    const slot = state.slot;
    setState({ status: "submitting", slot });
    try {
      const res = await redeemInvite({ data: { token, email, password, fullName } });
      // Sign the new user in immediately
      const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
      if (signInErr) throw signInErr;
      if (res.isTemp) {
        // Temp owner: store expiry hint so admin shell can show countdown
        try { sessionStorage.setItem("temp_owner_expires_at", res.tempExpiresAt ?? ""); } catch { /* ignore */ }
      }
      navigate({ to: "/admin" });
    } catch (err: any) {
      setState({ status: "error", slot, message: err?.message ?? "Something went wrong" });
    }
  }

  const slot = "slot" in state ? state.slot : undefined;
  const submitting = state.status === "submitting";

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 grid place-items-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/80 backdrop-blur p-6 sm:p-8 shadow-2xl">
        <div className="text-xs tracking-[0.4em] uppercase text-amber-400">Uppal Design</div>
        <h1 className="mt-2 text-2xl font-semibold">You've been invited</h1>

        {state.status === "checking" && <p className="mt-4 text-sm text-neutral-400">Checking your invite…</p>}

        {state.status === "invalid" && (
          <>
            <p className="mt-4 text-sm text-rose-400">{state.reason}</p>
            <a href="/auth" className="mt-6 inline-block text-sm text-amber-400 hover:underline">Go to sign in →</a>
          </>
        )}

        {(state.status === "ready" || state.status === "submitting" || state.status === "error") && (
          <>
            <p className="mt-3 text-sm text-neutral-300">
              The owner sent you an invite to join as{" "}
              <span className="font-semibold text-white">{ROLE_LABEL[slot!] ?? slot}</span>.
              Create your account below.
            </p>
            {slot === "temp_owner" && (
              <p className="mt-3 rounded-md border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-200">
                Heads up: temporary owner sessions expire after 2 hours. Your account will be automatically signed out and deleted after that.
              </p>
            )}
            <form onSubmit={onSubmit} className="mt-5 space-y-3">
              <Field label="Full name" value={fullName} onChange={setFullName} placeholder="Jane Doe" required />
              <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@email.com" required />
              <Field label="Password (min 8 chars)" type="password" value={password} onChange={setPassword} placeholder="••••••••" required minLength={8} />

              {state.status === "error" && <p className="text-xs text-rose-400">{state.message}</p>}

              <button
                type="submit"
                disabled={submitting || password.length < 8 || !email}
                className="w-full rounded-md bg-amber-500 py-2.5 text-sm font-medium text-neutral-950 hover:bg-amber-400 disabled:opacity-50"
              >
                {submitting ? "Creating account…" : "Accept invite & sign in"}
              </button>
            </form>
            <p className="mt-4 text-[11px] text-neutral-500">
              Already have an account?{" "}
              <a href="/auth" className="text-amber-400 hover:underline">Sign in instead</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function Field(props: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; required?: boolean; minLength?: number;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-widest text-neutral-400">{props.label}</span>
      <input
        type={props.type ?? "text"}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        required={props.required}
        minLength={props.minLength}
        className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-950/60 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-amber-400 focus:outline-none"
      />
    </label>
  );
}
