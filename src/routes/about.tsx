import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { media, values, teamLeads } from "@/lib/site-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — UPPAL Design" },
      { name: "description", content: "A small London studio with a long memory. Read about our practice, principles and the people behind the work." },
      { property: "og:title", content: "About — UPPAL Design" },
      { property: "og:description", content: "A small London studio with a long memory. Read about our practice, principles and the people behind the work." },
      { property: "og:image", content: media.founder },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const milestones = [
  { year: "2009", title: "Studio founded", body: "Anugam Uppal opens a one-room practice in Shoreditch with three commissions and a borrowed drafting board." },
  { year: "2014", title: "First award", body: "A small Hampstead refurbishment earns the studio a RIBA London regional commendation." },
  { year: "2018", title: "Workplace practice", body: "We open a dedicated workplace arm, designing studios for designers, publishers and makers." },
  { year: "2022", title: "International work", body: "Commissions in Paris, Lisbon and Mumbai expand the practice beyond the UK for the first time." },
  { year: "2025", title: "Studio at fifteen", body: "Sixteen architects, two associate directors, and a quiet expansion into cultural and civic work." },
];

export default function AboutPage() {
  return (
    <main className="bg-background text-foreground pt-24">
      {/* ── Editorial opening ───────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 pt-20 pb-24 md:px-10 md:pt-32 md:pb-36">
        <p className="reveal-up text-[11px] font-medium uppercase tracking-[0.4em] text-primary">— About the studio</p>
        <h1 className="reveal-up mt-10 max-w-[18ch] text-[clamp(2.5rem,7vw,6rem)] font-light leading-[0.98] tracking-tight">
          A small studio<br />with a <em className="italic font-light text-primary">long</em> memory.
        </h1>
        <div className="mt-16 grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7 md:col-start-1">
            <p className="text-[17px] leading-[1.7] text-foreground/80 md:text-[19px]">
              UPPAL Design is a sixteen-person architecture studio working from a converted print works in east London. We take on a small number of projects each year — residences, workplaces and cultural buildings — so that each one receives the slow, attentive design it deserves.
            </p>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <p className="text-[14px] leading-[1.8] text-muted-foreground">
              The work is rooted in material honesty, generous daylight and a deep respect for the existing fabric of a place. We are not chasing a house style — we are chasing the right answer for each brief.
            </p>
          </div>
        </div>
      </section>

      {/* ── Full bleed image ───────────────────────────── */}
      <section className="media-hover overflow-hidden">
        <img src={media.heroAlt} alt="A recent studio commission" className="h-[60vh] min-h-[480px] w-full object-cover md:h-[80vh]" />
      </section>

      {/* ── Founder spotlight ───────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-28 md:px-10 md:py-40">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="media-hover overflow-hidden">
              <img src={media.founder} alt="Anugam Uppal, founder" className="h-[560px] w-full object-cover grayscale" />
            </div>
            <p className="mt-5 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Anugam Uppal · Founding Director</p>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-primary">— In conversation</p>
            <blockquote className="mt-8 text-[clamp(1.5rem,2.6vw,2.25rem)] font-light leading-[1.3] tracking-tight">
              <span className="text-primary">&ldquo;</span>The best buildings I&apos;ve known feel inevitable — as if they could only have been this one shape, in this one place. We&apos;re always trying to design that kind of quietness.<span className="text-primary">&rdquo;</span>
            </blockquote>
            <div className="mt-12 grid grid-cols-2 gap-8 border-t border-border/60 pt-10">
              <div>
                <div className="text-3xl font-light">15+</div>
                <div className="mt-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Years in practice</div>
              </div>
              <div>
                <div className="text-3xl font-light">42</div>
                <div className="mt-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Built commissions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ───────────────────────────── */}
      <section className="bg-[var(--surface-soft)] py-28 md:py-40">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-primary">— Timeline</p>
          <h2 className="mt-6 max-w-2xl text-[clamp(2rem,4vw,3.25rem)] font-light leading-[1.05] tracking-tight">
            Fifteen years, told briefly.
          </h2>
          <div className="mt-16 divide-y divide-border/60 border-y border-border/60">
            {milestones.map((m) => (
              <div key={m.year} className="row-reveal grid items-start gap-6 py-10 md:grid-cols-[140px_220px_1fr] md:gap-12">
                <div className="text-3xl font-light tracking-tight text-primary md:text-4xl">{m.year}</div>
                <div className="text-lg font-light tracking-tight md:text-xl">{m.title}</div>
                <p className="max-w-2xl text-[14px] leading-[1.8] text-muted-foreground">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Principles ───────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-28 md:px-10 md:py-40">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-primary">— Principles</p>
            <h2 className="mt-6 text-[clamp(2rem,4vw,3rem)] font-light leading-[1.05] tracking-tight">
              Six ideas we return to.
            </h2>
          </div>
          <ul className="md:col-span-7 md:col-start-6">
            {values.map((v, i) => (
              <li key={v} className="row-reveal flex items-baseline justify-between gap-8 border-b border-border/60 py-7">
                <div className="flex items-baseline gap-6 md:gap-10">
                  <span className="text-[11px] tracking-[0.28em] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-2xl font-light tracking-tight md:text-3xl">{v}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Leadership row ───────────────────────────── */}
      <section className="bg-[var(--surface-soft)] py-28 md:py-36">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-primary">— Leadership</p>
          <h2 className="mt-6 max-w-2xl text-[clamp(2rem,4vw,3rem)] font-light leading-[1.05] tracking-tight">The people behind the practice.</h2>
          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {teamLeads.map((t) => (
              <div key={t.name} className="group">
                <div className="media-hover overflow-hidden">
                  <img src={t.image} alt={t.name} className="h-[380px] w-full object-cover grayscale transition group-hover:grayscale-0" />
                </div>
                <h3 className="mt-5 text-lg font-light tracking-tight">{t.name}</h3>
                <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-28 text-center md:px-10 md:py-40">
        <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-primary">— Next</p>
        <h2 className="mx-auto mt-6 max-w-3xl text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-[1.05] tracking-tight">
          Visit the studio, or send us a brief.
        </h2>
        <Link to="/contact" className="btn-sheen mt-10 inline-flex items-center gap-3 border border-foreground/30 px-8 py-4 text-[11px] font-medium uppercase tracking-[0.28em] hover:border-primary hover:bg-primary hover:text-primary-foreground">
          Get in touch <ArrowUpRight className="h-4 w-4" />
        </Link>
      </section>
    </main>
  );
}
