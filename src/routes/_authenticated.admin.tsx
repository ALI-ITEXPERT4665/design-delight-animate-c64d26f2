import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const parent = (Route as any).useRouteContext({ select: (c: any) => c });
  // Pull `me` from the parent loader data via route match.
  const meMatch = (Route as any).useMatch({ from: "/_authenticated" });
  const me = meMatch?.loaderData?.me ?? { profile: null, roles: [] };
  return (
    <AdminShell me={me}>
      <Outlet />
    </AdminShell>
  );
}
