import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Play } from "lucide-react";
import { BackgroundVideo } from "@/components/background-video";
import { pageVideos, media, projects, services, stats } from "@/lib/site-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UPPAL Design — Architecture for a considered life" },
      { name: "description", content: "A London architecture studio crafting residences, workplaces and cultural spaces with quiet precision." },
      { property: "og:title", content: "UPPAL Design — Architecture for a considered life" },
      { property: "og:description", content: "A London architecture studio crafting residences, workplaces and cultural spaces with quiet precision." },
      { property: "og:image", content: media.heroMain },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  const featured = projects.slice(0, 4);
  return (
    <main className="bg-background text-foreground">
      {/* ── Cinematic full-bleed hero ───────────────────────────── */}
      <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
        <BackgroundVideo src={pageVideos.home} poster={media.heroMain} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/85" />
        <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-between px-6 pb-12 pt-32 md:px-10 md:pt-40">
          <div className="reveal-up max-w-3xl text-white">
            <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-white/70">London · Est. 2009</p>
            <h1 className="mt-6 text-[clamp(2.75rem,8vw,7rem)] font-light leading-[0.95] tracking-tight">
              Architecture<br />
              for a <em className="italic font-light text-primary">considered</em> life.
            </h1>
          </div>
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <p className="max-w-md text-[15px] leading-relaxed text-white/80">
              We design quiet, enduring spaces — residences, workplaces and cultural buildings — where material, light and proportion do the talking.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/projects" className="btn-sheen group inline-flex items-center gap-3 border border-white/40 px-7 py-4 text-[11px] font-medium uppercase tracking-[0.28em] text-white transition hover:border-primary hover:bg-primary">
                See the work
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
              <button className="group inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-white/80 hover:text-white">
                <span className="grid h-11 w-11 place-items-center rounded-full border border-white/40 transition group-hover:scale-110 group-hover:border-primary">
                  <Play className="h-3.5 w-3.5 fill-white" />
                </span>
                Showreel
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee strip ───────────────────────────── */}
      <section className="overflow-hidden border-y border-border/40 bg-background py-8">
        <div className="marquee gap-16 whitespace-nowrap text-[clamp(2rem,5vw,4rem)] font-light tracking-tight text-foreground/90">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex shrink-0 items-center gap-16 pr-16">
              {["Residential", "Workplace", "Cultural", "Hospitality", "Masterplanning", "Interiors"].map((w) => (
                <span key={w} className="flex items-center gap-16">
                  {w}
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── Philosophy split with stats ───────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          <div className="reveal-up sticky top-32 self-start">
            <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-primary">— Practice</p>
            <h2 className="mt-8 text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.05] tracking-tight">
              We build slowly,<br />on purpose.
            </h2>
            <p className="mt-8 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              Every project begins with a long conversation. We listen for how you actually live and work, then translate that into proportion, material and detail. The result is architecture that ages quietly, rather than performs loudly.
            </p>
            <Link to="/about" className="story-link mt-10 inline-block text-[11px] font-medium uppercase tracking-[0.28em] text-foreground">
              About the studio
            </Link>
          </div>

          <div className="space-y-10">
            <div className="media-hover overflow-hidden">
              <img src={media.heroAlt} alt="Studio work" className="h-[480px] w-full object-cover md:h-[560px]" />
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 border-t border-border/60 pt-10 sm:grid-cols-4">
              {stats.slice(0, 4).map((s) => (
                <div key={s.label} className="reveal-up">
                  <div className="text-[clamp(2rem,3vw,3rem)] font-light tracking-tight">{s.value}</div>
                  <div className="mt-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured projects — asymmetric ───────────────────────────── */}
      <section className="bg-[var(--surface-soft)] py-28 md:py-40">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="mb-16 flex items-end justify-between gap-8">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-primary">— Selected work</p>
              <h2 className="mt-6 text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.05] tracking-tight">Recent commissions.</h2>
            </div>
            <Link to="/projects" className="story-link hidden text-[11px] font-medium uppercase tracking-[0.28em] sm:inline">All projects →</Link>
          </div>

          <div className="grid gap-8 md:grid-cols-12 md:gap-x-8 md:gap-y-20">
            {featured.map((p, i) => {
              const layouts = [
                "md:col-span-7 md:row-start-1",
                "md:col-span-4 md:col-start-9 md:row-start-1 md:mt-32",
                "md:col-span-5 md:col-start-2 md:row-start-2",
                "md:col-span-6 md:col-start-7 md:row-start-2 md:mt-16",
              ];
              const heights = ["h-[460px] md:h-[620px]", "h-[360px] md:h-[440px]", "h-[400px] md:h-[500px]", "h-[420px] md:h-[540px]"];
              return (
                <Link key={p.title} to="/projects" className={`project-tile group block ${layouts[i]}`}>
                  <div className={`media-hover overflow-hidden ${heights[i]}`}>
                    <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="mt-5 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">{p.category} · {p.location}</p>
                      <h3 className="mt-2 text-xl font-light tracking-tight md:text-2xl">{p.title}</h3>
                    </div>
                    <ArrowUpRight className="tile-arrow h-6 w-6 text-foreground/60 group-hover:text-primary" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Services teaser strip ───────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
        <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-primary">— Capabilities</p>
        <h2 className="mt-6 max-w-3xl text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.05] tracking-tight">
          A practice that holds your project from first idea to final handover.
        </h2>
        <div className="mt-16 divide-y divide-border/60 border-y border-border/60">
          {services.map((s, i) => (
            <Link key={s.title} to="/services" className="group row-reveal flex items-center justify-between gap-8 py-7">
              <div className="flex items-baseline gap-8 md:gap-14">
                <span className="text-[11px] font-medium tracking-[0.28em] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-2xl font-light tracking-tight md:text-3xl">{s.title}</span>
              </div>
              <ArrowUpRight className="h-5 w-5 text-foreground/50 transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA band with video ───────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <div className="relative h-[60vh] min-h-[480px]">
          <BackgroundVideo src={pageVideos.cta} poster={media.heroMain} />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col items-start justify-center px-6 text-white md:px-10">
            <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-white/70">— Start a project</p>
            <h2 className="mt-6 max-w-3xl text-[clamp(2.25rem,5vw,4.5rem)] font-light leading-[1.02] tracking-tight">
              Let&apos;s design something that lasts.
            </h2>
            <Link to="/contact" className="btn-sheen mt-10 inline-flex items-center gap-3 border border-white/40 px-8 py-4 text-[11px] font-medium uppercase tracking-[0.28em] text-white hover:border-primary hover:bg-primary">
              Begin a conversation
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
