import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "@/components/admin/AdminShell";
import {
  listSignupRequests,
  approveSignupRequest,
  rejectSignupRequest,
  deleteSignupRequest,
} from "@/lib/admin/signup-requests.functions";

export const Route = createFileRoute("/_authenticated/admin/approvals")({
  component: ApprovalsPage,
});

function ApprovalsPage() {
  const qc = useQueryClient();
  const list = useQuery({
    queryKey: ["signup-requests"],
    queryFn: () => listSignupRequests(),
    refetchInterval: 30_000,
  });
  const [busyId, setBusyId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  function refresh() { qc.invalidateQueries({ queryKey: ["signup-requests"] }); }

  const approve = useMutation({
    mutationFn: ({ id, role }: { id: string; role: "admin" | "editor" }) =>
      approveSignupRequest({ data: { id, role } }),
    onMutate: (v) => setBusyId(v.id),
    onSuccess: () => { setMsg("Approved — invitation email sent."); refresh(); },
    onError: (e: any) => setMsg(e?.message ?? "Failed to approve"),
    onSettled: () => setBusyId(null),
  });
  const reject = useMutation({
    mutationFn: (id: string) => rejectSignupRequest({ data: { id } }),
    onMutate: setBusyId,
    onSuccess: () => { setMsg("Rejected."); refresh(); },
    onSettled: () => setBusyId(null),
  });
  const remove = useMutation({
    mutationFn: (id: string) => deleteSignupRequest({ data: { id } }),
    onSuccess: refresh,
  });

  const items = list.data?.items ?? [];
  const pending = items.filter((r: any) => r.status === "pending");
  const history = items.filter((r: any) => r.status !== "pending");

  return (
    <>
      <PageHeader
        title="Signup Approvals"
        subtitle="Review new access requests. Approving sends the user an invitation email so they can choose their own password."
      />
      {msg && (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 text-amber-900 text-sm px-3 py-2">
          {msg}
        </div>
      )}

      <section className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
        <header className="p-3 border-b border-neutral-200 text-xs uppercase tracking-wider text-neutral-500">
          Pending ({pending.length})
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-neutral-50 text-neutral-500 uppercase text-xs tracking-wider">
              <tr>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Requested</th>
                <th className="text-left p-3">Message</th>
                <th className="text-left p-3">Assign role</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {pending.map((r: any) => (
                <PendingRow
                  key={r.id}
                  r={r}
                  busy={busyId === r.id}
                  onApprove={(role) => approve.mutate({ id: r.id, role })}
                  onReject={() => reject.mutate(r.id)}
                />
              ))}
              {!pending.length && (
                <tr><td colSpan={6} className="p-6 text-center text-neutral-500">No pending requests.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-neutral-200 bg-white overflow-hidden">
        <header className="p-3 border-b border-neutral-200 text-xs uppercase tracking-wider text-neutral-500">
          History
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-neutral-50 text-neutral-500 uppercase text-xs tracking-wider">
              <tr>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Reviewed</th>
                <th className="text-left p-3">Note</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {history.map((r: any) => (
                <tr key={r.id} className="border-t border-neutral-100">
                  <td className="p-3">{r.email}</td>
                  <td className="p-3">
                    <span className={`text-xs uppercase tracking-wider ${
                      r.status === "approved" ? "text-emerald-700" : "text-rose-700"
                    }`}>{r.status}</span>
                  </td>
                  <td className="p-3 text-neutral-500 text-xs">
                    {r.reviewed_at ? new Date(r.reviewed_at).toLocaleString() : "—"}
                  </td>
                  <td className="p-3 text-neutral-500 text-xs">{r.review_note ?? "—"}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => remove.mutate(r.id)} className="text-xs text-neutral-400 hover:text-rose-600">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!history.length && (
                <tr><td colSpan={5} className="p-6 text-center text-neutral-500">No history yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function PendingRow({
  r, busy, onApprove, onReject,
}: {
  r: any; busy: boolean;
  onApprove: (role: "admin" | "editor") => void;
  onReject: () => void;
}) {
  const [role, setRole] = useState<"admin" | "editor">(r.requested_role === "admin" ? "admin" : "editor");
  return (
    <tr className="border-t border-neutral-100 align-top">
      <td className="p-3">{r.email}</td>
      <td className="p-3">{r.full_name ?? "—"}</td>
      <td className="p-3 uppercase text-xs tracking-wider">{r.requested_role}</td>
      <td className="p-3 text-neutral-600 text-xs max-w-[240px] whitespace-pre-wrap">{r.message ?? "—"}</td>
      <td className="p-3">
        <select value={role} onChange={(e) => setRole(e.target.value as any)}
          className="rounded-md border border-neutral-300 px-2 py-1 text-xs">
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
      </td>
      <td className="p-3 text-right whitespace-nowrap">
        <button disabled={busy} onClick={() => onApprove(role)}
          className="rounded-md bg-emerald-600 text-white px-3 py-1.5 text-xs disabled:opacity-50">
          {busy ? "…" : "Approve & Invite"}
        </button>
        <button disabled={busy} onClick={onReject}
          className="ml-2 rounded-md border border-rose-300 text-rose-700 px-3 py-1.5 text-xs disabled:opacity-50">
          Reject
        </button>
      </td>
    </tr>
  );
}
