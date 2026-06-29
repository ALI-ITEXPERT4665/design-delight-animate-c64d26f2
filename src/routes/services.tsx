import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { media, services, pageVideos } from "@/lib/site-data";
import { BackgroundVideo } from "@/components/background-video";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — UPPAL Design" },
      { name: "description", content: "From early masterplanning to final fit-out, the studio offers a full spectrum of architecture and interior services." },
      { property: "og:title", content: "Services — UPPAL Design" },
      { property: "og:description", content: "From early masterplanning to final fit-out, the studio offers a full spectrum of architecture and interior services." },
      { property: "og:image", content: media.interiorLiving },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

const imagesPool = [media.heroMain, media.heroAlt, media.interiorLiving, media.interiorBedroom, media.collageA, media.officeStudio];

export default function ServicesPage() {
  return (
    <main className="bg-background text-foreground pt-24">
      {/* ── Editorial header ───────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 pt-20 pb-12 md:px-10 md:pt-32">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-primary">— 01 / 06</p>
          </div>
          <div className="md:col-span-10">
            <h1 className="text-[clamp(2.5rem,8vw,7rem)] font-light leading-[0.95] tracking-tight">
              Six disciplines.<br />
              <em className="italic font-light text-primary">One</em> way of working.
            </h1>
            <p className="mt-10 max-w-xl text-[15px] leading-[1.8] text-muted-foreground">
              The studio holds your project end-to-end. Each discipline below has a dedicated lead — but the work flows between desks, so a decision made in planning is felt in the final detail.
            </p>
          </div>
        </div>
      </section>

      {/* ── Alternating large-number services ───────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10">
        {services.map((s, i) => {
          const left = i % 2 === 0;
          const img = imagesPool[i % imagesPool.length];
          return (
            <article key={s.title} className="grid items-center gap-12 border-t border-border/60 py-20 md:grid-cols-12 md:gap-16 md:py-32">
              <div className={`media-hover overflow-hidden md:col-span-6 ${left ? "md:order-1" : "md:order-2"}`}>
                <img src={img} alt={s.title} className="h-[420px] w-full object-cover md:h-[560px]" />
              </div>
              <div className={`md:col-span-5 ${left ? "md:order-2 md:col-start-8" : "md:order-1 md:col-start-1"}`}>
                <div className="text-[clamp(5rem,12vw,11rem)] font-extralight leading-[0.85] tracking-tighter text-foreground/10">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.4em] text-primary">— Discipline {String(i + 1).padStart(2, "0")}</p>
                <h2 className="mt-6 text-[clamp(2rem,3.5vw,3rem)] font-light leading-[1.05] tracking-tight">{s.title}</h2>
                <p className="mt-6 max-w-md text-[15px] leading-[1.8] text-muted-foreground">{s.description}</p>
                <Link to="/contact" className="story-link mt-10 inline-block text-[11px] font-medium uppercase tracking-[0.28em] text-foreground">
                  Discuss a {s.title.toLowerCase()} brief
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      {/* ── Process callout ───────────────────────────── */}
      <section className="relative mt-32 overflow-hidden">
        <div className="relative h-[55vh] min-h-[420px]">
          <BackgroundVideo src={pageVideos.services} poster={media.heroMain} />
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col items-start justify-center px-6 text-white md:px-10">
            <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-white/70">— Engagement</p>
            <h2 className="mt-6 max-w-3xl text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-[1.05] tracking-tight">
              We typically begin with a half-day briefing, on site.
            </h2>
            <Link to="/contact" className="btn-sheen mt-10 inline-flex items-center gap-3 border border-white/40 px-8 py-4 text-[11px] font-medium uppercase tracking-[0.28em] text-white hover:border-primary hover:bg-primary">
              Book a briefing <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
