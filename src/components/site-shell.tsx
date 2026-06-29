import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BackgroundVideo } from "@/components/background-video";
import {
  ArrowRight,
  Award,
  BedDouble,
  Book,
  Box,
  Building,
  Building2,
  Check,
  Compass,
  ChevronDown,
  ChevronRight,
  CirclePlay,
  ClipboardList,
  Clock3,
  FileText,
  Grid3x3,
  HardHat,
  Handshake,
  HeartHandshake,
  Home as HomeIcon,
  Instagram,
  Layers,
  Leaf,
  Lightbulb,
  Lightbulb as LightbulbIcon,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Phone,
  Puzzle,
  ShieldCheck,
  Sparkle,
  Sparkles,
  Target,
  Trophy,
  Twitter,
  X,
  Users,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { motion as M } from "framer-motion";
import { type ComponentType, type ReactNode, useEffect, useRef, useState } from "react";
import { useScroll, useTransform, useMotionValue, useSpring, motion } from "framer-motion";
import {
  blogPosts,
  faqItems,
  media,
  navItems,
  pageVideos,
  processSteps,
  projects,
  services,
  siteSettings,
  stats,
  teamLeads,
  teamMembers,
  values,
} from "@/lib/site-data";

type IconCmp = ComponentType<{ className?: string }>;

const statIcon: Record<string, IconCmp> = {
  building: Building2,
  badge: Award,
  heart: HeartHandshake,
  trophy: Trophy,
  users: Users,
};

const processIcon: Record<string, IconCmp> = {
  lightbulb: Lightbulb,
  file: FileText,
  cube: Box,
  clipboard: ClipboardList,
  helmet: HardHat,
};

const serviceIcon: Record<string, IconCmp> = {
  box: Box,
  cube: Layers,
  file: FileText,
  puzzle: Puzzle,
  helmet: HardHat,
  leaf: Leaf,
};

const categoryIcon: Record<string, IconCmp> = {
  All: Grid3x3,
  "All Projects": Grid3x3,
  Residential: HomeIcon,
  Commercial: Building,
  Educational: Book,
  Hospitality: BedDouble,
  "Mixed-use": Building2,
};

export function SiteHeader({ wordmark = "Design" }: { wordmark?: "Design" | "Decor" } = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (drawerOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
          scrolled
            ? "border-b border-border/60 bg-background/85 backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)]"
            : "border-b border-transparent bg-background/40 backdrop-blur-md",
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-[1240px] items-center justify-between gap-6 px-4 transition-all duration-500 md:px-6",
            scrolled ? "py-2.5" : "py-4",
          )}
        >
          <Link to="/" className="group flex items-center gap-3">
            <div className={cn(
              "grid place-items-center rounded-sm border border-border bg-background/90 backdrop-blur-sm transition-all duration-500 group-hover:-translate-y-0.5 group-hover:border-primary/50",
              scrolled ? "h-9 w-9" : "h-11 w-11",
            )}>
              <HomeIcon className="h-5 w-5 text-primary transition-transform duration-500 group-hover:rotate-[-6deg]" strokeWidth={1.5} />
            </div>
            <div className="leading-none">
              <div className={cn("font-semibold tracking-[0.22em] text-foreground transition-all duration-500", scrolled ? "text-base" : "text-lg")}>UPPAL</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.42em] text-muted-foreground">{wordmark}</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="nav-link group relative inline-flex items-center gap-1 px-3 py-2 text-[12px] font-medium uppercase tracking-[0.18em] text-foreground/75 transition-colors hover:text-foreground data-[status=active]:text-foreground"
              >
                <span className="relative">
                  {item.label}
                  <span className="pointer-events-none absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-primary transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-100 group-data-[status=active]:scale-x-100" />
                </span>
                {item.label === "Services" ? <ChevronDown className="h-3 w-3 opacity-70 transition-transform duration-300 group-hover:translate-y-0.5" /> : null}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild className="btn-sheen hidden h-10 rounded-sm px-5 uppercase tracking-[0.16em] text-[11px] md:inline-flex">
              <Link to="/contact">Get a Quote</Link>
            </Button>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
              className="group relative grid h-11 w-11 place-items-center overflow-hidden rounded-full border border-border bg-card text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
            >
              <span className="absolute inset-0 -z-10 translate-y-full bg-primary/10 transition-transform duration-500 group-hover:translate-y-0" />
              <Menu className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
            </button>
          </div>
        </div>
      </header>

      <MegaDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

function MegaDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] transition-opacity duration-500",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/45 backdrop-blur-sm"
      />
      <aside
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-[520px] flex-col overflow-y-auto border-l border-border bg-background shadow-[var(--shadow-strong)] transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)]",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <div className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Menu</div>
            <div className="text-lg font-semibold tracking-[0.18em]">UPPAL DESIGN</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card text-foreground transition hover:border-primary hover:text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col px-2 py-4">
          {navItems.map((item, i) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className="group flex items-center justify-between border-b border-border/60 px-5 py-5 text-2xl font-semibold uppercase tracking-[0.06em] text-foreground transition-colors hover:text-primary"
              style={{ transitionDelay: open ? `${120 + i * 50}ms` : "0ms" }}
            >
              <span className="relative overflow-hidden">
                <span className="block transition-transform duration-500 group-hover:-translate-y-full">{item.label}</span>
                <span className="absolute inset-0 block translate-y-full text-primary transition-transform duration-500 group-hover:translate-y-0">{item.label}</span>
              </span>
              <ArrowRight className="h-5 w-5 -translate-x-2 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
            </Link>
          ))}
        </nav>

        <div className="mt-auto grid grid-cols-3 gap-2 border-t border-border p-4">
          {[media.project1, media.project2, media.project3].map((src, i) => (
            <Link
              key={i}
              to="/projects"
              onClick={onClose}
              className="group relative aspect-[4/5] overflow-hidden bg-muted"
            >
              <img src={src} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
              <span className="absolute bottom-2 left-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-background">Project 0{i + 1}</span>
            </Link>
          ))}
        </div>

        <div className="border-t border-border px-6 py-5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> {siteSettings.phone}</div>
          <div className="mt-2 flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> {siteSettings.email}</div>
        </div>
      </aside>
    </div>
  );
}


