import { PageFrame, TeamPageContent } from "@/components/site-shell";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team — UPPAL Design" },
      {
        name: "description",
        content: "Meet the architects, designers, and specialists behind UPPAL Design's projects.",
      },
      { property: "og:title", content: "Team — UPPAL Design" },
      {
        property: "og:description",
        content: "Meet the architects, designers, and specialists behind UPPAL Design's projects.",
      },
      { property: "og:url", content: "/team" },
    ],
    links: [{ rel: "canonical", href: "/team" }],
  }),
  component: TeamPage,
});

function TeamPage() {
  return (
    <PageFrame>
      <TeamPageContent />
    </PageFrame>
  );
}
