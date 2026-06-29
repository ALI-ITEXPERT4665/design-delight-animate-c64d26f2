import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/admin/AdminShell";
import { getAllSiteContent, updateSiteContent, submitContentDraft } from "@/lib/admin/content.functions";
import { getMe } from "@/lib/admin/users.functions";

export const Route = createFileRoute("/_authenticated/admin/collections")({
  component: CollectionsPage,
});

type FieldKind = "text" | "textarea" | "url" | "image" | "video";
type Field = { name: string; label: string; kind: FieldKind };

const SCHEMAS: Record<string, { key: string; label: string; description: string; fields: Field[] }> = {
  projects: {
    key: "collection.projects",
    label: "Projects",
    description: "Portfolio projects shown on the Projects page.",
    fields: [
      { name: "title", label: "Title", kind: "text" },
      { name: "location", label: "Location", kind: "text" },
      { name: "year", label: "Year", kind: "text" },
      { name: "category", label: "Category", kind: "text" },
      { name: "image", label: "Cover image URL", kind: "image" },
      { name: "summary", label: "Summary", kind: "textarea" },
      { name: "slug", label: "Slug", kind: "text" },
    ],
  },
  blog: {
    key: "collection.blog",
    label: "Blog posts",
    description: "Articles on the Blog page.",
    fields: [
      { name: "title", label: "Title", kind: "text" },
      { name: "excerpt", label: "Excerpt", kind: "textarea" },
      { name: "image", label: "Cover image URL", kind: "image" },
      { name: "category", label: "Category", kind: "text" },
      { name: "date", label: "Date", kind: "text" },
      { name: "readTime", label: "Read time", kind: "text" },
      { name: "author", label: "Author", kind: "text" },
      { name: "slug", label: "Slug", kind: "text" },
    ],
  },
  services: {
    key: "collection.services",
    label: "Services",
    description: "Service offerings listed across the site.",
    fields: [
      { name: "title", label: "Title", kind: "text" },
      { name: "description", label: "Description", kind: "textarea" },
      { name: "icon", label: "Icon name", kind: "text" },
      { name: "image", label: "Image URL", kind: "image" },
    ],
  },
  faqs: {
    key: "collection.faqs",
    label: "FAQs",
    description: "Frequently asked questions.",
    fields: [
      { name: "question", label: "Question", kind: "text" },
      { name: "answer", label: "Answer", kind: "textarea" },
    ],
  },
  testimonials: {
    key: "collection.testimonials",
    label: "Testimonials",
    description: "Client quotes shown across the site.",
    fields: [
      { name: "quote", label: "Quote", kind: "textarea" },
      { name: "author", label: "Author name", kind: "text" },
      { name: "role", label: "Role / location", kind: "text" },
      { name: "image", label: "Avatar URL (optional)", kind: "image" },
    ],
  },
  team_leads: {
    key: "collection.team_leads",
    label: "Team — Leads",
    description: "Leadership cards on the Team page.",
    fields: [
      { name: "name", label: "Name", kind: "text" },
      { name: "role", label: "Role", kind: "text" },
      { name: "image", label: "Portrait URL", kind: "image" },
    ],
  },
  team_members: {
    key: "collection.team_members",
    label: "Team — Members",
    description: "Full team roster on the Team page.",
    fields: [
      { name: "name", label: "Name", kind: "text" },
      { name: "role", label: "Role", kind: "text" },
    ],
  },
  process_steps: {
    key: "collection.process_steps",
    label: "Process steps",
    description: "Five-stage delivery timeline on the Process page.",
    fields: [
      { name: "number", label: "Number", kind: "text" },
      { name: "title", label: "Title", kind: "text" },
      { name: "subtitle", label: "Subtitle", kind: "text" },
      { name: "description", label: "Description", kind: "textarea" },
      { name: "image", label: "Image URL", kind: "image" },
    ],
  },
  stats: {
    key: "collection.stats",
    label: "Stats",
    description: "Headline numbers (e.g. 250+ projects).",
    fields: [
      { name: "value", label: "Value", kind: "text" },
      { name: "label", label: "Label", kind: "text" },
    ],
  },
  nav: {
    key: "nav.items",
    label: "Navigation",
    description: "Top navigation menu items.",
    fields: [
      { name: "label", label: "Label", kind: "text" },
      { name: "to", label: "Path (e.g. /about)", kind: "text" },
    ],
  },
};

