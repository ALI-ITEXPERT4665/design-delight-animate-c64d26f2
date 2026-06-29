import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/AdminShell";
import { listContentDrafts } from "@/lib/admin/content.functions";
import { listAuditLogs } from "@/lib/admin/logs.functions";
import { getAllSiteContent } from "@/lib/admin/content.functions";
import { listMediaAssets } from "@/lib/admin/media.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

function Stat({ label, value, href }: { label: string; value: number | string; href?: string }) {
  const body = (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 hover:border-amber-400 transition-colors">
      <div className="text-xs uppercase tracking-wider text-neutral-500">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-neutral-900">{value}</div>
    </div>
  );
  return href ? <Link to={href}>{body}</Link> : body;
}

function AdminDashboard() {
  const pending = useQuery({ queryKey: ["drafts", "pending"], queryFn: () => listContentDrafts({ data: { status: "pending" } }) });
  const content = useQuery({ queryKey: ["content"], queryFn: () => getAllSiteContent() });
  const media = useQuery({ queryKey: ["media"], queryFn: () => listMediaAssets({ data: { kind: "all" } }) });
  const logs = useQuery({ queryKey: ["logs"], queryFn: () => listAuditLogs({ data: { limit: 10 } }) });

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Overview of your live website state" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Pending approvals" value={pending.data?.items.length ?? "—"} href="/admin/approvals" />
        <Stat label="Content keys" value={content.data?.items.length ?? "—"} href="/admin/content" />
        <Stat label="Media assets" value={media.data?.items.length ?? "—"} href="/admin/media" />
        <Stat label="Recent events" value={logs.data?.items.length ?? "—"} href="/admin/logs" />
      </div>

      <section className="mt-10">
        <h2 className="text-sm uppercase tracking-wider text-neutral-500">Latest activity</h2>
        <div className="mt-3 overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-neutral-500 uppercase text-xs tracking-wider">
              <tr><th className="text-left p-3">When</th><th className="text-left p-3">Actor</th><th className="text-left p-3">Action</th><th className="text-left p-3">Entity</th></tr>
            </thead>
            <tbody>
              {(logs.data?.items ?? []).map((l: any) => (
                <tr key={l.id} className="border-t border-neutral-100">
                  <td className="p-3 text-neutral-500">{new Date(l.created_at).toLocaleString()}</td>
                  <td className="p-3">{l.actor_email ?? l.actor_id?.slice(0, 8) ?? "system"}</td>
                  <td className="p-3 font-medium">{l.action}</td>
                  <td className="p-3 text-neutral-500">{l.entity ?? "—"}</td>
                </tr>
              ))}
              {!logs.data?.items.length && <tr><td colSpan={4} className="p-6 text-center text-neutral-500">No activity yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
