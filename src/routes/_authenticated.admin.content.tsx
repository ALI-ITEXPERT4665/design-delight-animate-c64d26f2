import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/admin/AdminShell";
import { getAllSiteContent, updateSiteContent, submitContentDraft } from "@/lib/admin/content.functions";
import { getMe } from "@/lib/admin/users.functions";

export const Route = createFileRoute("/_authenticated/admin/content")({
  component: ContentEditor,
});

// Page-grouped catalog of every editable text/url/media key on the public site.
// Editing any of these publishes to site_content, which the public site reads.
type Group = { label: string; description?: string; keys: { key: string; label: string; kind?: "text" | "textarea" | "url" }[] };

const GROUPS: Group[] = [
  {
    label: "Global · Settings",
    description: "Studio name, contact details and address used everywhere.",
    keys: [
      { key: "settings.name", label: "Site name" },
      { key: "settings.tagline", label: "Tagline" },
      { key: "settings.email", label: "Primary email" },
      { key: "settings.phone", label: "Primary phone" },
      { key: "settings.altPhone", label: "Alt phone" },
      { key: "settings.address", label: "Office address" },
      { key: "settings.studioAddress", label: "Studio address" },
    ],
  },
  {
    label: "Global · Footer",
    keys: [
      { key: "footer.brand.tagline", label: "Footer tagline" },
      { key: "footer.copyright", label: "Copyright line" },
      { key: "footer.video", label: "Footer background video URL", kind: "url" },
    ],
  },
  {
    label: "Global · Chatbot",
    keys: [{ key: "chatbot.greeting", label: "Greeting message", kind: "textarea" }],
  },
  {
    label: "Home page",
    keys: [
      { key: "home.hero.eyebrow", label: "Hero eyebrow" },
      { key: "home.hero.title", label: "Hero title", kind: "textarea" },
      { key: "home.hero.subtitle", label: "Hero subtitle", kind: "textarea" },
      { key: "home.hero.cta", label: "Hero CTA" },
      { key: "home.hero.video", label: "Hero video URL", kind: "url" },
      { key: "home.intro.heading", label: "Intro heading", kind: "textarea" },
      { key: "home.intro.body", label: "Intro body", kind: "textarea" },
    ],
  },
  {
    label: "About page",
    keys: [
      { key: "about.hero.eyebrow", label: "Hero eyebrow" },
      { key: "about.hero.title", label: "Hero title", kind: "textarea" },
      { key: "about.hero.subtitle", label: "Hero subtitle", kind: "textarea" },
      { key: "about.hero.video", label: "Hero video URL", kind: "url" },
      { key: "about.story.heading", label: "Story heading" },
      { key: "about.story.body", label: "Story body", kind: "textarea" },
      { key: "about.mission.heading", label: "Mission heading" },
      { key: "about.mission.body", label: "Mission body", kind: "textarea" },
      { key: "about.founder.quote", label: "Founder quote", kind: "textarea" },
    ],
  },
  {
    label: "Services page",
    keys: [
      { key: "services.hero.eyebrow", label: "Hero eyebrow" },
      { key: "services.hero.title", label: "Hero title", kind: "textarea" },
      { key: "services.hero.subtitle", label: "Hero subtitle", kind: "textarea" },
      { key: "services.hero.video", label: "Hero video URL", kind: "url" },
      { key: "services.why.heading", label: "Why-choose-us heading" },
      { key: "services.cta.title", label: "CTA title" },
      { key: "services.cta.body", label: "CTA body", kind: "textarea" },
      { key: "services.cta.button", label: "CTA button" },
    ],
  },
  {
    label: "Process page",
    keys: [
      { key: "process.hero.eyebrow", label: "Hero eyebrow" },
      { key: "process.hero.title", label: "Hero title", kind: "textarea" },
      { key: "process.hero.subtitle", label: "Hero subtitle", kind: "textarea" },
      { key: "process.hero.video", label: "Hero video URL", kind: "url" },
      { key: "process.principles.heading", label: "Principles heading" },
    ],
  },
  {
    label: "Projects page",
    keys: [
      { key: "projects.hero.eyebrow", label: "Hero eyebrow" },
      { key: "projects.hero.title", label: "Hero title", kind: "textarea" },
      { key: "projects.hero.subtitle", label: "Hero subtitle", kind: "textarea" },
      { key: "projects.hero.video", label: "Hero video URL", kind: "url" },
    ],
  },
  {
    label: "Project detail page",
    keys: [
      { key: "projectDetail.hero.eyebrow", label: "Hero eyebrow" },
      { key: "projectDetail.hero.title", label: "Hero title", kind: "textarea" },
      { key: "projectDetail.hero.subtitle", label: "Hero subtitle", kind: "textarea" },
      { key: "projectDetail.hero.image", label: "Hero image URL", kind: "url" },
      { key: "projectDetail.overview.heading", label: "Overview heading", kind: "textarea" },
      { key: "projectDetail.overview.body", label: "Overview body", kind: "textarea" },
      { key: "projectDetail.challenge.body", label: "Challenge body", kind: "textarea" },
    ],
  },
  {
    label: "Blog page",
    keys: [
      { key: "blog.hero.eyebrow", label: "Hero eyebrow" },
      { key: "blog.hero.title", label: "Hero title", kind: "textarea" },
      { key: "blog.hero.subtitle", label: "Hero subtitle", kind: "textarea" },
      { key: "blog.hero.video", label: "Hero video URL", kind: "url" },
    ],
  },
  {
    label: "Team page",
    keys: [
      { key: "team.hero.eyebrow", label: "Hero eyebrow" },
      { key: "team.hero.title", label: "Hero title", kind: "textarea" },
      { key: "team.hero.highlight", label: "Hero highlight" },
      { key: "team.hero.subtitle", label: "Hero subtitle", kind: "textarea" },
      { key: "team.hero.video", label: "Hero video URL", kind: "url" },
    ],
  },
  {
    label: "Contact page",
    keys: [
      { key: "contact.hero.eyebrow", label: "Hero eyebrow" },
      { key: "contact.hero.title", label: "Hero title", kind: "textarea" },
      { key: "contact.hero.subtitle", label: "Hero subtitle", kind: "textarea" },
      { key: "contact.address", label: "Address" },
      { key: "contact.email", label: "Email" },
      { key: "contact.phone", label: "Phone" },
      { key: "contact.hours", label: "Opening hours" },
    ],
  },
];

