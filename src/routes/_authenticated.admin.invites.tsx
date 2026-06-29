import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "@/components/admin/AdminShell";
import { inviteUser, listInvitations, revokeInvitation } from "@/lib/admin/invites.functions";

export const Route = createFileRoute("/_authenticated/admin/invites")({
  component: InvitesPage,
});

function InvitesPage() {
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ["invites"], queryFn: () => listInvitations() });
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "editor">("editor");

  const invite = useMutation({
    mutationFn: () => inviteUser({ data: { email, role } }),
    onSuccess: () => { setEmail(""); qc.invalidateQueries({ queryKey: ["invites"] }); },
  });
  const revoke = useMutation({
    mutationFn: (id: string) => revokeInvitation({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["invites"] }),
  });

  function inviteLink(token: string) {
    const base = typeof window !== "undefined" ? window.location.origin : "";
    return `${base}/auth?invite=${token}`;
  }

  return (
    <>
      <PageHeader title="Invitations" subtitle="Share the generated link with the invitee. They must sign up using the invited email." />
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <h3 className="text-sm font-semibold">Create invite</h3>
        <div className="mt-3 grid md:grid-cols-[1fr_180px_auto] gap-2">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="person@email.com"
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
          <select value={role} onChange={(e) => setRole(e.target.value as any)}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm">
            <option value="editor">Editor (changes need approval)</option>
            <option value="admin">Admin (publish directly)</option>
          </select>
          <button onClick={() => invite.mutate()} disabled={!email || invite.isPending}
            className="rounded-md bg-amber-500 text-white px-4 py-2 text-sm disabled:opacity-50">Generate invite</button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-neutral-50 text-neutral-500 uppercase text-xs tracking-wider">
            <tr>
              <th className="text-left p-3">Email</th><th className="text-left p-3">Role</th>
              <th className="text-left p-3">Status</th><th className="text-left p-3">Link</th><th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {(list.data?.items ?? []).map((i: any) => {
              const used = !!i.accepted_at;
              const expired = !used && new Date(i.expires_at).getTime() < Date.now();
              return (
                <tr key={i.id} className="border-t border-neutral-100">
                  <td className="p-3">{i.email}</td>
                  <td className="p-3 uppercase text-xs tracking-wider">{i.role}</td>
                  <td className="p-3">
                    <span className={`text-xs ${used ? "text-emerald-700" : expired ? "text-rose-700" : "text-amber-700"}`}>
                      {used ? "Accepted" : expired ? "Expired" : "Pending"}
                    </span>
                  </td>
                  <td className="p-3">
                    {!used && !expired ? (
                      <button onClick={() => navigator.clipboard.writeText(inviteLink(i.token))}
                        className="text-amber-700 hover:underline text-xs">Copy invite link</button>
                    ) : <span className="text-xs text-neutral-400">—</span>}
                  </td>
                  <td className="p-3 text-right">
                    {!used && (
                      <button onClick={() => revoke.mutate(i.id)} className="text-xs text-rose-600 hover:underline">Revoke</button>
                    )}
                  </td>
                </tr>
              );
            })}
            {!list.data?.items.length && <tr><td colSpan={5} className="p-6 text-center text-neutral-500">No invitations.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
