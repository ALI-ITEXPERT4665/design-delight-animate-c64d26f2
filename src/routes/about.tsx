import { AboutPageContent, PageFrame } from "@/components/site-shell";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About UPPAL Design" },
      {
        name: "description",
        content: "Learn about UPPAL Design's story, mission, values, leadership, and architectural approach.",
      },
      { property: "og:title", content: "About UPPAL Design" },
      {
        property: "og:description",
        content: "Learn about UPPAL Design's story, mission, values, leadership, and architectural approach.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageFrame>
      <AboutPageContent />
    </PageFrame>
  );
}
