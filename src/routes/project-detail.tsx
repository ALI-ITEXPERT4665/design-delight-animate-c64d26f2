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
      { property: "og:url", content: "/project-detail" },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: "/project-detail" }],
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
