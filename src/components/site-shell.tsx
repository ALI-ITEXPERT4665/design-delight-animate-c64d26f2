import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BackgroundVideo } from "@/components/background-video";
import {
  ArrowRight,
  Award,
  Building2,
  ChevronRight,
  CirclePlay,
  Clock3,
  Leaf,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  blogPosts,
  faqItems,
  media,
  navItems,
  processSteps,
  projects,
  services,
  siteSettings,
  stats,
  teamLeads,
  teamMembers,
  values,
} from "@/lib/site-data";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-6 px-4 py-4 md:px-6">
        <Link to="/" className="group flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-sm border border-border bg-background transition-transform duration-300 group-hover:-translate-y-0.5">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-lg font-semibold tracking-[0.22em] text-foreground">UPPAL</div>
            <div className="text-[10px] uppercase tracking-[0.42em] text-muted-foreground">Design</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="story-link text-sm font-medium text-foreground/75 transition-colors hover:text-foreground data-[status=active]:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button asChild className="hidden h-11 rounded-sm px-5 md:inline-flex">
            <Link to="/contact">Get a Quote</Link>
          </Button>
          <button
            type="button"
            aria-label="Menu"
            className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card text-foreground transition-transform duration-300 hover:-translate-y-0.5"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/60">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-4 py-14 md:grid-cols-[1.2fr_0.9fr_0.9fr_1fr] md:px-6">
        <div className="space-y-5">
          <div>
            <div className="text-lg font-semibold tracking-[0.22em] text-foreground">UPPAL</div>
            <div className="text-xs uppercase tracking-[0.34em] text-muted-foreground">Decor</div>
          </div>
          <p className="max-w-sm text-sm leading-7 text-muted-foreground">
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
        <div className="space-y-4 text-sm text-muted-foreground">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground">Contact Us</h3>
          <p>{siteSettings.phone}</p>
          <p>{siteSettings.email}</p>
          <p>{siteSettings.address}</p>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-4 py-5 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
          <p>© 2024 Uppal Decor. All Rights Reserved.</p>
          <div className="flex gap-6">
            <span>Privacy Policy</span>
            <span>Terms & Conditions</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterList({ title, items }: { title: string; items: { label: string; to: string }[] }) {
  return (
    <div className="space-y-4 text-sm text-muted-foreground">
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground">{title}</h3>
      <div className="grid gap-3">
        {items.map((item) => (
          <Link key={`${title}-${item.label}`} to={item.to} className="transition-colors hover:text-foreground">
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
  showVideo = false,
  darkPlay = false,
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
  showVideo?: boolean;
  darkPlay?: boolean;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-[radial-gradient(circle_at_top_left,var(--color-surface-soft),transparent_38%)]">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-4 pb-12 pt-12 md:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:pt-16">
        <div className="relative z-10 max-w-xl space-y-6 reveal-up">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">{eyebrow}</p>
          <h1 className="max-w-[12ch] text-4xl font-semibold leading-[1.05] md:text-6xl">
            {title}
            {highlight ? <span className="block text-primary">{highlight}</span> : null}
          </h1>
          <p className="max-w-md text-base leading-8 text-muted-foreground md:text-lg">{description}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="btn-sheen rounded-sm px-6">
              <Link to={primaryTo}>{primaryLabel}</Link>
            </Button>
            {secondaryLabel && secondaryTo ? (
              <Button asChild size="lg" variant="outline" className="btn-sheen rounded-sm px-6">
                <Link to={secondaryTo}>{secondaryLabel}</Link>
              </Button>
            ) : null}
          </div>
        </div>
        <div className="group relative min-h-[360px] overflow-hidden rounded-none border border-border/40 bg-card shadow-[var(--shadow-soft)] media-hover lg:min-h-[520px]">
          {showVideo ? (
            <BackgroundVideo src={media.video} poster={image} alt={title} />
          ) : (
            <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]" loading="eager" />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-background/55" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.35))] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="absolute bottom-6 right-6 flex items-center gap-3 rounded-full border border-white/20 bg-background/85 px-4 py-3 shadow-[var(--shadow-soft)] transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-background">
            <CirclePlay className={cn("h-5 w-5 transition-transform duration-500 group-hover:scale-110", darkPlay ? "text-foreground" : "text-primary")} />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-foreground">Play Showreel</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StatsBand() {
  return (
    <section className="border-b border-border/60 bg-background">
      <div className="mx-auto grid max-w-[1200px] gap-4 px-4 py-6 md:grid-cols-5 md:px-6">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-4 border-r border-border/50 py-3 last:border-r-0">
            <Award className="h-6 w-6 text-primary" />
            <div>
              <div className="text-2xl font-semibold">{stat.value}</div>
              <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function IntroSplit() {
  return (
    <section className="border-b border-border/60 bg-background py-20">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 md:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">About Us</p>
          <h2 className="max-w-[12ch] text-3xl font-semibold leading-tight md:text-5xl">Designing Spaces, Elevating Lives.</h2>
          <p className="max-w-md text-base leading-8 text-muted-foreground">
            At Uppal Design, we believe architecture is more than buildings — it is about creating meaningful spaces that enhance the way people live, work, and connect.
          </p>
          <Button asChild className="rounded-sm px-6">
            <Link to="/about">More About Us</Link>
          </Button>
        </div>
        <div className="grid grid-cols-[1.1fr_0.9fr] gap-4">
          <img src={media.collageA} alt="Architectural city composition" className="h-full min-h-[260px] w-full object-cover shadow-[var(--shadow-soft)]" loading="lazy" />
          <div className="grid gap-4">
            <img src={media.project3} alt="Modern facade detail" className="h-[170px] w-full object-cover shadow-[var(--shadow-soft)]" loading="lazy" />
            <div className="relative">
              <img src={media.heroAlt} alt="Curved modern architecture" className="h-[220px] w-full object-cover shadow-[var(--shadow-soft)]" loading="lazy" />
              <div className="absolute -right-4 top-8 border border-primary/30 bg-background px-5 py-6 shadow-[var(--shadow-soft)]">
                <div className="text-4xl font-semibold text-primary">15+</div>
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Years of Experience</div>
              </div>
            </div>
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
        <div className="grid gap-6 md:grid-cols-5">
          {processSteps.map((step) => (
            <div key={step.number} className="group relative space-y-4 text-center">
              <div className="mx-auto grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full border border-border bg-card shadow-[var(--shadow-soft)] transition-transform duration-300 group-hover:-translate-y-1">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{step.number}</p>
                <h3 className="text-sm font-semibold uppercase tracking-[0.12em]">{step.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{step.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button asChild variant="outline" className="rounded-sm px-6">
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
            <Button asChild className="rounded-sm px-6">
              <Link to="/projects">View All Projects</Link>
            </Button>
          </div>
        ) : null}
        <div className="mb-8 flex flex-wrap gap-3">
          {["All", "Residential", "Commercial", "Educational", "Hospitality"].map((item, index) => (
            <div
              key={item}
              className={cn(
                "rounded-full border px-5 py-2 text-sm transition-colors",
                index === 0 ? "border-primary/30 bg-primary/8 text-primary" : "border-border text-muted-foreground",
              )}
            >
              {item}
            </div>
          ))}
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
    <article className="group overflow-hidden border border-border bg-card shadow-[var(--shadow-soft)] transition-transform duration-300 hover:-translate-y-1">
      <div className="overflow-hidden">
        <img src={project.image} alt={project.title} className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" loading="lazy" />
      </div>
      <div className="space-y-3 p-5">
        <span className="inline-flex rounded-full border border-border px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{project.category}</span>
        <div>
          <h3 className="text-xl font-semibold">{project.title}</h3>
          <p className="text-sm text-muted-foreground">{project.location}</p>
        </div>
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
            <Button asChild className="rounded-sm px-6">
              <Link to="/services">View All Services</Link>
            </Button>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {services.slice(0, 5).map((service) => (
            <div key={service.title} className="group border border-border bg-card p-6 shadow-[var(--shadow-soft)] transition-transform duration-300 hover:-translate-y-1">
              <div className="mb-5 inline-flex rounded-full border border-primary/20 bg-primary/8 p-3 text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="mb-3 text-lg font-semibold">{service.title}</h3>
              <p className="text-sm leading-7 text-muted-foreground">{service.description}</p>
            </div>
          ))}
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
            <Button className="w-fit rounded-sm px-6">Send Request</Button>
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
          <Button asChild className="rounded-sm px-6">
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
        description="At Uppal Decor, we believe architecture is more than buildings — it shapes lives, our cities, and future impact."
        primaryLabel="Explore Our Work"
        primaryTo="/projects"
        image={media.heroAlt}
      />
      <IntroSplit />
      <MissionBand />
      <StatsBand />
      <FounderBand />
      <TeamBand compact />
      <ContactStrip />
    </>
  );
}

function MissionBand() {
  return (
    <section className="border-b border-border/60 bg-background py-20">
      <div className="mx-auto grid max-w-[1200px] gap-6 px-4 md:px-6 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Our Story</p>
          <p className="text-base leading-8 text-muted-foreground">
            Founded on a passion for architecture and a commitment to excellence, Uppal Decor was established to challenge convention and deliver timeless spaces.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
            <h3 className="mb-4 text-xl font-semibold">Our Mission</h3>
            <p className="text-base leading-8 text-muted-foreground">
              To create intelligent architectural solutions that inspire, enrich lives, and contribute positively to the environment and communities we touch.
            </p>
          </div>
          <div className="border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
            <h3 className="mb-4 text-xl font-semibold">Our Values</h3>
            <div className="grid gap-3">
              {values.slice(1, 5).map((value) => (
                <div key={value} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FounderBand() {
  return (
    <section className="border-b border-border/60 bg-background py-20">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-4 md:px-6 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
        <img src={media.collageA} alt="Founder portrait setting" className="h-[420px] w-full object-cover shadow-[var(--shadow-soft)]" loading="lazy" />
        <div className="border border-border bg-card p-8 shadow-[var(--shadow-soft)] md:p-10">
          <p className="mb-5 text-5xl leading-none text-primary">“</p>
          <h3 className="max-w-[16ch] text-3xl font-semibold leading-tight">Architecture is a responsibility — and a privilege.</h3>
          <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">
            Every project we take on is an opportunity to shape a better future. Beyond walls and materials, we are here to shape places that transform lives and enrich the world we live in.
          </p>
          <div className="mt-6 text-sm text-muted-foreground">
            <div className="font-semibold text-foreground">Ar. Anugam Uppal</div>
            <div>Founder & Principal Architect</div>
          </div>
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
      />
      <CenteredHeading title="End-to-End Architectural Services" subtitle="We combine innovative ideas with expertise and industry best practices to deliver solutions that are functional, sustainable, and timeless." />
      <FullServicesGrid />
      <WhyChooseUsBand />
      <ProcessBand />
      <ContactStrip />
    </>
  );
}

function CenteredHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="border-b border-border/60 bg-background py-14">
      <div className="mx-auto max-w-[860px] px-4 text-center md:px-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">What We Do</p>
        <h2 className="text-3xl font-semibold leading-tight md:text-5xl">{title}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground">{subtitle}</p>
      </div>
    </section>
  );
}

function FullServicesGrid() {
  return (
    <section className="border-b border-border/60 bg-background py-16">
      <div className="mx-auto grid max-w-[1200px] gap-5 px-4 md:grid-cols-2 md:px-6 xl:grid-cols-6">
        {services.map((service) => (
          <div key={service.title} className="border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="mb-5 inline-flex rounded-full border border-primary/20 bg-primary/8 p-3 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="mb-3 text-base font-semibold uppercase tracking-[0.08em]">{service.title}</h3>
            <p className="text-sm leading-7 text-muted-foreground">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhyChooseUsBand() {
  return (
    <section className="border-b border-border/60 bg-background py-20">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-4 md:px-6 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Why Choose Us</p>
          <h2 className="max-w-[12ch] text-3xl font-semibold leading-tight md:text-5xl">Design Expertise You Can Rely On.</h2>
          <ul className="grid gap-3 text-sm text-muted-foreground">
            {[
              "Integrated design & delivery approach",
              "Experienced architects & engineers",
              "Advanced tools & technology",
              "Timely delivery & transparent process",
              "Quality, safety & compliance assured",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3"><ChevronRight className="mt-0.5 h-4 w-4 text-primary" />{item}</li>
            ))}
          </ul>
          <Button asChild className="rounded-sm px-6">
            <Link to="/about">Learn More About Us</Link>
          </Button>
        </div>
        <div className="grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-5">
            <div className="grid grid-cols-3 gap-4 border border-border bg-card p-6 shadow-[var(--shadow-soft)] text-center">
              <Metric value="250+" label="Projects Completed" icon={<Building2 className="h-5 w-5 text-primary" />} />
              <Metric value="98%" label="Client Satisfaction" icon={<ShieldCheck className="h-5 w-5 text-primary" />} />
              <Metric value="15+" label="Years Experience" icon={<Users className="h-5 w-5 text-primary" />} />
            </div>
            <img src={media.project4} alt="Commercial architecture" className="h-[260px] w-full object-cover shadow-[var(--shadow-soft)]" loading="lazy" />
          </div>
          <div className="grid gap-5">
            <img src={media.project2} alt="Residential architecture" className="h-[180px] w-full object-cover shadow-[var(--shadow-soft)]" loading="lazy" />
            <img src={media.collageC} alt="Interior detailing" className="h-[250px] w-full object-cover shadow-[var(--shadow-soft)]" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ value, label, icon }: { value: string; label: string; icon: ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-center">{icon}</div>
      <div className="text-3xl font-semibold">{value}</div>
      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
    </div>
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
      <div className="mx-auto flex max-w-[1200px] flex-wrap gap-4 px-4 md:px-6">
        {["All Projects", "Residential", "Commercial", "Educational", "Hospitality", "Mixed-use"].map((item, index) => (
          <div key={item} className={cn("rounded-full border px-5 py-3 text-sm", index === 0 ? "border-primary/30 bg-primary/8 text-primary" : "border-border text-muted-foreground")}>{item}</div>
        ))}
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
          <Button asChild className="rounded-sm px-6"><Link to="/projects">View All Projects</Link></Button>
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
      />
      <ProcessBand />
      <DetailedProcessGrid />
      <ValueStrip />
      <FaqBand />
      <ContactStrip />
    </>
  );
}

function DetailedProcessGrid() {
  return (
    <section className="border-b border-border/60 bg-background py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <div className="mb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">The Process, in Detail</p>
          <h2 className="text-3xl font-semibold md:text-5xl">How We Bring Your Vision to Life</h2>
        </div>
        <div className="grid gap-5 xl:grid-cols-5">
          {processSteps.map((step) => (
            <div key={step.number} className="border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
              <div className="mb-4 text-xl font-semibold text-primary">{step.number}</div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="mb-4 text-sm uppercase tracking-[0.15em] text-muted-foreground">{step.subtitle}</p>
              <img src={step.image} alt={step.title} className="mb-4 h-[8.5rem] w-full object-cover" loading="lazy" />
              <p className="text-sm leading-7 text-muted-foreground">{step.description}</p>
              <div className="mt-5 space-y-2">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Deliverables</div>
                {step.deliverables.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-muted-foreground"><ChevronRight className="mt-0.5 h-4 w-4 text-primary" />{item}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ValueStrip() {
  return (
    <section className="border-b border-border/60 bg-background py-16">
      <div className="mx-auto grid max-w-[1200px] gap-5 px-4 md:grid-cols-2 md:px-6 xl:grid-cols-6">
        <div className="space-y-4 xl:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Why Work With Us</p>
          <h2 className="max-w-[11ch] text-3xl font-semibold leading-tight">Designed Around You. Delivered with Excellence.</h2>
          <Button asChild className="rounded-sm px-6"><Link to="/contact">Let’s Build Together</Link></Button>
        </div>
        {[
          ["Collaborative Approach", Users],
          ["Transparent Process", Clock3],
          ["Design Excellence", Sparkles],
          ["On-Time Delivery", Award],
        ].map(([label, Icon]) => {
          const Lucide = Icon as typeof Users;
          return (
            <div key={label as string} className="border border-border bg-card p-5 text-center shadow-[var(--shadow-soft)]">
              <Lucide className="mx-auto mb-4 h-6 w-6 text-primary" />
              <h3 className="text-base font-semibold">{label as string}</h3>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FaqBand() {
  return (
    <section className="border-b border-border/60 bg-background py-20">
      <div className="mx-auto grid max-w-[1200px] gap-6 px-4 md:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">Frequently Asked Questions</p>
          <h2 className="mb-6 text-3xl font-semibold md:text-5xl">Everything You Need to Know</h2>
          <Accordion type="single" collapsible className="border border-border bg-card px-5 shadow-[var(--shadow-soft)]">
            {faqItems.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent className="text-sm leading-7 text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="grid gap-5">
          <img src={media.heroMain} alt="FAQ architecture visual" className="h-[320px] w-full object-cover shadow-[var(--shadow-soft)]" loading="lazy" />
          <div className="border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
            <h3 className="mb-4 text-2xl font-semibold">Have More Questions?</h3>
            <p className="mb-5 text-base leading-8 text-muted-foreground">
              We are here to help. Reach out to our team and let’s discuss your project in detail.
            </p>
            <Button asChild className="rounded-sm px-6"><Link to="/contact">Contact Our Team</Link></Button>
          </div>
        </div>
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
          <Button className="w-fit rounded-sm px-6">Read Full Article</Button>
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
          <Button className="h-12 rounded-sm px-6">Subscribe</Button>
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
            <Button className="md:col-span-2 w-fit rounded-sm px-6">Send Message</Button>
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
          <Button asChild className="rounded-sm px-6"><Link to="/contact">Meet Leadership</Link></Button>
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
      <HeroSection
        eyebrow="Featured Project"
        title="Luxury Villa"
        highlight="Haven"
        description="A seamless blend of modern architecture and natural harmony, designed for elevated living."
        primaryLabel="View Gallery"
        secondaryLabel="Discuss Project"
        secondaryTo="/contact"
        image={media.heroMain}
      />
      <ProjectOverviewBand />
      <ProjectHighlightsBand />
      <RelatedProjectsBand related={related} />
      <ContactStrip />
    </>
  );
}

function ProjectOverviewBand() {
  return (
    <section className="border-b border-border/60 bg-background py-20">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-4 md:px-6 lg:grid-cols-[0.66fr_1.34fr]">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Project Overview</p>
          <h2 className="max-w-[12ch] text-3xl font-semibold leading-tight md:text-5xl">Crafting Spaces That Inspire and Endure.</h2>
          <p className="max-w-md text-base leading-8 text-muted-foreground">
            Luxury Villa Haven is a private residence designed to offer serenity, functionality, and refined living. The villa blends soft forms with natural materials to create a calm retreat.
          </p>
          <Button className="rounded-sm px-6">Download Case Study</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <img src={media.heroMain} alt="Luxury villa exterior" className="h-full min-h-[380px] w-full object-cover shadow-[var(--shadow-soft)]" loading="lazy" />
          <div className="grid gap-4">
            <img src={media.collageC} alt="Villa interior lounge" className="h-[185px] w-full object-cover shadow-[var(--shadow-soft)]" loading="lazy" />
            <img src={media.project2} alt="Villa bedroom" className="h-[185px] w-full object-cover shadow-[var(--shadow-soft)]" loading="lazy" />
          </div>
        </div>
      </div>
      <div className="mx-auto mt-8 grid max-w-[1200px] gap-4 px-4 md:grid-cols-6 md:px-6">
        {[
          ["Project Type", "Residential"],
          ["Total Area", "6200 sq ft"],
          ["Duration", "14 Months"],
          ["Floors", "2"],
          ["Architect", "Uppal Decor"],
          ["Status", "Completed"],
        ].map(([label, value]) => (
          <div key={label as string} className="border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label as string}</div>
            <div className="mt-2 text-lg font-semibold">{value as string}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectHighlightsBand() {
  return (
    <section className="border-b border-border/60 bg-background py-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <div className="mb-8 grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">Design Highlights</p>
            <h2 className="max-w-[12ch] text-3xl font-semibold leading-tight md:text-5xl">Timeless Design. Thoughtful Details.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-4">
            {[
              ["Fluid Architecture", "Curved forms and open layouts create a sense of movement and openness."],
              ["Natural Light", "Expansive glazing maximizes daylight and connects indoors with nature."],
              ["Premium Materials", "A refined palette of stone, wood, and glass enhances durability and elegance."],
              ["Outdoor Living", "Landscaped terraces and water features extend relaxation and beauty."],
            ].map(([title, text]) => (
              <div key={title as string} className="border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
                <h3 className="mb-3 text-lg font-semibold">{title as string}</h3>
                <p className="text-sm leading-7 text-muted-foreground">{text as string}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-[0.95fr_0.1fr_0.95fr_1fr] lg:items-center">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">The Challenge</p>
            <h3 className="max-w-[12ch] text-3xl font-semibold leading-tight">Balancing Elegance with Functionality.</h3>
            <p className="mt-4 text-base leading-8 text-muted-foreground">The client envisioned a luxury home that felt open and elevated while ensuring lasting functionality, privacy, and family comfort.</p>
          </div>
          <div className="hidden justify-center lg:flex"><div className="grid h-14 w-14 place-items-center rounded-full border border-border bg-card shadow-[var(--shadow-soft)]"><ChevronRight className="h-5 w-5" /></div></div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">Our Solution</p>
            <h3 className="max-w-[12ch] text-3xl font-semibold leading-tight">Designing with Purpose and Precision.</h3>
            <p className="mt-4 text-base leading-8 text-muted-foreground">We crafted a design that brings together comfort and functionality. Every space prioritizes natural light, efficient planning, and elevated materiality.</p>
          </div>
          <div className="border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            {[
              "Curved roof crafted for flow and comfort",
              "Maximized natural light and views",
              "High-end materials for timeless appeal",
              "Smart zones and energy-efficient systems",
            ].map((item) => (
              <div key={item} className="mb-4 flex items-start gap-3 text-sm leading-7 text-muted-foreground last:mb-0"><ShieldCheck className="mt-1 h-4 w-4 text-primary" />{item}</div>
            ))}
          </div>
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
        showVideo
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