function ContentEditor() {
  const me = useQuery({ queryKey: ["me"], queryFn: () => getMe() });
  const content = useQuery({ queryKey: ["content"], queryFn: () => getAllSiteContent() });
  const qc = useQueryClient();
  const [filter, setFilter] = useState("");
  const [activeGroup, setActiveGroup] = useState(0);
  const isStaff = (me.data?.roles ?? []).some((r) => r === "owner" || r === "admin");

  const valueMap = useMemo(() => {
    const m = new Map<string, any>();
    for (const item of content.data?.items ?? []) m.set(item.key, item.value);
    return m;
  }, [content.data]);

  const visibleGroups = useMemo(() => {
    if (!filter) return GROUPS.map((g, i) => ({ g, i }));
    const q = filter.toLowerCase();
    return GROUPS.map((g, i) => ({
      g: { ...g, keys: g.keys.filter((k) => k.key.toLowerCase().includes(q) || k.label.toLowerCase().includes(q)) },
      i,
    })).filter((x) => x.g.keys.length);
  }, [filter]);

  return (
    <>
      <PageHeader
        title="Site content"
        subtitle={isStaff ? "Edits publish instantly" : "Edits are submitted for owner/admin approval"}
        right={
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search any field…"
            className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm w-64"
          />
        }
      />

      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        <aside className="lg:sticky lg:top-4 h-fit">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {visibleGroups.map(({ g, i }) => (
              <button
                key={i}
                onClick={() => setActiveGroup(i)}
                className={`shrink-0 text-left rounded-md px-3 py-2 text-xs sm:text-sm border transition-colors ${
                  activeGroup === i
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-white text-neutral-700 border-neutral-200 hover:border-amber-400"
                }`}
              >
                {g.label}
                <span className="ml-2 opacity-60">{g.keys.length}</span>
              </button>
            ))}
          </nav>
        </aside>

        <div className="space-y-3 min-w-0">
          {(visibleGroups.find((v) => v.i === activeGroup)?.g ?? GROUPS[0]).keys.map((k) => (
            <Row
              key={k.key}
              contentKey={k.key}
              label={k.label}
              kind={k.kind ?? "text"}
              initial={valueMap.get(k.key)}
              isStaff={isStaff}
              onSaved={() => {
                qc.invalidateQueries({ queryKey: ["content"] });
                qc.invalidateQueries({ queryKey: ["site", "content"] });
                qc.invalidateQueries({ queryKey: ["drafts", "pending"] });
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function Row({
  contentKey,
  label,
  kind,
  initial,
  isStaff,
  onSaved,
}: {
  contentKey: string;
  label: string;
  kind: "text" | "textarea" | "url";
  initial: any;
  isStaff: boolean;
  onSaved: () => void;
}) {
  const [val, setVal] = useState(typeof initial === "string" ? initial : initial == null ? "" : JSON.stringify(initial, null, 2));
  const [status, setStatus] = useState<string | null>(null);

  const publish = useMutation({
    mutationFn: async () => {
      if (isStaff) await updateSiteContent({ data: { key: contentKey, value: val } });
      else await submitContentDraft({ data: { key: contentKey, value: val } });
    },
    onSuccess: () => {
      setStatus(isStaff ? "Published" : "Submitted for approval");
      onSaved();
      setTimeout(() => setStatus(null), 2000);
    },
    onError: (e: any) => setStatus(e?.message ?? "Failed"),
  });

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="text-sm font-medium text-neutral-900 truncate">{label}</div>
          <code className="text-[11px] font-mono text-amber-700">{contentKey}</code>
        </div>
        <div className="flex items-center gap-2">
          {status && <span className="text-xs text-emerald-600">{status}</span>}
          <button
            onClick={() => publish.mutate()}
            disabled={publish.isPending}
            className="rounded-md bg-neutral-900 text-white px-3 py-1.5 text-xs hover:bg-neutral-800 disabled:opacity-50"
          >
            {isStaff ? "Publish" : "Submit"}
          </button>
        </div>
      </div>
      {kind === "textarea" ? (
        <textarea
          value={val}
          onChange={(e) => setVal(e.target.value)}
          rows={3}
          className="mt-3 w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
        />
      ) : (
        <input
          type={kind === "url" ? "url" : "text"}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className="mt-3 w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
        />
      )}
      {kind === "url" && val ? (
        <div className="mt-2 text-[11px] text-neutral-500 break-all">{val}</div>
      ) : null}
    </div>
  );
}
