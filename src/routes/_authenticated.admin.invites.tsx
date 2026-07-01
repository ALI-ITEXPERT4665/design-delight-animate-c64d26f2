import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/admin/AdminShell";
import { listInviteSlots, rotateInviteSlot } from "@/lib/admin/invite-links.functions";

export const Route = createFileRoute("/_authenticated/admin/invites")({
  component: InvitesPage,
});

type SlotKey = "admin" | "editor" | "temp_owner";

const SLOT_META: Record<SlotKey, { title: string; role: string; blurb: string; accent: string; ownerOnly?: boolean }> = {
  admin: {
    title: "Admin invite",
    role: "Admin",
    blurb: "Full CMS access — publish content directly, manage editors, manage media.",
    accent: "from-amber-500/15 to-transparent border-amber-200",
  },
  editor: {
    title: "Editor invite",
    role: "Editor",
    blurb: "Can draft content changes; edits go to Content Approvals for owner/admin sign-off.",
    accent: "from-sky-500/15 to-transparent border-sky-200",
  },
  temp_owner: {
    title: "Temp Owner (2 hours)",
    role: "Owner · 2h",
    blurb: "Full owner-level exploration for 2 hours. Auto sign-out + account deletion after expiry. Cannot touch protected accounts. Owner only.",
    accent: "from-rose-500/15 to-transparent border-rose-200",
    ownerOnly: true,
  },
};

function InvitesPage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["invite-slots"], queryFn: () => listInviteSlots() });

  const rotate = useMutation({
    mutationFn: (slot: SlotKey) => rotateInviteSlot({ data: { slot } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["invite-slots"] }),
  });

  const slots: SlotKey[] = useMemo(
    () => (q.data?.isOwner ? ["admin", "editor", "temp_owner"] : ["admin", "editor"]),
    [q.data?.isOwner]
  );

  return (
    <>
      <PageHeader
        title="Invite Links"
        subtitle="One always-fresh link per role. Copy it and share. When someone uses it, the link auto-rotates so it can never be reused."
      />

      {q.isLoading && <div className="text-sm text-neutral-500">Loading…</div>}
      {q.isError && <div className="text-sm text-rose-600">{(q.error as Error).message}</div>}

      {q.data && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {slots.map((slot) => {
            const meta = SLOT_META[slot];
            const active = q.data.active?.[slot];
            const url = active
              ? `${typeof window !== "undefined" ? window.location.origin : ""}/invite/${active.token}`
              : "";
            return (
              <div key={slot} className={`rounded-xl border bg-gradient-to-b ${meta.accent} p-5 shadow-sm`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900">{meta.title}</h3>
                    <p className="mt-1 text-xs text-neutral-600 leading-relaxed">{meta.blurb}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-neutral-900 text-white text-[10px] uppercase tracking-widest px-2 py-1">
                    {meta.role}
                  </span>
                </div>

                <div className="mt-4 rounded-lg border border-white/60 bg-white/80 backdrop-blur px-3 py-2">
                  <div className="text-[10px] uppercase tracking-wider text-neutral-500">Invite URL</div>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      readOnly
                      value={url}
                      className="flex-1 min-w-0 bg-transparent text-xs text-neutral-800 outline-none"
                      onFocus={(e) => e.currentTarget.select()}
                    />
                    <CopyButton value={url} />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
                  <span>{active ? `Active since ${new Date(active.created_at).toLocaleString()}` : "No active link"}</span>
                  <button
                    onClick={() => rotate.mutate(slot)}
                    disabled={rotate.isPending}
                    className="rounded-md border border-neutral-300 bg-white px-2.5 py-1 text-[11px] hover:bg-neutral-50 disabled:opacity-50"
                  >
                    Rotate now
                  </button>
                </div>

                {q.data.history?.[slot]?.length > 0 && (
                  <details className="mt-3 group">
                    <summary className="cursor-pointer text-[11px] text-neutral-500 hover:text-neutral-800">
                      Recent redemptions ({q.data.history[slot].length})
                    </summary>
                    <ul className="mt-2 space-y-1 text-[11px] text-neutral-600">
                      {q.data.history[slot].slice(0, 8).map((h: any) => (
                        <li key={h.id} className="flex justify-between gap-3">
                          <span className="truncate">{h.redeemed_email ?? "—"}</span>
                          <span className="shrink-0 text-neutral-400">{new Date(h.redeemed_at).toLocaleString()}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-6 text-xs text-neutral-500">
        Message to paste: <em>Check out the admin panel — create your account using this link:</em> then paste the URL above.
      </p>
    </>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        if (!value) return;
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch { /* ignore */ }
      }}
      disabled={!value}
      className="rounded-md bg-neutral-900 px-2.5 py-1 text-[11px] text-white hover:bg-neutral-800 disabled:opacity-50"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
