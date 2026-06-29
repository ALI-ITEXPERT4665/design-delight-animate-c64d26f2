import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import { media, projects } from "@/lib/site-data";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — UPPAL Design" },
      { name: "description", content: "A growing portfolio of residential, commercial, hospitality and cultural projects across the UK and beyond." },
      { property: "og:title", content: "Projects — UPPAL Design" },
      { property: "og:description", content: "A growing portfolio of residential, commercial, hospitality and cultural projects across the UK and beyond." },
      { property: "og:image", content: media.project1 },
    ],
    links: [{ rel: "canonical", href: "/projects" }],
  }),
  component: ProjectsPage,
});

const categories = ["All", "Residential", "Commercial", "Hospitality", "Educational", "Mixed-use"];

// Heights for masonry visual rhythm
const tileShapes = [
  "md:col-span-5 h-[420px] md:h-[560px]",
  "md:col-span-7 h-[380px] md:h-[460px]",
  "md:col-span-4 h-[440px] md:h-[600px]",
  "md:col-span-4 h-[340px] md:h-[420px]",
  "md:col-span-4 h-[420px] md:h-[520px]",
  "md:col-span-6 h-[420px] md:h-[560px]",
  "md:col-span-6 h-[400px] md:h-[500px]",
  "md:col-span-5 h-[440px] md:h-[600px]",
  "md:col-span-7 h-[380px] md:h-[480px]",
];

export default function ProjectsPage() {
  const [active, setActive] = useState("All");
  const filtered = useMemo(
    () => (active === "All" ? projects : projects.filter((p) => p.category === active)),
    [active]
  );

  return (
    <main className="bg-background text-foreground pt-24">
      {/* ── Header ───────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 pt-20 pb-12 md:px-10 md:pt-32">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-primary">— Selected projects</p>
            <h1 className="mt-8 text-[clamp(2.5rem,7vw,6rem)] font-light leading-[0.95] tracking-tight">
              Forty-two<br /><em className="italic font-light text-primary">built</em> conversations.
            </h1>
          </div>
          <p className="max-w-md text-[15px] leading-[1.8] text-muted-foreground">
            A slow archive of the work — residential, commercial and cultural. New commissions are added each season; some older work is rephotographed as it settles into its place.
          </p>
        </div>
      </section>

      {/* ── Filter rail ───────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-3 border-y border-border/60 py-6">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`group inline-flex items-center gap-3 rounded-full border px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.22em] transition ${
                active === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/70 text-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {c}
              <span className={`text-[10px] ${active === c ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {c === "All" ? projects.length : projects.filter((p) => p.category === c).length}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Asymmetric masonry ───────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className="grid grid-cols-1 gap-x-6 gap-y-16 md:grid-cols-12 md:gap-y-24">
          {filtered.map((p, i) => {
            const shape = tileShapes[i % tileShapes.length];
            const stagger = i % 3 === 1 ? "md:mt-20" : i % 3 === 2 ? "md:mt-10" : "";
            return (
              <Link key={p.title + i} to="/projects" className={`project-tile group block ${shape} ${stagger}`}>
                <div className="media-hover h-full overflow-hidden">
                  <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                      {p.category} · {p.location}
                    </p>
                    <h3 className="mt-2 text-xl font-light tracking-tight md:text-2xl">{p.title}</h3>
                  </div>
                  <ArrowUpRight className="tile-arrow mt-1 h-5 w-5 text-foreground/50 group-hover:text-primary" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Closing band ───────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-28 text-center md:px-10 md:py-40">
        <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-primary">— Commission</p>
        <h2 className="mx-auto mt-6 max-w-3xl text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-[1.05] tracking-tight">
          Have a site, a brief, or just a question?
        </h2>
        <Link to="/contact" className="btn-sheen mt-10 inline-flex items-center gap-3 border border-foreground/30 px-8 py-4 text-[11px] font-medium uppercase tracking-[0.28em] hover:border-primary hover:bg-primary hover:text-primary-foreground">
          Start a conversation <ArrowUpRight className="h-4 w-4" />
        </Link>
      </section>
    </main>
  );
}
