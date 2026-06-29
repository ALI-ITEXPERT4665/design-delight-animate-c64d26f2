import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { PageHeader } from "@/components/admin/AdminShell";
import { listContentDrafts } from "@/lib/admin/content.functions";

export const Route = createFileRoute("/_authenticated/admin/preview")({
  component: PreviewPage,
});

const PAGES = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/services", label: "Services" },
  { path: "/projects", label: "Projects" },
  { path: "/project-detail", label: "Project detail" },
  { path: "/process", label: "Process" },
  { path: "/blog", label: "Blog" },
  { path: "/team", label: "Team" },
  { path: "/contact", label: "Contact" },
] as const;

const DEVICES = {
  mobile: { w: 390, h: 780, label: "Mobile" },
  tablet: { w: 820, h: 1180, label: "Tablet" },
  desktop: { w: 1440, h: 900, label: "Desktop" },
} as const;
type Device = keyof typeof DEVICES;

function PreviewPage() {
  const [path, setPath] = useState<string>("/");
  const [device, setDevice] = useState<Device>("desktop");
  const [nonce, setNonce] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const pending = useQuery({
    queryKey: ["drafts", "pending"],
    queryFn: () => listContentDrafts({ data: { status: "pending" } }),
    refetchInterval: 15_000,
  });
  const pendingCount = pending.data?.items.length ?? 0;

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const src = useMemo(() => `${origin}${path}?_preview=${nonce}`, [origin, path, nonce]);
  const d = DEVICES[device];

  function reload() {
    setNonce((n) => n + 1);
  }
  function openNewTab() {
    window.open(`${origin}${path}`, "_blank", "noopener");
  }

  return (
    <>
      <PageHeader
        title="Live preview"
        subtitle="See published content exactly as visitors will. Drafts must be approved before they appear here."
        right={
          <>
            <a
              href="/admin/approvals"
              className={`rounded-md border px-3 py-2 text-xs uppercase tracking-wider ${
                pendingCount > 0
                  ? "border-amber-400 bg-amber-50 text-amber-800"
                  : "border-neutral-300 text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              {pendingCount > 0 ? `${pendingCount} pending draft${pendingCount > 1 ? "s" : ""}` : "No pending drafts"}
            </a>
            <button onClick={reload} className="rounded-md bg-neutral-900 text-white px-3 py-2 text-xs uppercase tracking-wider hover:bg-neutral-800">
              Reload
            </button>
            <button onClick={openNewTab} className="rounded-md border border-neutral-300 px-3 py-2 text-xs uppercase tracking-wider hover:bg-neutral-50">
              Open in new tab ↗
            </button>
          </>
        }
      />

      <div className="rounded-xl border border-neutral-200 bg-white p-3 sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Page picker */}
          <div className="flex flex-wrap gap-1.5">
            {PAGES.map((p) => (
              <button
                key={p.path}
                onClick={() => setPath(p.path)}
                className={`rounded-full px-3 py-1.5 text-xs border transition-colors ${
                  path === p.path
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-white text-neutral-700 border-neutral-200 hover:border-amber-400"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Device + path input */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={path}
              onChange={(e) => setPath(e.target.value || "/")}
              className="rounded-md border border-neutral-300 px-3 py-2 text-xs font-mono w-44"
            />
            <div className="inline-flex rounded-md border border-neutral-300 overflow-hidden">
              {(Object.keys(DEVICES) as Device[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setDevice(k)}
                  className={`px-3 py-2 text-xs ${
                    device === k ? "bg-neutral-900 text-white" : "bg-white text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  {DEVICES[k].label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pending drafts banner */}
        {pendingCount > 0 && (
          <div className="mt-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            <strong>{pendingCount}</strong> draft{pendingCount > 1 ? "s are" : " is"} waiting for approval. This preview only shows
            <strong> published</strong> content. Approve drafts in <a className="underline" href="/admin/approvals">Approvals</a> to see them here.
          </div>
        )}

        {/* Device frame */}
        <div className="mt-4 w-full overflow-auto bg-neutral-100 rounded-lg p-3 sm:p-6 flex justify-center">
          <div
            className="bg-white shadow-xl rounded-md overflow-hidden border border-neutral-200 transition-all"
            style={{ width: Math.min(d.w, 1600), maxWidth: "100%" }}
          >
            <div className="flex items-center gap-1.5 px-3 py-2 bg-neutral-50 border-b border-neutral-200">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="ml-3 text-[11px] font-mono text-neutral-500 truncate">{origin}{path}</span>
            </div>
            <iframe
              ref={iframeRef}
              key={src}
              src={src}
              title="Live site preview"
              className="block w-full bg-white"
              style={{ height: d.h }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
