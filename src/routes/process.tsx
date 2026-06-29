import { PageFrame, ProcessPageContent } from "@/components/site-shell";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/process")({
  head: () => ({
    meta: [
      { title: "Design Process — UPPAL Design" },
      {
        name: "description",
        content: "See how UPPAL Design guides projects from concept and planning through visualisation, documentation, and construction.",
      },
      { property: "og:title", content: "Design Process — UPPAL Design" },
      {
        property: "og:description",
        content: "See how UPPAL Design guides projects from concept and planning through visualisation, documentation, and construction.",
      },
      { property: "og:url", content: "/process" },
    ],
    links: [{ rel: "canonical", href: "/process" }],
  }),
  component: ProcessPage,
});

function ProcessPage() {
  return (
    <PageFrame>
      <ProcessPageContent />
    </PageFrame>
  );
}
