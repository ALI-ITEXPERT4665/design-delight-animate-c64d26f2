import { createFileRoute, Outlet, redirect, Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getMe } from "@/lib/admin/users.functions";

type Me = { profile: any; roles: Array<"owner" | "admin" | "editor"> };

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: "/auth", search: { redirect: location.href } });
    }
  },
  loader: async () => {
    const me = await getMe();
    return { me } as { me: Me };
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { me } = Route.useLoaderData() as { me: Me };
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isAdminArea = path.startsWith("/admin");
  const [, force] = useState(0);
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(() => force((n) => n + 1));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (isAdminArea && (!me.roles || me.roles.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
        <div className="max-w-md rounded-xl border border-neutral-200 bg-white p-8 text-center shadow">
          <h1 className="text-xl font-semibold text-neutral-900">No admin access</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Your account ({me.profile?.email}) doesn’t have a CMS role yet. Ask an owner or admin to send you an invite.
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

  if (me.profile?.status === "suspended") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
        <div className="max-w-md rounded-xl border border-rose-200 bg-white p-8 text-center shadow">
          <h1 className="text-xl font-semibold text-rose-700">Account suspended</h1>
          <p className="mt-2 text-sm text-neutral-600">Contact an owner to restore access.</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
