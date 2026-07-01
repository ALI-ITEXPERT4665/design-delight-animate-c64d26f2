import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "@/components/admin/AdminShell";
import { listContentDrafts, reviewContentDraft } from "@/lib/admin/content.functions";

export const Route = createFileRoute("/_authenticated/admin/content-approvals")({
  component: ContentApprovalsPage,
});

function ContentApprovalsPage() {
  const qc = useQueryClient();
  const [status, setStatus] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const list = useQuery({
    queryKey: ["content-drafts", status],
    queryFn: () => listContentDrafts({ data: { status } }),
    refetchInterval: 30_000,
  });
  const [busyId, setBusyId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const review = useMutation({
    mutationFn: (v: { draftId: string; action: "approve" | "reject"; note?: string }) =>
      reviewContentDraft({ data: v }),
    onMutate: (v) => setBusyId(v.draftId),
    onSuccess: (_d, v) => {
      setMsg(v.action === "approve" ? "Draft approved and published." : "Draft rejected.");
      qc.invalidateQueries({ queryKey: ["content-drafts"] });
    },
    onError: (e: any) => setMsg(e?.message ?? "Action failed"),
    onSettled: () => setBusyId(null),
  });

  const items = list.data?.items ?? [];

  return (
    <>
      <PageHeader
        title="Content Approvals"
        subtitle="Review content edits submitted by editors. Approving publishes the change live."
        right={
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm bg-white"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="all">All</option>
          </select>
        }
      />
      {msg && (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 text-amber-900 text-sm px-3 py-2">
          {msg}
        </div>
      )}

      <section className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
        <header className="p-3 border-b border-neutral-200 text-xs uppercase tracking-wider text-neutral-500">
          {status} drafts ({items.length})
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-neutral-50 text-neutral-500 uppercase text-xs tracking-wider">
              <tr>
                <th className="text-left p-3">Key</th>
                <th className="text-left p-3">Value preview</th>
                <th className="text-left p-3">Submitted</th>
                <th className="text-left p-3">Status</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((r: any) => (
                <tr key={r.id} className="border-t border-neutral-100 align-top">
                  <td className="p-3 font-mono text-xs">{r.key}</td>
                  <td className="p-3 text-xs text-neutral-600 max-w-[380px]">
                    <pre className="whitespace-pre-wrap break-words font-mono text-[11px] leading-snug max-h-32 overflow-auto">
                      {typeof r.value === "string" ? r.value : JSON.stringify(r.value, null, 2)}
                    </pre>
                  </td>
                  <td className="p-3 text-neutral-500 text-xs whitespace-nowrap">
                    {r.created_at ? new Date(r.created_at).toLocaleString() : "—"}
                  </td>
                  <td className="p-3">
                    <span className={`text-xs uppercase tracking-wider ${
                      r.status === "approved" ? "text-emerald-700" :
                      r.status === "rejected" ? "text-rose-700" : "text-amber-700"
                    }`}>{r.status}</span>
                    {r.reviewer_note && (
                      <div className="mt-1 text-[11px] text-neutral-500">Note: {r.reviewer_note}</div>
                    )}
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    {r.status === "pending" ? (
                      <>
                        <button
                          disabled={busyId === r.id}
                          onClick={() => review.mutate({ draftId: r.id, action: "approve" })}
                          className="rounded-md bg-emerald-600 text-white px-3 py-1.5 text-xs disabled:opacity-50"
                        >
                          {busyId === r.id ? "…" : "Approve & Publish"}
                        </button>
                        <button
                          disabled={busyId === r.id}
                          onClick={() => {
                            const note = window.prompt("Reason (optional):") ?? undefined;
                            review.mutate({ draftId: r.id, action: "reject", note });
                          }}
                          className="ml-2 rounded-md border border-rose-300 text-rose-700 px-3 py-1.5 text-xs disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-neutral-400 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {!items.length && (
                <tr><td colSpan={5} className="p-6 text-center text-neutral-500">No drafts.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
