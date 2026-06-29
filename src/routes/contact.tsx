import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { siteSettings, pageVideos, media } from "@/lib/site-data";
import { BackgroundVideo } from "@/components/background-video";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — UPPAL Design" },
      { name: "description", content: "Begin a conversation with the studio. Send a brief, book a visit, or call the front desk." },
      { property: "og:title", content: "Contact — UPPAL Design" },
      { property: "og:description", content: "Begin a conversation with the studio. Send a brief, book a visit, or call the front desk." },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <main className="bg-background text-foreground pt-24">
      {/* ── Two-pane: form / studio ───────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 pt-20 pb-24 md:px-10 md:pt-28">
        <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-primary">— Begin a conversation</p>
        <h1 className="mt-8 max-w-[14ch] text-[clamp(2.5rem,7vw,6rem)] font-light leading-[0.95] tracking-tight">
          Tell us about<br />the <em className="italic font-light text-primary">project.</em>
        </h1>

        <div className="mt-20 grid gap-16 lg:grid-cols-[1.2fr_0.9fr] lg:gap-24">
          {/* form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="space-y-10"
          >
            <Field label="Your name" name="name" />
            <Field label="Email" name="email" type="email" />
            <Field label="Phone (optional)" name="phone" />
            <Field label="Project type" name="type" placeholder="Residential, workplace, cultural…" />
            <Field label="Tell us a little about it" name="message" textarea />
            <button
              type="submit"
              disabled={sent}
              className="btn-sheen group inline-flex items-center gap-3 border border-foreground px-8 py-4 text-[11px] font-medium uppercase tracking-[0.28em] transition hover:border-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-60"
            >
              {sent ? "Thank you — we’ll be in touch" : "Send brief"}
              <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
          </form>

          {/* studio info */}
          <aside className="space-y-12">
            <div className="media-hover overflow-hidden">
              <img src={media.officeStudio} alt="The studio" className="h-[300px] w-full object-cover md:h-[360px]" />
            </div>

            <InfoRow icon={Phone} label="Call" lines={[siteSettings.phone, siteSettings.altPhone]} />
            <InfoRow icon={Mail} label="Write" lines={[siteSettings.email]} />
            <InfoRow icon={MapPin} label="Visit" lines={[siteSettings.address, "Mon–Fri · 10:00 – 18:00"]} />

            <div className="border-t border-border/60 pt-8">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">Press & speaking</p>
              <p className="mt-3 text-[14px] leading-[1.7]">For press, lectures and academic enquiries, please write to <a className="story-link" href="mailto:press@uppaldesign.co.uk">press@uppaldesign.co.uk</a></p>
            </div>
          </aside>
        </div>
      </section>

      {/* ── CTA video band ───────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="relative h-[50vh] min-h-[380px]">
          <BackgroundVideo src={pageVideos.contact} poster={media.heroMain} />
          <div className="absolute inset-0 bg-black/65" />
          <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col items-start justify-center px-6 text-white md:px-10">
            <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-white/70">— Studio hours</p>
            <h2 className="mt-6 max-w-3xl text-[clamp(2rem,4vw,3.25rem)] font-light leading-[1.05] tracking-tight">
              Drop in. There&apos;s always coffee on.
            </h2>
            <p className="mt-6 max-w-xl text-[14px] leading-[1.8] text-white/80">
              {siteSettings.address}. The studio is best reached by foot from Covent Garden — ring the brass bell marked &lsquo;Uppal&rsquo;.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  textarea,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
}) {
  return (
    <label className="group block border-b border-border/60 pb-3 transition-colors focus-within:border-primary">
      <span className="block text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground group-focus-within:text-primary">
        {label}
      </span>
      {textarea ? (
        <textarea
          name={name}
          rows={4}
          placeholder={placeholder}
          className="mt-3 w-full resize-none border-0 bg-transparent p-0 text-lg leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
        />
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          className="mt-3 w-full border-0 bg-transparent p-0 text-lg text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
        />
      )}
    </label>
  );
}

function InfoRow({
  icon: Icon,
  label,
  lines,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  lines: string[];
}) {
  return (
    <div className="row-reveal flex items-start gap-6 border-t border-border/60 pt-8">
      <Icon className="mt-1 h-5 w-5 text-primary" />
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">{label}</p>
        {lines.map((l) => (
          <p key={l} className="mt-2 text-[15px] leading-[1.7] text-foreground">{l}</p>
        ))}
      </div>
    </div>
  );
}
