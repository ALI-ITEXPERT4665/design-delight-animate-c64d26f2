import { ContactPageContent, PageFrame } from "@/components/site-shell";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact UPPAL Design" },
      {
        name: "description",
        content: "Contact UPPAL Design to discuss your project, request a consultation, or visit the London studio.",
      },
      { property: "og:title", content: "Contact UPPAL Design" },
      {
        property: "og:description",
        content: "Contact UPPAL Design to discuss your project, request a consultation, or visit the London studio.",
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <PageFrame>
      <ContactPageContent />
    </PageFrame>
  );
}
