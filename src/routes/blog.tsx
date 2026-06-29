import { BlogPageContent, PageFrame } from "@/components/site-shell";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — UPPAL Design" },
      {
        name: "description",
        content: "Read architecture insights, sustainable design ideas, project stories, and studio updates from UPPAL Design.",
      },
      { property: "og:title", content: "Blog — UPPAL Design" },
      {
        property: "og:description",
        content: "Read architecture insights, sustainable design ideas, project stories, and studio updates from UPPAL Design.",
      },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <PageFrame>
      <BlogPageContent />
    </PageFrame>
  );
}
