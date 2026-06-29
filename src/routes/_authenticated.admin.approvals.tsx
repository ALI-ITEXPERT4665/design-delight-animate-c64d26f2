import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "@/components/admin/AdminShell";
import { listContentDrafts, reviewContentDraft } from "@/lib/admin/content.functions";

export const Route = createFileRoute("/_authenticated/admin/approvals")({
  component: Approvals,
});

function Approvals() {
  const [status, setStatus] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ["drafts", status], queryFn: () => listContentDrafts({ data: { status } }) });
  const review = useMutation({
    mutationFn: (v: { draftId: string; action: "approve" | "reject"; note?: string }) => reviewContentDraft({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["drafts"] }),
  });

  return (
    <>
      <PageHeader
        title="Approvals"
        subtitle="Editor-submitted drafts. Approving publishes to the live site instantly."
        right={
          <select value={status} onChange={(e) => setStatus(e.target.value as any)}
            className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm">
            <option value="pending">Pending</option><option value="approved">Approved</option>
            <option value="rejected">Rejected</option><option value="all">All</option>
          </select>
        }
      />
      <div className="space-y-3">
        {(list.data?.items ?? []).map((d: any) => (
          <div key={d.id} className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <code className="text-xs font-mono text-amber-700">{d.key}</code>
                <div className="mt-0.5 text-xs text-neutral-500">
                  Submitted {new Date(d.created_at).toLocaleString()} ·
                  <span className={`ml-1 uppercase tracking-wider ${
                    d.status === "pending" ? "text-amber-700" : d.status === "approved" ? "text-emerald-700" : "text-rose-700"
                  }`}>{d.status}</span>
                </div>
              </div>
              {d.status === "pending" && (
                <div className="flex gap-2">
                  <button onClick={() => review.mutate({ draftId: d.id, action: "reject" })}
                    className="rounded-md border border-rose-200 text-rose-700 px-3 py-1.5 text-xs hover:bg-rose-50">Reject</button>
                  <button onClick={() => review.mutate({ draftId: d.id, action: "approve" })}
                    className="rounded-md bg-emerald-600 text-white px-3 py-1.5 text-xs hover:bg-emerald-700">Approve & publish</button>
                </div>
              )}
            </div>
            <pre className="mt-3 max-h-64 overflow-auto rounded-md bg-neutral-50 p-3 text-xs whitespace-pre-wrap break-words">
              {typeof d.value === "string" ? d.value : JSON.stringify(d.value, null, 2)}
            </pre>
          </div>
        ))}
        {!list.data?.items.length && (
          <div className="p-12 text-center text-sm text-neutral-500 border border-dashed rounded-xl">Nothing here.</div>
        )}
      </div>
    </>
  );
}
