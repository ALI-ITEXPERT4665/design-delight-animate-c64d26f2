import { PageFrame, ProjectDetailContent } from "@/components/site-shell";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/project-detail")({
  head: () => ({
    meta: [
      { title: "Luxury Villa Haven — UPPAL Design" },
      {
        name: "description",
        content: "View the project story, design highlights, and gallery for Luxury Villa Haven by UPPAL Design.",
      },
      { property: "og:title", content: "Luxury Villa Haven — UPPAL Design" },
      {
        property: "og:description",
        content: "View the project story, design highlights, and gallery for Luxury Villa Haven by UPPAL Design.",
      },
      { property: "og:url", content: "https://uppaldb.site/project-detail" },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: "https://uppaldb.site/project-detail" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          additionalType: "https://schema.org/Residence",
          name: "Luxury Villa Haven",
          description: "A modern luxury villa with refined interiors, designed by UPPAL Design.",
          image: "https://uppaldb.site/favicon.png",
          creator: { "@type": "Organization", name: "UPPAL Design" },
          url: "https://uppaldb.site/project-detail",
        }),
      },
    ],
  }),
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  return (
    <PageFrame>
      <ProjectDetailContent />
    </PageFrame>
  );
}
