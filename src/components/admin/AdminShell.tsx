import { Link, useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: "◆" },
  { to: "/admin/content", label: "Content", icon: "✎" },
  { to: "/admin/media", label: "Media", icon: "▦" },
  { to: "/admin/approvals", label: "Approvals", icon: "✓" },
  { to: "/admin/users", label: "Users", icon: "♟" },
  { to: "/admin/invites", label: "Invites", icon: "✉" },
  { to: "/admin/logs", label: "Audit Logs", icon: "⌘" },
] as const;

export function AdminShell({
  children,
  me,
}: {
  children: ReactNode;
  me: { profile: any; roles: Array<"owner" | "admin" | "editor"> };
}) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isOwner = me.roles.includes("owner");
  const isAdmin = isOwner || me.roles.includes("admin");
  const visible = NAV.filter((n) => {
    if (n.to === "/admin/users" || n.to === "/admin/invites" || n.to === "/admin/logs") return isAdmin;
    return true;
  });
  return (
    <div className="min-h-screen flex bg-neutral-50 text-neutral-900">
      <aside className="w-64 shrink-0 border-r border-neutral-200 bg-white flex flex-col">
        <Link to="/" className="px-5 pt-5 pb-3 block">
          <div className="text-xs tracking-[0.4em] uppercase text-neutral-500">Uppal Design</div>
          <div className="mt-1 text-sm font-semibold">CMS Console</div>
        </Link>
        <nav className="px-2 mt-3 space-y-0.5">
          {visible.map((n) => {
            const active = path === n.to || (n.to !== "/admin" && path.startsWith(n.to));
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  active ? "bg-neutral-900 text-white" : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span className={`text-[13px] ${active ? "text-amber-400" : "text-amber-600"}`}>{n.icon}</span>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto p-4 border-t border-neutral-200">
          <div className="text-xs text-neutral-500 truncate">{me.profile?.email}</div>
          <div className="mt-1 flex flex-wrap gap-1">
            {me.roles.map((r) => (
              <span key={r} className="text-[10px] uppercase tracking-wider rounded-full bg-amber-100 text-amber-800 px-2 py-0.5">
                {r}
              </span>
            ))}
          </div>
          <button
            onClick={() => supabase.auth.signOut().then(() => (window.location.href = "/auth"))}
            className="mt-3 w-full rounded-md border border-neutral-300 px-3 py-1.5 text-xs hover:bg-neutral-100"
          >
            Sign out
          </button>
        </div>
      </aside>
      <motion.main
        key={path}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex-1 min-w-0 p-6 lg:p-10"
      >
        {children}
      </motion.main>
    </div>
  );
}

export function PageHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <header className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}
