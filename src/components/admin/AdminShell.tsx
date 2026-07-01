import { Link, useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState, type ReactNode } from "react";

function useTempOwnerCountdown(expiresAt?: string | null) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!expiresAt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [expiresAt]);
  const msLeft = expiresAt ? new Date(expiresAt).getTime() - now : 0;
  useEffect(() => {
    if (!expiresAt) return;
    if (msLeft <= 0) {
      supabase.auth.signOut().finally(() => { window.location.href = "/auth?temp_expired=1"; });
    }
  }, [msLeft, expiresAt]);
  return msLeft;
}
function fmt(ms: number) {
  if (ms <= 0) return "0:00";
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}` : `${m}:${String(sec).padStart(2, "0")}`;
}

const NAV = [
  { to: "/admin", label: "Dashboard", icon: "◆" },
  { to: "/admin/analytics", label: "Chatbot Analytics", icon: "◈", ownerOnly: true },
  { to: "/admin/preview", label: "Live Preview", icon: "◉" },
  { to: "/admin/content", label: "Content", icon: "✎" },
  { to: "/admin/collections", label: "Collections", icon: "▤" },
  { to: "/admin/media", label: "Media", icon: "▦" },
  { to: "/admin/content-approvals", label: "Content Approvals", icon: "✓" },
  { to: "/admin/approvals", label: "Signup Approvals", icon: "✚" },
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
  const [drawer, setDrawer] = useState(false);
  // close drawer on route change
  useEffect(() => { setDrawer(false); }, [path]);

  const isOwner = me.roles.includes("owner");
  const isAdmin = isOwner || me.roles.includes("admin");
  const isTemp = !!me.profile?.is_temp;
  const tempExpiresAt = useMemo(() => {
    if (me.profile?.temp_expires_at) return me.profile.temp_expires_at as string;
    if (typeof window !== "undefined") return sessionStorage.getItem("temp_owner_expires_at") || null;
    return null;
  }, [me.profile?.temp_expires_at]);
  const msLeft = useTempOwnerCountdown(isTemp ? tempExpiresAt : null);
  const visible = NAV.filter((n) => {
    // Temp owner has full owner UI, but cannot manage invites (would let them mint more owners)
    if (n.to === "/admin/invites" && isTemp) return false;
    if ((n as any).ownerOnly) return isOwner;
    if (n.to === "/admin/users" || n.to === "/admin/invites" || n.to === "/admin/logs") return isAdmin;
    return true;
  });


  const SidebarBody = (
    <div className="flex h-full flex-col">
      <Link to="/" className="px-5 pt-5 pb-3 block">
        <div className="text-xs tracking-[0.4em] uppercase text-neutral-500">Uppal Design</div>
        <div className="mt-1 text-sm font-semibold">CMS Console</div>
      </Link>
      <nav className="px-2 mt-3 space-y-0.5 overflow-y-auto">
        {visible.map((n) => {
          const active = path === n.to || (n.to !== "/admin" && path.startsWith(n.to));
          return (
            <Link
              key={n.to}
              to={n.to}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
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
          className="mt-3 w-full rounded-md border border-neutral-300 px-3 py-2 text-xs hover:bg-neutral-100"
        >
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-neutral-50 text-neutral-900">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-neutral-200 bg-white">
        {SidebarBody}
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 bg-white border-b border-neutral-200 flex items-center justify-between px-4">
        <button
          onClick={() => setDrawer(true)}
          aria-label="Open menu"
          className="grid place-items-center h-10 w-10 rounded-md hover:bg-neutral-100"
        >
          <span className="block w-5 h-px bg-neutral-800 relative before:absolute before:left-0 before:-top-1.5 before:w-5 before:h-px before:bg-neutral-800 after:absolute after:left-0 after:top-1.5 after:w-5 after:h-px after:bg-neutral-800" />
        </button>
        <div className="text-xs tracking-[0.3em] uppercase text-neutral-700">Uppal CMS</div>
        <div className="w-10" />
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div
              key="ov"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDrawer(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/40"
            />
            <motion.aside
              key="dr"
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.22 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-white border-r border-neutral-200 shadow-xl"
            >
              <div className="flex justify-end p-2">
                <button onClick={() => setDrawer(false)} aria-label="Close menu"
                  className="h-9 w-9 grid place-items-center rounded-md hover:bg-neutral-100 text-neutral-600">✕</button>
              </div>
              {SidebarBody}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <motion.main
        key={path}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10 pt-[4.5rem] lg:pt-10"
      >
        {isTemp && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-rose-300 bg-rose-50 px-4 py-2.5 text-sm text-rose-800">
            <span>
              <strong>Temporary Owner session</strong> — full owner access to explore. Account will be auto-deleted when the timer hits 0.
            </span>
            <span className="font-mono text-base font-semibold">{fmt(msLeft)}</span>
          </div>
        )}
        {children}
      </motion.main>
    </div>
  );
}

export function PageHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight truncate">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>}
      </div>
      {right && <div className="flex flex-wrap gap-2">{right}</div>}
    </header>
  );
}