function CollectionsPage() {
  const me = useQuery({ queryKey: ["me"], queryFn: () => getMe() });
  const content = useQuery({ queryKey: ["content"], queryFn: () => getAllSiteContent() });
  const qc = useQueryClient();
  const [tab, setTab] = useState<keyof typeof SCHEMAS>("projects");

  const schema = SCHEMAS[tab];
  const isStaff = (me.data?.roles ?? []).some((r) => r === "owner" || r === "admin");

  const initial = useMemo(() => {
    const row = (content.data?.items ?? []).find((i: any) => i.key === schema.key);
    const v = row?.value;
    return Array.isArray(v) ? v : [];
  }, [content.data, schema.key]);

  const [items, setItems] = useState<any[]>(initial);
  useEffect(() => { setItems(initial); }, [initial]);

  const save = useMutation({
    mutationFn: async () => {
      if (isStaff) await updateSiteContent({ data: { key: schema.key, value: items } });
      else await submitContentDraft({ data: { key: schema.key, value: items } });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["content"] }),
  });

  function update(idx: number, name: string, value: string) {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [name]: value } : it)));
  }
  function remove(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }
  function move(idx: number, dir: -1 | 1) {
    setItems((prev) => {
      const next = [...prev];
      const j = idx + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });
  }
  function add() {
    const blank: any = {};
    for (const f of schema.fields) blank[f.name] = "";
    setItems((prev) => [...prev, blank]);
  }

  return (
    <>
      <PageHeader
        title="Collections"
        subtitle="Add, edit and reorder structured lists across the site."
        right={
          <button
            onClick={() => save.mutate()}
            disabled={save.isPending}
            className="rounded-md bg-neutral-900 text-white px-4 py-2 text-sm hover:bg-neutral-800 disabled:opacity-50"
          >
            {save.isPending ? "Saving…" : isStaff ? "Publish changes" : "Submit for approval"}
          </button>
        }
      />

      <div className="flex flex-wrap gap-2 mb-5">
        {Object.entries(SCHEMAS).map(([k, s]) => (
          <button
            key={k}
            onClick={() => setTab(k as keyof typeof SCHEMAS)}
            className={`rounded-full px-4 py-2 text-xs uppercase tracking-wider border transition-colors ${
              tab === k
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-700 border-neutral-300 hover:border-amber-400"
            }`}
          >
            {s.label} <span className="ml-1 opacity-60">·</span>{" "}
            <span className="opacity-70">{(content.data?.items.find((i: any) => i.key === s.key)?.value?.length) ?? 0}</span>
          </button>
        ))}
      </div>
      <p className="text-sm text-neutral-500 mb-4">{schema.description}</p>

      <div className="space-y-4">
        {items.map((it, idx) => (
          <div key={idx} className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="text-xs uppercase tracking-wider text-neutral-500">#{idx + 1}</div>
              <div className="flex gap-1.5">
                <button onClick={() => move(idx, -1)} className="rounded-md border border-neutral-200 px-2 py-1 text-xs hover:bg-neutral-50">↑</button>
                <button onClick={() => move(idx, 1)} className="rounded-md border border-neutral-200 px-2 py-1 text-xs hover:bg-neutral-50">↓</button>
                <button onClick={() => remove(idx)} className="rounded-md border border-rose-200 text-rose-700 px-2 py-1 text-xs hover:bg-rose-50">Remove</button>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {schema.fields.map((f) => (
                <div key={f.name} className={f.kind === "textarea" ? "sm:col-span-2" : ""}>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">{f.label}</label>
                  {f.kind === "textarea" ? (
                    <textarea
                      value={it[f.name] ?? ""}
                      onChange={(e) => update(idx, f.name, e.target.value)}
                      rows={3}
                      className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    />
                  ) : (
                    <input
                      type="text"
                      value={it[f.name] ?? ""}
                      onChange={(e) => update(idx, f.name, e.target.value)}
                      placeholder={f.kind === "image" || f.kind === "video" ? "Paste a Media Library URL" : ""}
                      className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    />
                  )}
                  {(f.kind === "image" || f.kind === "video") && it[f.name] ? (
                    <div className="mt-2 rounded-md overflow-hidden border border-neutral-200 bg-neutral-100 aspect-video">
                      {f.kind === "image" ? (
                        <img src={it[f.name]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <video src={it[f.name]} muted loop playsInline className="w-full h-full object-cover" />
                      )}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ))}
        {!items.length && (
          <div className="p-12 text-center text-sm text-neutral-500 border border-dashed rounded-xl">
            No items yet. Add the first one below.
          </div>
        )}
      </div>

      <div className="mt-5 flex justify-center">
        <button
          onClick={add}
          className="rounded-md border border-dashed border-neutral-300 px-5 py-3 text-sm text-neutral-700 hover:border-amber-400 hover:text-amber-700"
        >
          + Add {schema.label.slice(0, -1).toLowerCase()}
        </button>
      </div>
    </>
  );
}
