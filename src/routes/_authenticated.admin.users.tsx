import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/AdminShell";
import { listAppUsers, setUserRole, suspendUser, removeUser, getMe } from "@/lib/admin/users.functions";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: UsersPage,
});

function UsersPage() {
  const me = useQuery({ queryKey: ["me"], queryFn: () => getMe() });
  const list = useQuery({ queryKey: ["users"], queryFn: () => listAppUsers() });
  const qc = useQueryClient();

  const setRole = useMutation({
    mutationFn: (v: { targetUserId: string; role: "admin" | "editor" }) => setUserRole({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
  const suspend = useMutation({
    mutationFn: (v: { targetUserId: string; suspend: boolean }) => suspendUser({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
  const remove = useMutation({
    mutationFn: (v: { targetUserId: string }) => removeUser({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });

  const isOwner = (me.data?.roles ?? []).includes("owner");

  return (
    <>
      <PageHeader title="Users" subtitle="Manage roles, suspensions and removals. The owner is protected." />
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-500 uppercase text-xs tracking-wider">
            <tr>
              <th className="text-left p-3">User</th><th className="text-left p-3">Roles</th>
              <th className="text-left p-3">Status</th><th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(list.data?.items ?? []).map((u: any) => {
              const isOwnerRow = u.roles.includes("owner") || u.is_protected;
              return (
                <tr key={u.id} className="border-t border-neutral-100">
                  <td className="p-3">
                    <div className="font-medium">{u.email}</div>
                    <div className="text-xs text-neutral-500">{u.full_name ?? "—"}</div>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {u.roles.map((r: string) => (
                        <span key={r} className={`text-[10px] uppercase tracking-wider rounded-full px-2 py-0.5 ${
                          r === "owner" ? "bg-amber-200 text-amber-900" : r === "admin" ? "bg-indigo-100 text-indigo-800" : "bg-neutral-200 text-neutral-700"
                        }`}>{r}</span>
                      ))}
                      {!u.roles.length && <span className="text-xs text-neutral-400">none</span>}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`text-xs ${u.status === "suspended" ? "text-rose-700" : "text-emerald-700"}`}>{u.status}</span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    {!isOwnerRow && (
                      <>
                        <select
                          defaultValue=""
                          onChange={(e) => e.target.value && setRole.mutate({ targetUserId: u.id, role: e.target.value as any })}
                          className="rounded-md border border-neutral-300 px-2 py-1 text-xs">
                          <option value="" disabled>Set role…</option>
                          {isOwner && <option value="admin">admin</option>}
                          <option value="editor">editor</option>
                        </select>
                        <button onClick={() => suspend.mutate({ targetUserId: u.id, suspend: u.status !== "suspended" })}
                          className="rounded-md border border-neutral-300 px-2 py-1 text-xs hover:bg-neutral-50">
                          {u.status === "suspended" ? "Reactivate" : "Suspend"}
                        </button>
                        <button onClick={() => confirm(`Remove ${u.email}?`) && remove.mutate({ targetUserId: u.id })}
                          className="rounded-md border border-rose-300 text-rose-700 px-2 py-1 text-xs hover:bg-rose-50">
                          Remove
                        </button>
                      </>
                    )}
                    {isOwnerRow && <span className="text-xs text-neutral-400">Protected</span>}
                  </td>
                </tr>
              );
            })}
            {!list.data?.items.length && <tr><td colSpan={4} className="p-6 text-center text-neutral-500">No users yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
