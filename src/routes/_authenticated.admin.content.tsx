import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/admin/AdminShell";
import { getAllSiteContent, updateSiteContent, submitContentDraft } from "@/lib/admin/content.functions";
import { getMe } from "@/lib/admin/users.functions";

export const Route = createFileRoute("/_authenticated/admin/content")({
  component: ContentEditor,
});

// Curated list of common content keys so editors can start fresh with no DB rows.
const STARTER_KEYS = [
  { key: "home.hero.title", value: "Crafting Spaces That Inspire and Endure." },
  { key: "home.hero.subtitle", value: "Premium architecture & interior design across the UK." },
  { key: "home.hero.cta", value: "Start a project" },
  { key: "home.hero.video", value: "" }, // media URL
  { key: "footer.brand.tagline", value: "Intelligent design. Lasting impact." },
  { key: "contact.address", value: "Churchill House, 1 London Rd, Slough SL3 7RL, UK" },
  { key: "contact.email", value: "info@uppaldb.co.uk" },
  { key: "contact.phone", value: "+44 7547 487675" },
];

function ContentEditor() {
  const me = useQuery({ queryKey: ["me"], queryFn: () => getMe() });
  const content = useQuery({ queryKey: ["content"], queryFn: () => getAllSiteContent() });
  const qc = useQueryClient();
  const [filter, setFilter] = useState("");
  const isStaff = (me.data?.roles ?? []).some((r) => r === "owner" || r === "admin");

  const merged = useMemo(() => {
    const live = new Map((content.data?.items ?? []).map((i: any) => [i.key, i.value]));
    const all = new Map(STARTER_KEYS.map((s) => [s.key, s.value]));
    for (const [k, v] of live) all.set(k, v);
    return Array.from(all.entries())
      .filter(([k]) => k.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => a[0].localeCompare(b[0]));
  }, [content.data, filter]);

  return (
    <>
      <PageHeader
        title="Site content"
        subtitle={isStaff ? "Edits publish instantly" : "Edits are submitted for owner/admin approval"}
        right={
          <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter keys…"
            className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm w-64" />
        }
      />
      <div className="space-y-3">
        {merged.map(([key, value]) => (
          <Row key={key} contentKey={key} initial={value as any} isStaff={isStaff}
            onSaved={() => { qc.invalidateQueries({ queryKey: ["content"] }); qc.invalidateQueries({ queryKey: ["drafts", "pending"] }); }} />
        ))}
      </div>

      <AddKeyCard onSaved={() => qc.invalidateQueries({ queryKey: ["content"] })} isStaff={isStaff} />
    </>
  );
}

function Row({ contentKey, initial, isStaff, onSaved }: { contentKey: string; initial: any; isStaff: boolean; onSaved: () => void }) {
  const [val, setVal] = useState(typeof initial === "string" ? initial : JSON.stringify(initial ?? "", null, 2));
  const isJson = typeof initial !== "string" && initial != null;
  const [status, setStatus] = useState<string | null>(null);

  const publish = useMutation({
    mutationFn: async () => {
      const parsed = isJson ? JSON.parse(val) : val;
      if (isStaff) await updateSiteContent({ data: { key: contentKey, value: parsed } });
      else await submitContentDraft({ data: { key: contentKey, value: parsed } });
    },
    onSuccess: () => { setStatus(isStaff ? "Published" : "Submitted for approval"); onSaved(); setTimeout(() => setStatus(null), 2000); },
    onError: (e: any) => setStatus(e?.message ?? "Failed"),
  });

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <code className="text-xs font-mono text-amber-700">{contentKey}</code>
        <div className="flex items-center gap-2">
          {status && <span className="text-xs text-emerald-600">{status}</span>}
          <button onClick={() => publish.mutate()} disabled={publish.isPending}
            className="rounded-md bg-neutral-900 text-white px-3 py-1.5 text-xs hover:bg-neutral-800 disabled:opacity-50">
            {isStaff ? "Publish" : "Submit for approval"}
          </button>
        </div>
      </div>
      <textarea value={val} onChange={(e) => setVal(e.target.value)} rows={Math.min(8, Math.max(2, val.split("\n").length))}
        className="mt-3 w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/40" />
    </div>
  );
}

function AddKeyCard({ onSaved, isStaff }: { onSaved: () => void; isStaff: boolean }) {
  const [k, setK] = useState("");
  const [v, setV] = useState("");
  const save = useMutation({
    mutationFn: async () => {
      if (isStaff) await updateSiteContent({ data: { key: k, value: v } });
      else await submitContentDraft({ data: { key: k, value: v } });
    },
    onSuccess: () => { setK(""); setV(""); onSaved(); },
  });
  return (
    <div className="mt-8 rounded-xl border border-dashed border-neutral-300 bg-white p-5">
      <h3 className="text-sm font-semibold">Add a new content key</h3>
      <div className="mt-3 grid md:grid-cols-[280px_1fr_auto] gap-2">
        <input value={k} onChange={(e) => setK(e.target.value)} placeholder="e.g. about.story.heading"
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
        <input value={v} onChange={(e) => setV(e.target.value)} placeholder="Value (string or JSON)"
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
        <button onClick={() => save.mutate()} disabled={!k || save.isPending}
          className="rounded-md bg-amber-500 text-white px-4 py-2 text-sm disabled:opacity-50">Save</button>
      </div>
    </div>
  );
}
