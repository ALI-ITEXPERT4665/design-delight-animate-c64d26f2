import { PageFrame, ServicesPageContent } from "@/components/site-shell";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Architectural Services — UPPAL Design" },
      {
        name: "description",
        content: "Discover UPPAL Design's BIM modelling, visualisation, planning drawings, structural design, and construction support services.",
      },
      { property: "og:title", content: "Architectural Services — UPPAL Design" },
      {
        property: "og:description",
        content: "Discover UPPAL Design's BIM modelling, visualisation, planning drawings, structural design, and construction support services.",
      },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <PageFrame>
      <ServicesPageContent />
    </PageFrame>
  );
}