export function SiteFooter({
  wordmark = "Design",
  variant = "default",
}: {
  wordmark?: "Design" | "Decor";
  variant?: "default" | "minimal";
} = {}) {
  if (variant === "minimal") {
    return (
      <footer className="relative isolate overflow-hidden border-t border-border/60 bg-neutral-950 text-neutral-200">
        <BackgroundVideo src={pageVideos.footer} poster={media.heroMain} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80" />
        <div className="relative mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-neutral-300 md:flex-row md:px-6">
          <p>© 2024 Uppal {wordmark}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="cursor-pointer transition-colors hover:text-primary">Privacy Policy</span>
            <span className="cursor-pointer transition-colors hover:text-primary">Terms &amp; Conditions</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-[0.18em] text-neutral-100">Follow Us</span>
            {[Instagram, Linkedin, Twitter, Mail].map((Icon, i) => (
              <button
                key={i}
                type="button"
                aria-label="social"
                className="grid h-8 w-8 place-items-center rounded-full border border-white/30 bg-white/10 text-primary backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        </div>
      </footer>
    );
  }
  return (
    <footer className="relative isolate overflow-hidden border-t border-border/60 bg-neutral-950 text-neutral-200">
      <BackgroundVideo src={pageVideos.footer} poster={media.heroMain} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/65 to-black/85" />
      <div className="relative mx-auto grid max-w-[1200px] gap-12 px-4 py-16 md:grid-cols-[1.2fr_0.9fr_0.9fr_1fr] md:px-6">
        <div className="space-y-5">
          <div>
            <div className="text-lg font-semibold tracking-[0.22em] text-white">UPPAL</div>
            <div className="text-xs uppercase tracking-[0.34em] text-neutral-300">{wordmark}</div>
          </div>
          <p className="max-w-sm text-sm leading-7 text-neutral-300">
            We create spaces that inspire, endure, and elevate the art of living.
          </p>
        </div>
        <FooterList
          title="Quick Links"
          items={navItems.map((item) => ({ label: item.label, to: item.to }))}
        />
        <FooterList
          title="Our Services"
          items={services.slice(0, 5).map((service) => ({ label: service.title, to: "/services" }))}
        />
        <div className="space-y-4 text-sm text-neutral-300">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">Contact Us</h3>
          <p>{siteSettings.phone}</p>
          <p>{siteSettings.email}</p>
          <p>{siteSettings.address}</p>
        </div>
      </div>
      <div className="relative border-t border-white/15">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-4 py-5 text-sm text-neutral-300 md:flex-row md:items-center md:justify-between md:px-6">
          <p>© 2024 Uppal {wordmark}. All Rights Reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Terms &amp; Conditions</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterList({ title, items }: { title: string; items: { label: string; to: string }[] }) {
  return (
    <div className="space-y-4 text-sm text-neutral-300">
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">{title}</h3>
      <div className="grid gap-3">
        {items.map((item) => (
          <Link key={`${title}-${item.label}`} to={item.to} className="transition-colors hover:text-primary">
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function PageFrame({ children }: { children: ReactNode }) {
  return <div className="bg-background text-foreground">{children}</div>;
}

export function HeroSection({
  eyebrow,
  title,
  highlight,
  description,
  primaryLabel = "Start Your Project",
  primaryTo = "/contact",
  secondaryLabel,
  secondaryTo,
  image = media.heroMain,
  videoSrc,
  showVideo,
  darkPlay = false,
  showPlay = true,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  description: string;
  primaryLabel?: string;
  primaryTo?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
  image?: string;
  videoSrc?: string;
  showVideo?: boolean;
  darkPlay?: boolean;
  showPlay?: boolean;
  compact?: boolean;
}) {
  const useVideo = showVideo ?? Boolean(videoSrc);
  const src = videoSrc ?? media.video;
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-[radial-gradient(circle_at_top_left,var(--color-surface-soft),transparent_38%)]">
      <div className={cn(
        "mx-auto grid max-w-[1200px] gap-8 px-4 md:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center",
        compact ? "pb-10 pt-10 lg:pt-12" : "pb-12 pt-12 lg:pt-16",
      )}>
        <div className="relative z-10 max-w-xl space-y-6 reveal-up">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">{eyebrow}</p>
          <h1 className="max-w-[12ch] text-4xl font-semibold leading-[1.05] md:text-6xl word-reveal">
            {title}
            {highlight ? <span className="block">{highlight}</span> : null}
          </h1>
          <p className="max-w-md text-base leading-8 text-muted-foreground md:text-lg">{description}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="btn-sheen group rounded-sm px-6 uppercase tracking-[0.16em] text-xs">
              <Link to={primaryTo}>
                {primaryLabel}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            {secondaryLabel && secondaryTo ? (
              <Button asChild size="lg" variant="outline" className="btn-sheen group rounded-sm px-6 uppercase tracking-[0.16em] text-xs">
                <Link to={secondaryTo}>
                  {secondaryLabel}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
        <div className={cn(
          "group relative overflow-hidden rounded-none border border-border/40 bg-card shadow-[var(--shadow-soft)]",
          !useVideo && "media-hover",
          compact ? "min-h-[320px] lg:min-h-[420px]" : "min-h-[360px] lg:min-h-[520px]",
        )}>
          {useVideo ? (
            <BackgroundVideo src={src} poster={image} alt={title} />
          ) : (
            <img src={image} alt={title} className="hero-drift h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.08]" loading="eager" />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-background/45" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.35))] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          {showPlay ? (
            <div className="absolute bottom-6 right-6 flex items-center gap-3 rounded-full border border-white/20 bg-background/85 px-4 py-3 shadow-[var(--shadow-soft)] transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-background">
              <CirclePlay className={cn("h-5 w-5 transition-transform duration-500 group-hover:scale-110", darkPlay ? "text-foreground" : "text-primary")} />
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-foreground">Play Showreel</span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function StatsBand() {
  return (
    <section className="border-b border-border/60 bg-background">
      <div className="mx-auto grid max-w-[1200px] gap-4 px-4 py-8 md:grid-cols-5 md:px-6">
        {stats.map((stat) => {
          const Icon = statIcon[stat.icon] ?? Award;
          return (
            <div key={stat.label} className="group flex items-center gap-4 border-r border-border/50 py-3 last:border-r-0 transition-colors hover:bg-primary/5 rounded-sm pl-2">
              <Icon className="h-7 w-7 text-primary transition-transform duration-500 group-hover:rotate-[8deg] group-hover:scale-110" />
              <div>
                <div className="text-2xl font-semibold">{stat.value}</div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function IntroSplit() {
  return (
    <section className="border-b border-border/60 bg-background py-20">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 md:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div className="space-y-6 reveal-up">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">About Us</p>
          <h2 className="max-w-[12ch] text-3xl font-semibold leading-tight md:text-5xl">Designing Spaces, Elevating Lives.</h2>
          <p className="max-w-md text-base leading-8 text-muted-foreground">
            At Uppal Design, we believe architecture is more than buildings — it is about creating meaningful spaces that enhance the way people live, work, and connect.
          </p>
          <Button asChild className="btn-sheen rounded-sm px-6 uppercase tracking-[0.16em] text-xs">
            <Link to="/about">More About Us</Link>
          </Button>
        </div>
        <div className="relative h-[460px]">
          <div className="media-hover absolute left-0 top-4 h-[300px] w-[58%] overflow-hidden shadow-[var(--shadow-soft)]">
            <img src={media.collageA} alt="London skyline" className="h-full w-full object-cover" loading="lazy" />
          </div>
          <div className="media-hover absolute left-[28%] top-0 h-[220px] w-[42%] overflow-hidden border-4 border-background shadow-[var(--shadow-soft)]">
            <img src={media.collageB} alt="Glass tower" className="h-full w-full object-cover" loading="lazy" />
          </div>
          <div className="media-hover absolute right-0 bottom-12 h-[260px] w-[55%] overflow-hidden border-4 border-background shadow-[var(--shadow-soft)]">
            <img src={media.collageC} alt="Curved modern architecture" className="h-full w-full object-cover" loading="lazy" />
          </div>
          <div className="absolute right-4 top-8 z-10 border border-primary/30 bg-background px-6 py-5 shadow-[var(--shadow-soft)] text-center">
            <div className="text-4xl font-semibold text-primary">15+</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Years of<br/>Experience</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProcessBand() {
  return (
    <section className="border-b border-border/60 bg-background py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">Our Design Process</p>
            <h2 className="text-3xl font-semibold leading-tight md:text-5xl">From Concept to Creation</h2>
          </div>
          <p className="max-w-xl text-base leading-8 text-muted-foreground">
            A seamless process that ensures precision, transparency, and excellence at every step.
          </p>
        </div>
        <div className="relative grid gap-6 md:grid-cols-5">
          <div className="absolute left-[10%] right-[10%] top-[2.25rem] hidden h-px bg-border md:block" aria-hidden="true" />
          {processSteps.map((step) => {
            const Icon = processIcon[step.icon] ?? Sparkles;
            return (
              <div key={step.number} className="group relative space-y-4 text-center">
                <div className="mx-auto grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full border border-border bg-card shadow-[var(--shadow-soft)] transition-all duration-500 group-hover:-translate-y-1 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6 text-primary transition-colors duration-500 group-hover:text-primary-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{step.number}</p>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.12em]">{step.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{step.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-10 flex justify-center">
          <Button asChild variant="outline" className="btn-sheen rounded-sm px-6">
            <Link to="/process">View Our Process</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function ProjectsShowcase({ intro = true }: { intro?: boolean }) {
  return (
    <section className="border-b border-border/60 bg-background py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        {intro ? (
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">Featured Projects</p>
              <h2 className="text-3xl font-semibold leading-tight md:text-5xl">Discover Our Work</h2>
            </div>
            <Button asChild className="btn-sheen rounded-sm px-6">
              <Link to="/projects">View All Projects</Link>
            </Button>
          </div>
        ) : null}
        <div className="mb-8 flex flex-wrap gap-3">
          {["All", "Residential", "Commercial", "Educational", "Hospitality"].map((item, index) => {
            const Icon = categoryIcon[item] ?? Grid3x3;
            return (
              <div
                key={item}
                className={cn(
                  "group inline-flex cursor-pointer items-center gap-2 rounded-full border px-5 py-2 text-sm transition-all duration-300 hover:border-primary hover:text-primary",
                  index === 0 ? "border-primary/40 bg-primary/8 text-primary" : "border-border text-muted-foreground",
                )}
              >
                <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                <span className="uppercase tracking-[0.14em] text-xs">{item}</span>
              </div>
            );
          })}
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  return (
    <article className="project-tile group overflow-hidden border border-border bg-card shadow-[var(--shadow-soft)]">
      <div className="media-hover relative overflow-hidden">
        <img src={project.image} alt={project.title} className="h-56 w-full object-cover" loading="lazy" />
        {project.featured ? (
          <span className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1 bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary-foreground shadow-[var(--shadow-soft)]">
            Featured
          </span>
        ) : null}
      </div>
      <div className="space-y-3 p-5">
        <div>
          <h3 className="text-lg font-semibold transition-colors duration-300 group-hover:text-primary">{project.title}</h3>
          <p className="text-sm text-muted-foreground">{project.location}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
          {project.category}
        </span>
      </div>
    </article>
  );
}

export function ServicesGrid() {
  return (
    <section className="border-b border-border/60 bg-background py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">Our Services</p>
            <h2 className="text-3xl font-semibold leading-tight md:text-5xl">Comprehensive Architectural Solutions</h2>
          </div>
          <div className="flex justify-end">
            <Button asChild className="btn-sheen rounded-sm px-6">
              <Link to="/services">View All Services</Link>
            </Button>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {services.slice(0, 5).map((service) => {
            const Icon = serviceIcon[service.icon] ?? Building2;
            return (
              <div key={service.title} className="lift-card group border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
                <div className="mb-5 inline-flex rounded-full border border-primary/20 bg-primary/8 p-3 text-primary transition-all duration-500 group-hover:rotate-[8deg] group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-3 text-base font-semibold uppercase tracking-[0.08em] transition-colors duration-300 group-hover:text-primary">{service.title}</h3>
                <p className="text-sm leading-7 text-muted-foreground">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function BlogAndQuoteBand() {
  return (
    <section className="border-b border-border/60 bg-background py-20">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-4 md:px-6 lg:grid-cols-[0.56fr_0.44fr]">
        <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
          <div className="space-y-5">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">Blog & Insights</p>
              <h2 className="text-3xl font-semibold leading-tight">Latest Articles</h2>
            </div>
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
              View All Articles <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4">
            {blogPosts.slice(0, 3).map((post) => (
              <article key={post.title} className="grid grid-cols-[100px_1fr] gap-4 border border-border bg-card p-3 shadow-[var(--shadow-soft)]">
                <img src={post.image} alt={post.title} className="h-24 w-full object-cover" loading="lazy" />
                <div className="space-y-2">
                  <h3 className="line-clamp-2 text-base font-semibold">{post.title}</h3>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{post.date}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="grid gap-0 overflow-hidden border border-border bg-card shadow-[var(--shadow-soft)] lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative min-h-[380px]">
            <img src={media.heroAlt} alt="Architecture contact visual" className="h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </div>
          <form className="grid gap-4 p-6">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">Get in Touch</p>
              <h2 className="text-3xl font-semibold">Request a Quote</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input className="h-12 border border-input bg-background px-4 text-sm outline-none" placeholder="Your Name" />
              <input className="h-12 border border-input bg-background px-4 text-sm outline-none" placeholder="Email Address" />
              <input className="h-12 border border-input bg-background px-4 text-sm outline-none" placeholder="Phone Number" />
              <input className="h-12 border border-input bg-background px-4 text-sm outline-none" placeholder="Project Type" />
            </div>
            <textarea className="min-h-[126px] border border-input bg-background px-4 py-3 text-sm outline-none" placeholder="Your Message" />
            <Button className="btn-sheen w-fit rounded-sm px-6">Send Request</Button>
          </form>
        </div>
      </div>
    </section>
  );
}

export function ContactStrip() {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-[radial-gradient(circle_at_bottom_right,var(--color-surface-soft),transparent_42%)] py-20">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-4 md:px-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Let’s Build Something Extraordinary</p>
          <h2 className="max-w-[14ch] text-3xl font-semibold leading-tight md:text-5xl">Have a Project in Mind?</h2>
          <p className="max-w-md text-base leading-8 text-muted-foreground">
            We would love to hear your ideas and help turn them into intelligent, inspiring spaces.
          </p>
          <Button asChild className="btn-sheen rounded-sm px-6">
            <Link to="/contact">Get in Touch</Link>
          </Button>
        </div>
        <div className="relative min-h-[320px] overflow-hidden">
          <img src={media.heroMain} alt="Premium architecture exterior" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/10 to-transparent" />
        </div>
      </div>
    </section>
  );
}

export function AboutPageContent() {
  return (
    <>
      <HeroSection
        eyebrow="About Us"
        title="Designing with Intelligence."
        highlight="Building with Purpose."
        description="At Uppal Decor, we believe architecture is more than buildings — it shapes lives, our cities, and the future. Discover the story, values, and people behind our timeless spaces."
        primaryLabel="Explore Our Work"
        primaryTo="/projects"
        image={media.heroAlt}
        videoSrc={pageVideos.about}
        showPlay={false}
        compact
      />
      <AboutIntroSplit />
      <StoryMissionValues />
      <AboutStatsRow />
      <FounderQuoteBand />
      <AboutTeamSection />
      <AboutCTABand />
    </>
  );
}

function AboutIntroSplit() {
  return (
    <section className="border-b border-border/60 bg-background py-20 md:py-24">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-4 md:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-6 reveal-up">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Who We Are</p>
          <h2 className="max-w-[16ch] text-4xl font-semibold leading-[1.1] md:text-5xl">
            Designing Spaces,<br />Elevating Lives.
          </h2>
          <p className="max-w-xl text-base leading-8 text-muted-foreground">
            Founded with a vision to redefine architectural excellence, Uppal Decor has spent over fifteen years crafting environments where form, function, and feeling converge. From private residences to landmark commercial developments, our work reflects an unwavering pursuit of detail.
          </p>
          <p className="max-w-xl text-base leading-8 text-muted-foreground">
            We are storytellers, problem-solvers, and stewards of the built environment — guided by a belief that thoughtful design has the power to transform how people live, work, and connect.
          </p>
          <div className="pt-2" style={{ fontFamily: "'Brush Script MT', cursive" }}>
            <span className="text-3xl text-foreground/80">Ar. Anugam Uppal</span>
          </div>
          <Button asChild size="lg" className="btn-sheen group rounded-sm px-6 uppercase tracking-[0.16em] text-xs">
            <Link to="/projects">
              More About Us
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        <div className="relative h-[520px]">
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(circle, oklch(0.68 0.095 63 / 0.35) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
            aria-hidden
          />
          <div className="media-hover absolute left-0 top-0 h-[300px] w-[58%] overflow-hidden shadow-[var(--shadow-soft)]">
            <img src={media.heroAlt} alt="Project" className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] hover:scale-[1.06]" loading="lazy" />
          </div>
          <div className="media-hover absolute right-0 top-16 h-[260px] w-[48%] overflow-hidden border-4 border-background shadow-[var(--shadow-soft)]">
            <img src={media.interiorLiving} alt="Interior" className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] hover:scale-[1.06]" loading="lazy" />
          </div>
          <div className="media-hover absolute bottom-0 left-12 h-[240px] w-[52%] overflow-hidden border-4 border-background shadow-[var(--shadow-soft)]">
            <img src={media.heroMain} alt="Facade" className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] hover:scale-[1.06]" loading="lazy" />
          </div>
          <div className="absolute bottom-4 right-4 z-10 flex flex-col items-center justify-center bg-primary px-6 py-5 text-primary-foreground shadow-[var(--shadow-soft)] transition-transform duration-500 hover:-translate-y-1 hover:rotate-1">
            <span className="text-4xl font-semibold leading-none">15+</span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em]">Years of Excellence</span>
          </div>
        </div>
      </div>
    </section>
  );
}

const aboutValues = [
  { label: "Innovation", desc: "Pushing boundaries with new ideas", icon: LightbulbIcon },
  { label: "Sustainability", desc: "Designs that respect the planet", icon: Leaf },
  { label: "Collaboration", desc: "Listening, partnering, co-creating", icon: Handshake },
  { label: "Excellence", desc: "Crafted to the highest standard", icon: Sparkle },
];

function StoryMissionValues() {
  return (
    <section className="border-b border-border/60 bg-[var(--color-surface-soft)] py-20 md:py-24">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-4 md:px-6 lg:grid-cols-3">
        <div className="space-y-4 reveal-up">
          <div className="flex items-center gap-3">
            <Book className="h-5 w-5 text-primary" />
            <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Our Story</h3>
          </div>
          <h4 className="text-2xl font-semibold leading-tight">A Legacy of Thoughtful Design</h4>
          <p className="text-base leading-8 text-muted-foreground">
            From a small studio with a single drafting table to an award-winning practice, our journey has been defined by curiosity, craft, and an enduring commitment to the communities we serve.
          </p>
        </div>
        <div className="group space-y-5 border border-border bg-card p-8 shadow-[var(--shadow-soft)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
              <Target className="h-5 w-5" />
            </span>
            <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Our Mission</h3>
          </div>
          <h4 className="text-2xl font-semibold leading-tight">Architecture with Intent</h4>
          <p className="text-base leading-8 text-muted-foreground">
            To create intelligent architectural solutions that inspire, enrich lives, and contribute positively to the environment and communities we touch — one carefully considered space at a time.
          </p>
        </div>
        <div className="group space-y-5 border border-border bg-card p-8 shadow-[var(--shadow-soft)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </span>
            <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Our Values</h3>
          </div>
          <div className="grid gap-4">
            {aboutValues.map(({ label, desc, icon: Icon }) => (
              <div key={label} className="flex items-start gap-3 transition-transform duration-300 hover:translate-x-1">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center border border-border bg-background text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-foreground">{label}</div>
                  <div className="text-sm text-muted-foreground">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutStatsRow() {
  const items = [
    { value: "150+", label: "Projects Delivered", icon: Building2 },
    { value: "15+", label: "Years of Experience", icon: Clock3 },
    { value: "98%", label: "Client Satisfaction", icon: HeartHandshake },
    { value: "25+", label: "Industry Awards", icon: Trophy },
    { value: "40+", label: "Expert Team", icon: Users },
  ];
  return (
    <section className="border-b border-border/60 bg-background py-16">
      <div className="mx-auto grid max-w-[1200px] gap-6 px-4 md:px-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {items.map(({ value, label, icon: Icon }) => (
          <div key={label} className="group flex flex-col items-center text-center transition-transform duration-500 hover:-translate-y-1">
            <span className="mb-3 grid h-12 w-12 place-items-center rounded-full border border-border text-primary transition-colors duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="h-5 w-5" />
            </span>
            <div className="text-3xl font-semibold text-foreground md:text-4xl">{value}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FounderQuoteBand() {
  return (
    <section className="border-b border-border/60 bg-[var(--color-surface-soft)] py-20 md:py-24">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-4 md:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="media-hover relative h-[480px] overflow-hidden shadow-[var(--shadow-soft)]">
          <img src={media.founder} alt="Ar. Anugam Uppal — Founder" className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)] hover:scale-[1.05]" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 text-background">
            <div className="text-lg font-semibold">Ar. Anugam Uppal</div>
            <div className="text-xs uppercase tracking-[0.22em] opacity-90">Founder &amp; Principal Architect</div>
          </div>
        </div>
        <div className="relative border border-border bg-card p-10 shadow-[var(--shadow-soft)] md:p-12">
          <span className="absolute -top-6 left-8 select-none text-[110px] leading-none text-primary/30" aria-hidden>“</span>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">A Word From Our Founder</p>
          <h3 className="mt-4 max-w-[20ch] text-3xl font-semibold leading-tight md:text-4xl">
            Architecture is a responsibility — and a privilege.
          </h3>
          <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground">
            Every project we take on is an opportunity to shape a better future. Beyond walls and materials, we are here to craft places that transform lives, honor context, and stand the test of time.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <span className="h-px w-12 bg-primary" />
            <div>
              <div className="text-sm font-semibold text-foreground">Ar. Anugam Uppal</div>
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Founder, Uppal Decor</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutTeamSection() {
  return (
    <section className="border-b border-border/60 bg-background py-20 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Our Team</p>
            <h2 className="text-4xl font-semibold leading-tight md:text-5xl">The Minds Behind the Spaces</h2>
            <p className="text-base leading-8 text-muted-foreground">
              A multidisciplinary studio of architects, designers, and strategists united by a passion for meaningful, enduring design.
            </p>
          </div>
          <Link to="/team" className="story-link inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Meet the Full Team <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <TeamBand compact />
      </div>
    </section>
  );
}

function AboutCTABand() {
  const contactItems = [
    { icon: Phone, label: "Call Us", value: siteSettings.phone },
    { icon: Mail, label: "Email Us", value: siteSettings.email },
    { icon: MapPin, label: "Visit Studio", value: siteSettings.address },
  ];
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="absolute inset-0">
        <BackgroundVideo src={pageVideos.cta} poster={media.heroMain} alt="Architectural ambience" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/80 to-foreground/55" />
      </div>
      <div className="relative mx-auto grid max-w-[1200px] gap-10 px-4 py-20 md:px-6 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-5 text-background">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Get In Touch</p>
          <h2 className="max-w-[16ch] text-4xl font-semibold leading-tight md:text-5xl">
            Let&apos;s Build Something Extraordinary Together.
          </h2>
          <p className="max-w-xl text-base leading-8 text-background/80">
            Whether it&apos;s a residence, a workplace, or a landmark — we&apos;d love to hear your vision and explore how we can bring it to life.
          </p>
          <div className="pt-2">
            <Button asChild size="lg" className="btn-sheen group rounded-sm bg-primary px-7 uppercase tracking-[0.16em] text-xs text-primary-foreground hover:bg-primary/90">
              <Link to="/contact">
                Start Your Project
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="grid gap-4">
          {contactItems.map(({ icon: Icon, label, value }) => (
            <div key={label} className="group flex items-center gap-5 border border-background/20 bg-background/10 p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-background/15">
              <span className="grid h-12 w-12 shrink-0 place-items-center bg-primary text-primary-foreground transition-transform duration-500 group-hover:scale-110">
                <Icon className="h-5 w-5" />
              </span>
              <div className="text-background">
                <div className="text-xs uppercase tracking-[0.2em] text-primary">{label}</div>
                <div className="mt-1 text-base">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



export function ServicesPageContent() {
  return (
    <>
      <HeroSection
        eyebrow="Our Services"
        title="Comprehensive"
        highlight="Architectural Solutions."
        description="From concept to completion, we provide fully integrated architectural and design services that turn your vision into reality with precision."
        primaryLabel="Discuss Your Project"
        secondaryLabel="View Our Work"
        secondaryTo="/projects"
        image={media.heroMain}
        videoSrc={pageVideos.services}
      />
      <ServicesIntro />
      <ServicesFiveGrid />
      <WhyChooseUsBand />
      <ServicesProcessTeaser />
      <ServicesCTA />
    </>
  );
}

const easeOut = [0.22, 1, 0.36, 1] as const;

function MaskReveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <M.div
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.85, ease: easeOut, delay }}
      className={className}
    >
      {children}
    </M.div>
  );
}

function ServicesIntro() {
  return (
    <section className="border-b border-border/60 bg-background py-20">
      <div className="mx-auto max-w-[900px] px-4 text-center md:px-6">
        <MaskReveal>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-primary">What We Do</p>
        </MaskReveal>
        <MaskReveal delay={0.08}>
          <h2 className="text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl">End-to-End Architectural Services</h2>
        </MaskReveal>
        <MaskReveal delay={0.16}>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground">
            We combine innovative ideas with expertise and industry best practices to deliver solutions that are functional, sustainable, and timeless.
          </p>
        </MaskReveal>
        <MaskReveal delay={0.24}>
          <div className="mx-auto mt-8 h-px w-16 bg-primary/60" />
        </MaskReveal>
      </div>
    </section>
  );
}

const fiveServices = [
  { title: "BIM Modelling", icon: Box },
  { title: "3D Visualization", icon: Layers },
  { title: "Planning Drawings", icon: FileText },
  { title: "Structural Design", icon: Compass },
  { title: "Construction Support", icon: HardHat },
];

function ServicesFiveGrid() {
  return (
    <section className="border-b border-border/60 bg-[color:var(--color-surface-soft)] py-20">
      <div className="mx-auto max-w-[1240px] px-4 md:px-6">
        <M.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
        >
          {fiveServices.map(({ title, icon: Icon }) => (
            <M.div
              key={title}
              variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } } }}
              className="group relative overflow-hidden border border-border/70 bg-background p-7 text-center transition-all duration-500 ease-out hover:-translate-y-2 hover:border-primary/40 hover:shadow-xl"
            >
              <div className="pointer-events-none absolute inset-x-0 -top-px h-[2px] origin-left scale-x-0 bg-gradient-to-r from-transparent via-primary to-transparent transition-transform duration-700 ease-out group-hover:scale-x-100" />
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-primary/20 bg-primary/5 text-primary transition-all duration-500 ease-out group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors duration-500 group-hover:text-primary">
                {title}
              </h3>
              <div className="mx-auto mt-4 h-px w-6 bg-border transition-all duration-500 group-hover:w-12 group-hover:bg-primary" />
            </M.div>
          ))}
        </M.div>
      </div>
    </section>
  );
}

const whyBullets = [
  "Integrated design & delivery approach",
  "Experienced architects & engineers",
  "Advanced tools & technology",
  "Timely delivery & transparent process",
];

const whyStats = [
  { value: "250+", label: "Projects Completed" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "15+", label: "Years of Experience" },
];

const whyImages = [
  { src: media.project1, alt: "Modern commercial facade" },
  { src: media.project2, alt: "Residential exterior" },
  { src: media.collageC, alt: "Curved architectural detail" },
];

function WhyChooseUsBand() {
  return (
    <section className="border-b border-border/60 bg-background py-24">
      <div className="mx-auto grid max-w-[1240px] gap-14 px-4 md:px-6 lg:grid-cols-2 lg:items-start">
        <div className="space-y-7">
          <MaskReveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-primary">Why Choose Us</p>
          </MaskReveal>
          <MaskReveal delay={0.08}>
            <h2 className="max-w-[14ch] text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
              Design Expertise <span className="text-primary">You Can Rely On.</span>
            </h2>
          </MaskReveal>
          <MaskReveal delay={0.16}>
            <p className="max-w-md text-base leading-8 text-muted-foreground">
              Every project is anchored in clarity, craft, and accountability — bringing together strategy, design, and delivery under one team.
            </p>
          </MaskReveal>
          <M.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}
            className="space-y-3"
          >
            {whyBullets.map((item) => (
              <M.li
                key={item}
                variants={{ hidden: { opacity: 0, x: -28 }, show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: easeOut } } }}
                className="group flex items-center gap-4 border-l-2 border-primary/30 bg-[color:var(--color-surface-soft)] px-5 py-3 transition-all duration-500 hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="text-sm font-medium text-foreground">{item}</span>
              </M.li>
            ))}
          </M.ul>
          <MaskReveal delay={0.3}>
            <Button asChild className="btn-sheen group rounded-sm px-6">
              <Link to="/about">
                Learn More About Us
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </MaskReveal>
        </div>

        <div className="space-y-6">
          <M.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
            className="grid grid-cols-3 gap-4"
          >
            {whyStats.map((s) => (
              <M.div
                key={s.label}
                variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } } }}
                className="group relative overflow-hidden border border-border/70 bg-background p-6 text-center transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
              >
                <div className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">{s.value}</div>
                <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{s.label}</div>
              </M.div>
            ))}
          </M.div>

          <M.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.14 } } }}
            className="grid grid-cols-3 gap-4"
          >
            {whyImages.map((img) => (
              <M.div
                key={img.src}
                variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOut } } }}
                className="group relative aspect-[3/4] overflow-hidden"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/30" />
                <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="h-px w-8 bg-primary" />
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">{img.alt}</p>
                </div>
              </M.div>
            ))}
          </M.div>
        </div>
      </div>
    </section>
  );
}

function ServicesProcessTeaser() {
  const steps = [
    { n: "01", t: "Concept" },
    { n: "02", t: "Planning" },
    { n: "03", t: "Visualization" },
    { n: "04", t: "Documentation" },
    { n: "05", t: "Construction" },
  ];
  return (
    <section className="border-b border-border/60 bg-[color:var(--color-surface-soft)] py-24">
      <div className="mx-auto max-w-[1240px] px-4 text-center md:px-6">
        <MaskReveal>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-primary">Our Process</p>
        </MaskReveal>
        <MaskReveal delay={0.08}>
          <h2 className="mx-auto max-w-[18ch] text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
            A Seamless Journey From Concept to Completion
          </h2>
        </MaskReveal>
        <MaskReveal delay={0.16}>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
            A clear five-stage method built around collaboration, precision, and an uncompromising standard at every step.
          </p>
        </MaskReveal>

        <div className="relative mt-16">
          <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-border md:block" />
          <M.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: easeOut }}
            className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px origin-left bg-primary md:block"
          />
          <M.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.18 } } }}
            className="relative grid grid-cols-2 gap-y-10 md:grid-cols-5"
          >
            {steps.map((s) => (
              <M.div
                key={s.n}
                variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } } }}
                className="group flex flex-col items-center"
              >
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-primary/40 bg-background text-sm font-semibold text-primary transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-[0_0_0_8px_color-mix(in_oklab,var(--color-primary)_15%,transparent)]">
                  {s.n}
                </div>
                <div className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground transition-colors duration-500 group-hover:text-primary">
                  {s.t}
                </div>
              </M.div>
            ))}
          </M.div>
        </div>
      </div>
    </section>
  );
}

function ServicesCTA() {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-background py-24">
      <div className="absolute inset-0 -z-10 opacity-[0.06] [background-image:radial-gradient(var(--color-foreground)_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="mx-auto max-w-[1100px] px-4 text-center md:px-6">
        <MaskReveal>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-primary">Ready to start your project?</p>
        </MaskReveal>
        <MaskReveal delay={0.08}>
          <h2 className="mx-auto max-w-[18ch] text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Let’s Build Something <span className="italic text-primary">Extraordinary</span> Together.
          </h2>
        </MaskReveal>
        <MaskReveal delay={0.16}>
          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-muted-foreground">
            Share a few details and our team will reach out within one business day to start the conversation.
          </p>
        </MaskReveal>

        <MaskReveal delay={0.24}>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mx-auto mt-10 flex max-w-xl flex-col items-stretch gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="h-12 flex-1 rounded-sm border border-border bg-background px-4 text-sm outline-none transition-all duration-300 placeholder:text-muted-foreground/70 focus:border-primary focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-primary)_15%,transparent)]"
            />
            <Button type="submit" className="btn-sheen group h-12 rounded-sm px-6">
              Start the Conversation
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </form>
        </MaskReveal>

        <MaskReveal delay={0.32}>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-primary" /> Free initial consultation</span>
            <span className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-primary" /> Response within 24 hours</span>
            <span className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-primary" /> NDA on request</span>
          </div>
        </MaskReveal>
      </div>
    </section>
  );
}


export function ProjectsPageContent() {
  return (
    <>
      <HeroSection
        eyebrow="Our Projects"
        title="Spaces Designed."
        highlight="Stories Elevated."
        description="Explore our portfolio of thoughtfully designed architecture that blends intelligence, aesthetics, and purpose to create lasting impact."
        primaryLabel="Start a Project"
        secondaryLabel="View Our Process"
        secondaryTo="/process"
        image={media.heroMain}
        videoSrc={pageVideos.projects}
      />
      <CategoryBand />
      <FeaturedProjectsSplit />
      <ProjectsShowcase intro={false} />
      <ContactStrip />
    </>
  );
}

function CategoryBand() {
  return (
    <section className="border-b border-border/60 bg-background py-6">
      <div className="mx-auto flex max-w-[1200px] flex-wrap gap-3 px-4 md:px-6">
        {["All Projects", "Residential", "Commercial", "Educational", "Hospitality", "Mixed-use"].map((item, index) => {
          const key = item === "All Projects" ? "All" : item;
          const Icon = categoryIcon[key] ?? Grid3x3;
          return (
            <div
              key={item}
              className={cn(
                "group inline-flex cursor-pointer items-center gap-2 rounded-full border px-5 py-3 text-sm transition-all duration-300 hover:border-primary hover:text-primary",
                index === 0 ? "border-primary/40 bg-primary/8 text-primary" : "border-border text-muted-foreground",
              )}
            >
              <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              <span className="uppercase tracking-[0.14em] text-xs">{item}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FeaturedProjectsSplit() {
  return (
    <section className="border-b border-border/60 bg-background py-20">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-4 md:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Featured Projects</p>
          <h2 className="max-w-[12ch] text-3xl font-semibold leading-tight md:text-5xl">Signature Creations That Inspire.</h2>
          <p className="max-w-md text-base leading-8 text-muted-foreground">
            A curated selection of our most impactful projects, harmonizing design excellence and attention to detail.
          </p>
          <Button asChild className="btn-sheen rounded-sm px-6"><Link to="/projects">View All Projects</Link></Button>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {projects.slice(1, 4).map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProcessPageContent() {
  return (
    <>
      <HeroSection
        eyebrow="Our Process"
        title="From Concept to Creation."
        highlight="Excellence at Every Step."
        description="A structured, transparent, and collaborative journey that turns your vision into intelligent spaces that inspire and elevate everyday living."
        primaryLabel="Start Your Project"
        secondaryLabel="View Our Projects"
        secondaryTo="/projects"
        image={media.heroAlt}
        videoSrc={pageVideos.process}
      />
      <ProcessTimeline />
      <ProcessPrinciples />
      <DetailedProcessAlternating />
      <ProcessMarquee />
      <ValueGrid4 />
      <ProcessTestimonial />
      <ProcessFaq />
      <ProcessCTA />
      <ContactStrip />
    </>
  );
}

function ProcessPrinciples() {
  const items = [
    { k: "01", t: "Listen First", d: "Every great project begins with deep understanding of the people who will live and work within it." },
    { k: "02", t: "Design With Intent", d: "Each detail is deliberate — proportion, material, light, and flow tuned to the brief." },
    { k: "03", t: "Build To Last", d: "Specification choices that respect time, weather, and the way real life is lived." },
  ];
  return (
    <section className="relative isolate overflow-hidden border-b border-border/60 bg-neutral-950 py-24 text-neutral-100">
      <BackgroundVideo src={pageVideos.process} poster={media.heroMain} />
      <div className="absolute inset-0 -z-0 bg-gradient-to-b from-black/85 via-black/75 to-black/90" />
      <div className="relative mx-auto max-w-[1200px] px-4 md:px-6">
        <div className="mb-14 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">Our Guiding Principles</p>
          <h2 className="text-3xl font-semibold leading-tight md:text-5xl">Three Beliefs That Shape Every Brief.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((it, i) => (
            <M.div
              key={it.k}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-sm border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-colors duration-500 hover:border-primary/60"
            >
              <span className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-primary transition-transform duration-700 group-hover:scale-x-100" />
              <div className="mb-6 font-serif text-5xl text-primary/80 transition-transform duration-500 group-hover:-translate-y-1 group-hover:text-primary">{it.k}</div>
              <h3 className="mb-3 text-xl font-semibold">{it.t}</h3>
              <p className="text-sm leading-7 text-neutral-300">{it.d}</p>
              <span className="absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:bg-primary/30" />
            </M.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessMarquee() {
  const tools = ["Revit", "AutoCAD", "SketchUp", "Rhino", "Enscape", "Lumion", "V-Ray", "Twinmotion", "Photoshop", "InDesign", "ArchiCAD", "BIM 360"];
  return (
    <section className="border-b border-border/60 bg-background py-16">
      <div className="mx-auto mb-8 max-w-[1200px] px-4 md:px-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">Tools We Master</p>
        <h2 className="text-2xl font-semibold md:text-3xl">A toolkit refined over fifteen years.</h2>
      </div>
      <div className="group relative overflow-hidden border-y border-border/60 bg-neutral-50 py-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-neutral-50 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-neutral-50 to-transparent" />
        <div className="flex w-max animate-[marquee-x_38s_linear_infinite] gap-12 pr-12 group-hover:[animation-play-state:paused]">
          {[...tools, ...tools].map((t, i) => (
            <span key={i} className="text-2xl font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-300 hover:text-primary md:text-3xl">
              {t} <span className="ml-12 text-primary">●</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessTestimonial() {
  const quotes = [
    { q: "Uppal turned a complicated brief into a calm, beautiful home. The process felt effortless from the first sketch.", a: "Priya & Rohan", r: "Residential client, Surrey" },
    { q: "Communication was world class. Every milestone arrived on time and nothing was lost in translation on site.", a: "Mark Halloway", r: "Developer, London" },
    { q: "The visualisations gave us full confidence before a single brick was laid. Truly intelligent design.", a: "Aisha Khan", r: "Hospitality client, Manchester" },
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % quotes.length), 6000);
    return () => clearInterval(id);
  }, [quotes.length]);
  return (
    <section className="border-b border-border/60 bg-background py-24">
      <div className="mx-auto max-w-[1100px] px-4 md:px-6">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.24em] text-primary">Client Voices</p>
        <h2 className="mb-12 text-center text-3xl font-semibold md:text-5xl">A Process Clients Trust.</h2>
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 font-serif text-9xl leading-none text-primary/15">“</span>
          {quotes.map((qt, idx) => (
            <M.blockquote
              key={idx}
              initial={false}
              animate={{ opacity: i === idx ? 1 : 0, y: i === idx ? 0 : 20, position: i === idx ? "relative" : "absolute" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="inset-x-0 px-6 text-xl font-light leading-9 text-foreground md:text-2xl"
            >
              “{qt.q}”
              <footer className="mt-6 text-sm uppercase tracking-[0.22em] text-muted-foreground">
                <span className="text-primary">{qt.a}</span> — {qt.r}
              </footer>
            </M.blockquote>
          ))}
          <div className="mt-10 flex justify-center gap-2">
            {quotes.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                aria-label={`Quote ${idx + 1}`}
                className={cn("h-[3px] rounded-full transition-all duration-500", i === idx ? "w-10 bg-primary" : "w-5 bg-border hover:bg-primary/50")}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessCTA() {
  return (
    <section className="relative isolate overflow-hidden py-24 text-neutral-100">
      <BackgroundVideo src={pageVideos.cta} poster={media.heroMain} />
      <div className="absolute inset-0 -z-0 bg-gradient-to-br from-black/85 via-black/70 to-black/85" />
      <div className="relative mx-auto max-w-[1100px] px-4 text-center md:px-6">
        <M.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-primary">Ready When You Are</p>
          <h2 className="mb-6 text-4xl font-semibold leading-tight md:text-6xl">Let’s begin step one — together.</h2>
          <p className="mx-auto mb-10 max-w-2xl text-base leading-8 text-neutral-300">
            Book a discovery call and walk through your brief with our principal architect. No obligation, just clarity.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild className="btn-sheen rounded-sm px-8 py-6 text-base"><Link to="/contact">Start Your Project</Link></Button>
            <Button asChild variant="outline" className="rounded-sm border-white/40 bg-transparent px-8 py-6 text-base text-white hover:bg-white hover:text-black"><Link to="/projects">See Our Work</Link></Button>
          </div>
        </M.div>
      </div>
    </section>
  );
}


function ProcessTimeline() {
  const MotionAny = M.div;
  return (
    <section className="border-b border-border/60 bg-background py-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">Our Design Process</p>
          <h2 className="mx-auto max-w-[22ch] text-3xl font-semibold leading-tight md:text-5xl">
            From Concept to Creation. <span className="text-primary">Excellence at Every Step.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
            A seamless, five-stage journey designed to take your vision from the first idea to a finished build with clarity at every milestone.
          </p>
        </div>
        <div className="relative">
          <MotionAny
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "left" }}
            className="absolute left-[6%] right-[6%] top-[2.75rem] hidden h-[2px] bg-gradient-to-r from-primary/10 via-primary to-primary/10 md:block"
            aria-hidden
          />
          <div className="grid gap-10 md:grid-cols-5 md:gap-4">
            {processSteps.map((step, i) => {
              const Icon = processIcon[step.icon] ?? Sparkles;
              return (
                <MotionAny
                  key={step.number}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.7, delay: 0.15 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -6 }}
                  className="group relative flex flex-col items-center text-center"
                >
                  <div className="relative mx-auto grid h-[5.5rem] w-[5.5rem] place-items-center rounded-full border border-border bg-card shadow-[var(--shadow-soft)] transition-all duration-500 group-hover:border-primary group-hover:bg-primary">
                    <span className="text-lg font-semibold text-primary transition-colors duration-500 group-hover:text-primary-foreground">{step.number}</span>
                    <span className="absolute -bottom-2 -right-2 grid h-8 w-8 place-items-center rounded-full border border-border bg-background text-primary shadow-[var(--shadow-soft)]">
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>
                  <h3 className="mt-5 text-sm font-semibold uppercase tracking-[0.18em]">{step.title}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">{step.subtitle}</p>
                </MotionAny>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function DetailedProcessAlternating() {
  return (
    <section className="border-b border-border/60 bg-neutral-50 py-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <div className="mb-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">The Process, in Detail</p>
          <h2 className="max-w-[20ch] text-3xl font-semibold leading-tight md:text-5xl">How We Bring Your Vision to Life</h2>
        </div>
        <div className="space-y-16">
          {processSteps.map((step, i) => (
            <StepCardAlt key={step.number} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCardAlt({ step, index }: { step: (typeof processSteps)[number]; index: number }) {
  const Icon = processIcon[step.icon] ?? Sparkles;
  const reversed = index % 2 === 1;
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -py * 8, y: px * 8 });
  };
  const reset = () => setTilt({ x: 0, y: 0 });
  return (
    <M.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={cn("grid items-center gap-10 lg:grid-cols-2 lg:gap-16", reversed && "lg:[&>div:first-child]:order-2")}
    >
      <div
        onMouseMove={onMove}
        onMouseLeave={reset}
        className="relative overflow-hidden rounded-sm border border-border bg-card shadow-[var(--shadow-soft)]"
        style={{ perspective: 1200 }}
      >
        <M.div
          animate={{ rotateX: tilt.x, rotateY: tilt.y }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative"
        >
          <img src={step.image} alt={step.title} className="h-[420px] w-full object-cover" loading="lazy" />
          <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_var(--mx,50%)_var(--my,50%),rgba(255,255,255,0.18),transparent_55%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute left-6 top-6 flex items-center gap-3 text-white">
            <span className="grid h-12 w-12 place-items-center rounded-full border border-white/40 bg-white/10 backdrop-blur text-lg font-semibold">{step.number}</span>
            <span className="text-[11px] uppercase tracking-[0.24em]">{step.subtitle}</span>
          </div>
        </M.div>
      </div>
      <div>
        <div className="mb-4 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Step {step.number}</span>
        </div>
        <h3 className="mb-4 text-3xl font-semibold leading-tight md:text-4xl">{step.title}</h3>
        <p className="mb-6 text-base leading-8 text-muted-foreground">{step.description}</p>
        <div className="rounded-sm border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">Deliverables</div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {step.deliverables.map((d) => (
              <li key={d} className="flex items-start gap-2 text-sm text-foreground/90">
                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </M.div>
  );
}

function ValueGrid4() {
  const items: Array<[string, string, ComponentType<{ className?: string }>]> = [
    ["Collaborative Approach", "We work alongside you at every stage so the design always reflects your vision.", Users],
    ["Transparent Process", "Clear timelines, honest updates, and zero surprises from first sketch to handover.", Clock3],
    ["Design Excellence", "Considered detailing and material thinking that elevates every space we deliver.", Sparkles],
    ["On-Time Delivery", "Disciplined coordination keeps your project on schedule without compromising quality.", Award],
  ];
  return (
    <section className="border-b border-border/60 bg-background py-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">Why Work With Us</p>
          <h2 className="mx-auto max-w-[22ch] text-3xl font-semibold leading-tight md:text-5xl">
            Designed Around You. <span className="text-primary">Delivered with Excellence.</span>
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(([label, copy, Icon], i) => (
            <M.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-sm border border-border bg-card p-8 text-center shadow-[var(--shadow-soft)] transition-colors duration-500 hover:border-primary"
            >
              <span className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-primary transition-transform duration-500 group-hover:scale-x-100" />
              <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary transition-colors duration-500 group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mb-2 text-base font-semibold">{label}</h3>
              <p className="text-sm leading-7 text-muted-foreground">{copy}</p>
            </M.div>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Button asChild className="btn-sheen rounded-sm px-7"><Link to="/contact">Let’s Build Together</Link></Button>
        </div>
      </div>
    </section>
  );
}

function ProcessFaq() {
  return (
    <section className="border-b border-border/60 bg-neutral-50 py-24">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-4 md:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">FAQ</p>
          <h2 className="mb-5 text-3xl font-semibold leading-tight md:text-5xl">Everything You Need to Know</h2>
          <p className="mb-8 max-w-md text-base leading-8 text-muted-foreground">
            Answers to the questions we hear most often. Still curious? Reach out and we will gladly walk you through it.
          </p>
          <div className="overflow-hidden rounded-sm border border-border bg-card shadow-[var(--shadow-soft)]">
            <img src={media.heroMain} alt="Studio" className="h-[260px] w-full object-cover transition-transform duration-[1200ms] ease-out hover:scale-[1.05]" loading="lazy" />
            <div className="p-6">
              <h3 className="mb-2 text-lg font-semibold">Have More Questions?</h3>
              <p className="mb-4 text-sm leading-7 text-muted-foreground">Reach out and we will discuss your project in detail.</p>
              <Button asChild className="btn-sheen rounded-sm px-6"><Link to="/contact">Contact Our Team</Link></Button>
            </div>
          </div>
        </div>
        <Accordion type="single" collapsible className="self-start rounded-sm border border-border bg-card px-6 shadow-[var(--shadow-soft)]">
          {faqItems.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger className="text-left text-base font-semibold">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-sm leading-7 text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export function BlogPageContent() {
  return (
    <>
      <HeroSection
        eyebrow="Our Blog"
        title="Insights That Inspire."
        highlight="Ideas That Build."
        description="Explore expert perspectives, design inspirations, and the latest in architecture and interior design."
        primaryLabel="Explore Articles"
        image={media.heroAlt}
        videoSrc={pageVideos.blog}
      />
      <FeaturedArticleBand />
      <BlogGrid />
      <NewsletterBand />
      <ContactStrip />
    </>
  );
}

function FeaturedArticleBand() {
  const featured = blogPosts[0];
  return (
    <section className="border-b border-border/60 bg-background py-14">
      <div className="mx-auto grid max-w-[1200px] gap-8 border border-border bg-card px-5 py-5 shadow-[var(--shadow-soft)] md:px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <img src={featured.image} alt={featured.title} className="h-full min-h-[320px] w-full object-cover" loading="lazy" />
        <div className="flex flex-col justify-center space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Featured Article</p>
          <h2 className="max-w-[14ch] text-3xl font-semibold leading-tight md:text-5xl">{featured.title}</h2>
          <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
            <span>{featured.date}</span>
            <span>{featured.readTime}</span>
            <span>{featured.category}</span>
          </div>
          <p className="max-w-xl text-base leading-8 text-muted-foreground">{featured.excerpt}</p>
          <Button className="btn-sheen w-fit rounded-sm px-6">Read Full Article</Button>
        </div>
      </div>
    </section>
  );
}

function BlogGrid() {
  return (
    <section className="border-b border-border/60 bg-background py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <div className="mb-8 flex items-center justify-between gap-6">
          <h2 className="text-3xl font-semibold md:text-5xl">Latest Articles</h2>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {[
              "All",
              "Architecture",
              "Interior Design",
              "Sustainability",
              "News",
            ].map((item, index) => (
              <span key={item} className={cn(index === 0 ? "text-primary" : "", "uppercase tracking-[0.15em]")}>{item}</span>
            ))}
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {blogPosts.slice(1, 5).map((post) => (
            <article key={post.title} className="border border-border bg-card shadow-[var(--shadow-soft)]">
              <img src={post.image} alt={post.title} className="h-52 w-full object-cover" loading="lazy" />
              <div className="space-y-4 p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{post.category}</div>
                <h3 className="text-xl font-semibold leading-tight">{post.title}</h3>
                <div className="text-sm text-muted-foreground">{post.date} · {post.readTime}</div>
                <p className="text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3 xl:grid-cols-6">
          {[
            ["Architectural", "24 Articles"],
            ["Interior Design", "18 Articles"],
            ["Sustainability", "16 Articles"],
            ["Design Trends", "14 Articles"],
            ["News & Updates", "12 Articles"],
            ["Project Stories", "20 Articles"],
          ].map(([name, count]) => (
            <div key={name as string} className="border border-border bg-card p-5 text-center shadow-[var(--shadow-soft)]">
              <h3 className="text-base font-semibold">{name as string}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{count as string}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsletterBand() {
  return (
    <section className="border-b border-border/60 bg-background py-16">
      <div className="mx-auto grid max-w-[1200px] gap-6 border border-border bg-card px-5 py-7 shadow-[var(--shadow-soft)] md:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">Stay Inspired</p>
          <h2 className="text-3xl font-semibold">Subscribe to Our Newsletter</h2>
          <p className="mt-4 text-base leading-8 text-muted-foreground">Get the latest articles, design ideas, and updates delivered straight to your inbox.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <input className="h-12 border border-input bg-background px-4 text-sm outline-none" placeholder="Enter your email address" />
          <Button className="btn-sheen h-12 rounded-sm px-6">Subscribe</Button>
        </div>
      </div>
    </section>
  );
}

export function ContactPageContent() {
  return (
    <>
      <HeroSection
        eyebrow="Get in Touch"
        title="Let’s Build Something"
        highlight="Extraordinary Together"
        description="We are here to answer your questions, discuss your ideas, and bring your vision to life with intelligence, purpose, and elegance."
        image={media.heroAlt}
        videoSrc={pageVideos.contact}
      />
      <ContactDetailsBand />
      <FaqCardsBand />
      <ContactStrip />
    </>
  );
}

function ContactDetailsBand() {
  return (
    <section className="border-b border-border/60 bg-background py-20">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-4 md:px-6 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Our Offices</p>
          <h2 className="text-3xl font-semibold md:text-5xl">Let’s Connect</h2>
          <p className="max-w-md text-base leading-8 text-muted-foreground">Visit us at our studio or reach out through your preferred channel.</p>
          <img src={media.project1} alt="Office visual" className="h-[260px] w-full object-cover shadow-[var(--shadow-soft)]" loading="lazy" />
          <div className="grid gap-4 md:grid-cols-2">
            <OfficeCard title="Head Office" address="Unit 3, Design House, Riverside Way, London" />
            <OfficeCard title="Studio Office" address="Thames Tower, 5th Floor, Chiswick Square, London" />
          </div>
        </div>
        <div className="border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">Send Us a Message</p>
          <h2 className="text-3xl font-semibold md:text-5xl">Request a Consultation</h2>
          <p className="mt-4 max-w-xl text-base leading-8 text-muted-foreground">Share a few details about your project and our team will get back to you within 24 hours.</p>
          <form className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "Your Name",
              "Email Address",
              "Phone Number",
              "Project Type",
              "Budget Range",
              "Timeline",
            ].map((field) => (
              <input key={field} className="h-12 border border-input bg-background px-4 text-sm outline-none" placeholder={field} />
            ))}
            <textarea className="md:col-span-2 min-h-[140px] border border-input bg-background px-4 py-3 text-sm outline-none" placeholder="Your Message" />
            <Button className="btn-sheen md:col-span-2 w-fit rounded-sm px-6">Send Message</Button>
          </form>
        </div>
      </div>
    </section>
  );
}

function OfficeCard({ title, address }: { title: string; address: string }) {
  return (
    <div className="grid gap-3 border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
      <div className="text-base font-semibold">{title}</div>
      <div className="text-sm leading-7 text-muted-foreground">{address}</div>
      <div className="text-sm text-muted-foreground">Monday - Friday · 9:00 AM - 6:00 PM</div>
    </div>
  );
}

function FaqCardsBand() {
  return (
    <section className="border-b border-border/60 bg-background py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <div className="mb-8 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">How Can We Help?</p>
          <h2 className="text-3xl font-semibold md:text-5xl">Frequently Asked Questions</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {faqItems.map((faq) => (
            <div key={faq.question} className="flex min-h-[230px] flex-col justify-between border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
              <div>
                <h3 className="text-xl font-semibold leading-tight">{faq.question}</h3>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{faq.answer}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-primary" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TeamPageContent() {
  return (
    <>
      <HeroSection
        eyebrow="Our Team"
        title="The Minds Behind"
        highlight="The Masterpieces."
        description="A passionate team of architects, designers, and dreamers dedicated to bringing your vision to life."
        primaryLabel="Meet the Team"
        image={media.heroMain}
        videoSrc={pageVideos.team}
      />
      <LeadershipBand />
      <TeamBand />
      <CultureBand />
      <ContactStrip />
    </>
  );
}

function LeadershipBand() {
  return (
    <section className="border-b border-border/60 bg-background py-20">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-4 md:px-6 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Leadership</p>
          <h2 className="max-w-[12ch] text-3xl font-semibold leading-tight md:text-5xl">Guiding Vision. Building Futures.</h2>
          <p className="max-w-md text-base leading-8 text-muted-foreground">
            Our leadership combines professionalism with creativity, insight, and experience to drive our studio’s growth, ensure client satisfaction, and create success.
          </p>
          <Button asChild className="btn-sheen rounded-sm px-6"><Link to="/contact">Meet Leadership</Link></Button>
        </div>
        <div className="grid gap-5 md:grid-cols-4">
          {teamLeads.map((member) => (
            <div key={member.name} className="border border-border bg-card p-3 shadow-[var(--shadow-soft)]">
              <img src={member.image} alt={member.name} className="h-56 w-full object-cover" loading="lazy" />
              <div className="space-y-1 p-2">
                <div className="text-base font-semibold">{member.name}</div>
                <div className="text-sm text-muted-foreground">{member.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamBand({ compact = false }: { compact?: boolean }) {
  const members = compact ? teamLeads : teamMembers;
  return (
    <section className="border-b border-border/60 bg-background py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <div className="mb-8 grid gap-6 lg:grid-cols-[0.74fr_1.26fr]">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">Our Team</p>
            <h2 className="max-w-[14ch] text-3xl font-semibold leading-tight md:text-5xl">Experts in Design. United by Purpose.</h2>
          </div>
          <p className="max-w-xl text-base leading-8 text-muted-foreground">A collective of architects, designers, and specialists working together to create innovative, functional, and timeless spaces.</p>
        </div>
        <div className={cn("grid gap-5", compact ? "md:grid-cols-4" : "md:grid-cols-2 xl:grid-cols-5")}>
          {members.map((member) => (
            <div key={member.name} className="border border-border bg-card p-3 shadow-[var(--shadow-soft)]">
              <img src={member.image} alt={member.name} className={cn("w-full object-cover", compact ? "h-64" : "h-56")} loading="lazy" />
              <div className="space-y-2 p-3">
                <div className="text-base font-semibold">{member.name}</div>
                <div className="text-sm text-muted-foreground">{member.role}</div>
                {!compact ? <div className="flex gap-3 text-primary"><Mail className="h-4 w-4" /><Users className="h-4 w-4" /></div> : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CultureBand() {
  return (
    <section className="border-b border-border/60 bg-background py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <div className="mb-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">Our Values</p>
            <h2 className="max-w-[12ch] text-3xl font-semibold leading-tight md:text-5xl">Our Culture. Our Commitment.</h2>
          </div>
          <p className="max-w-xl text-base leading-8 text-muted-foreground">We believe great architecture is built on strong values and shared commitment to people, purpose, and the future.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-6">
          {values.map((value) => (
            <div key={value} className="border border-border bg-card p-6 text-center shadow-[var(--shadow-soft)]">
              <Leaf className="mx-auto mb-4 h-6 w-6 text-primary" />
              <h3 className="text-base font-semibold">{value}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProjectDetailContent() {
  const related = projects.slice(1, 5);
  return (
    <>
      <DetailScrollProgress />
      <ProjectDetailHero />
      <DetailMarquee />
      <ProjectOverviewBand />
      <ParallaxQuoteBand />
      <ProjectHighlightsBand />
      <ChallengeSolutionBand />
      <RelatedProjectsBand related={related} />
      <ContactStrip />
    </>
  );
}

function DetailScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 24, mass: 0.3 });
  return (
    <M.div
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-primary"
    />
  );
}

function DetailMarquee() {
  const items = ["Residential", "Surrey · UK", "Completed 2023", "6200 sq ft", "Private Client", "Award Shortlist"];
  const row = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden border-y border-border/60 bg-foreground py-5">
      <M.div
        animate={{ x: ["0%", "-33.333%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
        className="flex w-max items-center gap-12 whitespace-nowrap"
      >
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-12 text-[13px] font-semibold uppercase tracking-[0.32em] text-background/90">
            {t}
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
        ))}
      </M.div>
    </div>
  );
}

function ParallaxQuoteBand() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  return (
    <section ref={ref} className="relative isolate overflow-hidden border-b border-border/60 bg-black">
      <M.div style={{ y }} className="absolute inset-0 -z-10 will-change-transform">
        <img src={media.project2} alt="" className="h-[130%] w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-black/60" />
      </M.div>
      <div className="mx-auto max-w-[1000px] px-4 py-28 text-center md:px-6 md:py-36">
        <h3 className="text-2xl font-medium leading-[1.25] tracking-tight text-white md:text-4xl">
          <WordMaskReveal text="“A home where every line, light and material works in quiet conversation.”" />
        </h3>
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.36em] text-white/70">Lead Architect — Uppal Design</p>
      </div>
    </section>
  );
}



const detailEase = [0.22, 1, 0.36, 1] as const;

function WordMaskReveal({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <span className={cn("inline-flex flex-wrap gap-x-[0.28em]", className)}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className="relative inline-block overflow-hidden align-bottom leading-[1.05]">
          <M.span
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: detailEase, delay: delay + i * 0.07 }}
            className="inline-block will-change-transform"
          >
            {w}
          </M.span>
        </span>
      ))}
    </span>
  );
}

function ProjectDetailHero() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18]);

  return (
    <section ref={ref} className="relative isolate h-[92vh] min-h-[640px] w-full overflow-hidden bg-black">
      <M.div style={{ y, scale }} className="absolute inset-0 will-change-transform">
        <img src={media.heroMain} alt="Luxury Villa Haven" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
      </M.div>
      <div className="relative z-10 mx-auto flex h-full max-w-[1200px] flex-col justify-end px-4 pb-32 md:px-6">
        <M.p
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.7, ease: detailEase }}
          className="mb-5 text-[11px] font-semibold uppercase tracking-[0.36em] text-white/80"
        >
          Featured Project — Residential
        </M.p>
        <h1 className="max-w-[18ch] text-4xl font-semibold leading-[1.02] tracking-tight text-white md:text-7xl">
          <WordMaskReveal text="LUXURY VILLA HAVEN" />
        </h1>
        <div className="mt-6 max-w-2xl overflow-hidden">
          <M.p
            initial={{ y: "100%" }} whileInView={{ y: "0%" }} viewport={{ once: true }}
            transition={{ duration: 0.9, ease: detailEase, delay: 0.4 }}
            className="text-base leading-8 text-white/85 md:text-lg"
          >
            A seamless blend of modern architecture and natural harmony, designed for elevated living.
          </M.p>
        </div>
      </div>
      <M.div
        initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.8, ease: detailEase, delay: 0.5 }}
        className="absolute inset-x-0 bottom-8 z-10 mx-auto max-w-[1200px] px-4 md:px-6"
      >
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-white/20 bg-white/15 backdrop-blur-xl md:grid-cols-3">
          {[
            ["Location", "Surrey, UK"],
            ["Total Completion", "2023"],
            ["Client", "Private"],
          ].map(([label, value]) => (
            <div key={label} className="bg-white/5 px-6 py-5 text-white">
              <div className="text-[11px] uppercase tracking-[0.28em] text-white/70">{label}</div>
              <div className="mt-2 text-lg font-semibold">{value}</div>
            </div>
          ))}
        </div>
      </M.div>
    </section>
  );
}

function MagneticButton({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 200, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 200, damping: 18, mass: 0.4 });
  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set(((e.clientX - (r.left + r.width / 2)) / r.width) * 24);
        my.set(((e.clientY - (r.top + r.height / 2)) / r.height) * 16);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      className={cn(
        "btn-sheen group inline-flex items-center gap-3 rounded-sm bg-primary px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </motion.button>
  );
}

function ProjectOverviewBand() {
  return (
    <section className="border-b border-border/60 bg-background py-24">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-4 md:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="space-y-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-primary">Project Overview</p>
          <h2 className="max-w-[14ch] text-3xl font-semibold leading-[1.08] tracking-tight md:text-5xl">
            <WordMaskReveal text="Crafting Spaces That Inspire and Endure." />
          </h2>
          <p className="max-w-md text-base leading-8 text-muted-foreground">
            Luxury Villa Haven is a private residence designed to offer serenity, functionality, and refined living. Soft forms meet natural materials to create a calm, elevated retreat.
          </p>
          <div className="flex items-center gap-6 pt-2">
            <MagneticButton>Download Case Study</MagneticButton>
            <div className="hidden font-[cursive] text-2xl italic text-foreground/70 md:block">— Uppal</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <GalleryImage src={media.heroMain} alt="Villa exterior" className="row-span-2 min-h-[480px]" />
          <GalleryImage src={media.collageC} alt="Villa lounge" className="h-[232px]" delay={0.12} />
          <GalleryImage src={media.project2} alt="Villa bedroom" className="h-[232px]" delay={0.2} />
        </div>
      </div>
    </section>
  );
}

function ProjectHighlightsBand() {
  const highlights = [
    { title: "Fluid Architecture", text: "Curved forms and open layouts create a sense of movement and openness.", icon: Sparkles },
    { title: "Natural Light", text: "Expansive glazing maximizes daylight and connects indoors with nature.", icon: Lightbulb },
    { title: "Premium Materials", text: "A refined palette of stone, wood and glass enhances durability and elegance.", icon: Layers },
    { title: "Outdoor Living", text: "Landscaped terraces and water features extend relaxation and beauty.", icon: Leaf },
  ];
  return (
    <section className="border-b border-border/60 bg-[color:var(--color-surface-soft)] py-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <div className="mb-12 grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-primary">Design Highlights</p>
            <h2 className="max-w-[14ch] text-3xl font-semibold leading-[1.08] tracking-tight md:text-5xl">
              <WordMaskReveal text="Timeless Design. Thoughtful Details." />
            </h2>
          </div>
          <p className="max-w-xl text-base leading-8 text-muted-foreground">
            Every decision — from massing to material — reinforces a single, calm idea of home.
          </p>
        </div>
        <M.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
          className="grid gap-5 md:grid-cols-2 lg:grid-cols-4"
        >
          {highlights.map(({ title, text, icon: Icon }) => (
            <M.div
              key={title}
              variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.7, ease: detailEase }}
              className="group relative overflow-hidden rounded-sm border border-border bg-card p-7 shadow-[var(--shadow-soft)] transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
            >
              <Icon className="mb-5 h-6 w-6 text-primary transition-transform duration-500 group-hover:scale-110" />
              <h3 className="mb-3 text-lg font-semibold">{title}</h3>
              <p className="text-sm leading-7 text-muted-foreground">{text}</p>
              <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-primary transition-transform duration-500 group-hover:scale-x-100" />
            </M.div>
          ))}
        </M.div>
      </div>
    </section>
  );
}

function ChallengeSolutionBand() {
  const points = [
    "Curved roof crafted for flow and comfort",
    "Maximised natural light and panoramic views",
    "High-end materials for timeless appeal",
    "Smart zones and energy-efficient systems",
  ];
  return (
    <section className="border-b border-border/60 bg-background py-24">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-4 md:px-6 lg:grid-cols-2">
        <div>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-primary">The Challenge</p>
          <h3 className="max-w-[14ch] text-3xl font-semibold leading-[1.08] tracking-tight md:text-5xl">
            <WordMaskReveal text="Balancing Elegance with Functionality." />
          </h3>
          <p className="mt-6 max-w-md text-base leading-8 text-muted-foreground">
            The client envisioned a luxury home that felt open and elevated while ensuring lasting functionality, privacy, and family comfort.
          </p>
        </div>
        <div>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-primary">Our Solution</p>
          <h3 className="max-w-[14ch] text-3xl font-semibold leading-[1.08] tracking-tight md:text-5xl">
            <WordMaskReveal text="Designing with Purpose and Precision." />
          </h3>
          <M.ul
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
            className="mt-6 space-y-3"
          >
            {points.map((p) => (
              <M.li
                key={p}
                variants={{ hidden: { opacity: 0, x: -24 }, show: { opacity: 1, x: 0 } }}
                transition={{ duration: 0.55, ease: detailEase }}
                className="flex items-start gap-3 text-sm leading-7 text-foreground/85"
              >
                <span className="mt-1 grid h-5 w-5 place-items-center rounded-full bg-primary/15 text-primary">
                  <Check className="h-3 w-3" />
                </span>
                {p}
              </M.li>
            ))}
          </M.ul>
        </div>
      </div>
    </section>
  );
}


function RelatedProjectsBand({ related }: { related: (typeof projects)[number][] }) {
  return (
    <section className="border-b border-border/60 bg-background py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">Related Projects</p>
            <h2 className="text-3xl font-semibold md:text-5xl">Explore More Work</h2>
          </div>
          <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-foreground">View All Projects <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {related.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomePageContent() {
  return (
    <>
      <HeroSection
        eyebrow="Architecture That Inspires"
        title="Intelligent Architecture."
        highlight="Lasting Impact."
        description="We are a UK-based architecture studio delivering intelligent, sustainable, and future-ready design solutions across the globe."
        primaryLabel="Explore Projects"
        secondaryLabel="Our Services"
        secondaryTo="/services"
        image={media.heroMain}
        videoSrc={pageVideos.home}
      />
      <StatsBand />
      <IntroSplit />
      <ProcessBand />
      <ProjectsShowcase />
      <ServicesGrid />
      <BlogAndQuoteBand />
    </>
  );
}

export function ContactInfoRow() {
  return (
    <div className="mt-8 grid gap-4 md:grid-cols-3">
      {[
        [siteSettings.phone, Phone],
        [siteSettings.email, Mail],
        [siteSettings.studioAddress, MapPin],
      ].map(([text, Icon]) => {
        const Lucide = Icon as typeof Phone;
        return (
          <div key={text as string} className="flex items-center gap-3 text-sm text-muted-foreground">
            <Lucide className="h-5 w-5 text-primary" />
            <span>{text as string}</span>
          </div>
        );
      })}
    </div>
  );
}
