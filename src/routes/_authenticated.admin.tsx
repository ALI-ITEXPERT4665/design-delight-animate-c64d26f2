import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { getMe } from "@/lib/admin/users.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["me"],
    queryFn: () => getMe(),
    staleTime: 30_000,
  });

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(() => refetch());
    return () => sub.subscription.unsubscribe();
  }, [refetch]);

  if (isLoading || !data) {
    return <div className="min-h-screen grid place-items-center text-sm text-neutral-500">Loading console…</div>;
  }

  if (!data.roles || data.roles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
        <div className="max-w-md rounded-xl border border-neutral-200 bg-white p-8 text-center shadow">
          <h1 className="text-xl font-semibold text-neutral-900">No CMS access</h1>
          <p className="mt-2 text-sm text-neutral-600">
            {data.profile?.email ?? "This account"} has no admin role. Ask an owner or admin to invite you.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Link to="/" className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm">Back to site</Link>
            <button
              onClick={() => supabase.auth.signOut().then(() => (window.location.href = "/auth"))}
              className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm text-white">Sign out</button>
          </div>
        </div>
      </div>
    );
  }

  if (data.profile?.status === "suspended") {
    return (
      <div className="min-h-screen grid place-items-center bg-neutral-50 px-4">
        <div className="max-w-md rounded-xl border border-rose-200 bg-white p-8 text-center shadow">
          <h1 className="text-xl font-semibold text-rose-700">Account suspended</h1>
          <p className="mt-2 text-sm text-neutral-600">An owner must reactivate this account.</p>
        </div>
      </div>
    );
  }

  return (
    <AdminShell me={data}>
      <Outlet />
    </AdminShell>
  );
}
