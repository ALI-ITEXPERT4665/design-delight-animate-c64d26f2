import { PageFrame, ProjectsPageContent } from "@/components/site-shell";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — UPPAL Design" },
      {
        name: "description",
        content: "Browse residential, commercial, hospitality, and mixed-use projects by UPPAL Design.",
      },
      { property: "og:title", content: "Projects — UPPAL Design" },
      {
        property: "og:description",
        content: "Browse residential, commercial, hospitality, and mixed-use projects by UPPAL Design.",
      },
      { property: "og:url", content: "/projects" },
    ],
    links: [{ rel: "canonical", href: "/projects" }],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  return (
    <PageFrame>
      <ProjectsPageContent />
    </PageFrame>
  );
}
