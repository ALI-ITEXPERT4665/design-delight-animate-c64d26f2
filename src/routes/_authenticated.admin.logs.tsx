import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/AdminShell";
import { listAuditLogs } from "@/lib/admin/logs.functions";

export const Route = createFileRoute("/_authenticated/admin/logs")({
  component: LogsPage,
});

function LogsPage() {
  const list = useQuery({ queryKey: ["logs", "full"], queryFn: () => listAuditLogs({ data: { limit: 500 } }) });
  return (
    <>
      <PageHeader title="Audit logs" subtitle="Every CMS action is recorded with actor, action, entity and diff." />
      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-neutral-50 text-neutral-500 uppercase text-xs tracking-wider">
            <tr>
              <th className="text-left p-3">When</th>
              <th className="text-left p-3">Actor</th>
              <th className="text-left p-3">Action</th>
              <th className="text-left p-3">Entity</th>
              <th className="text-left p-3">Diff</th>
            </tr>
          </thead>
          <tbody>
            {(list.data?.items ?? []).map((l: any) => (
              <tr key={l.id} className="border-t border-neutral-100 align-top">
                <td className="p-3 text-neutral-500 whitespace-nowrap">{new Date(l.created_at).toLocaleString()}</td>
                <td className="p-3">{l.actor_email ?? l.actor_id?.slice(0, 8) ?? "system"}</td>
                <td className="p-3 font-medium">{l.action}</td>
                <td className="p-3 text-neutral-500">{l.entity ?? "—"} {l.entity_id && <code className="text-xs ml-1 text-neutral-400">{l.entity_id.slice(0,8)}</code>}</td>
                <td className="p-3 max-w-md">
                  {l.diff ? <pre className="text-[11px] whitespace-pre-wrap break-words text-neutral-600">{JSON.stringify(l.diff, null, 2)}</pre> : "—"}
                </td>
              </tr>
            ))}
            {!list.data?.items.length && <tr><td colSpan={5} className="p-6 text-center text-neutral-500">No events.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
