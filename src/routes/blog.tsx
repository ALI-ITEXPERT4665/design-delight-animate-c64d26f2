import { BlogPageContent, PageFrame } from "@/components/site-shell";
import { faqItems } from "@/lib/site-data";
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
      { property: "og:url", content: "https://uppaldb.site/blog" },
    ],
    links: [{ rel: "canonical", href: "https://uppaldb.site/blog" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }),
      },
    ],
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
