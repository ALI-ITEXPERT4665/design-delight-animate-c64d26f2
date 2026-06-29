import { HomePageContent, PageFrame } from "@/components/site-shell";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UPPAL Design — Intelligent Architecture" },
      {
        name: "description",
        content: "Explore UPPAL Design's architecture studio, featured projects, services, and refined design process across the UK.",
      },
      { property: "og:title", content: "UPPAL Design — Intelligent Architecture" },
      {
        property: "og:description",
        content: "Explore UPPAL Design's architecture studio, featured projects, services, and refined design process across the UK.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <PageFrame>
      <HomePageContent />
    </PageFrame>
  );
}
