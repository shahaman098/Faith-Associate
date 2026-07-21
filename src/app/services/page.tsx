import type { Metadata } from "next";
import { EditorialDirectory } from "../components/EditorialDirectory";
import { services } from "../data/site-content";

export const metadata: Metadata = {
  title: "Services | Faith Associates",
  description: "Explore Faith Associates services for mosque governance, madrassah support, safeguarding, leadership, strategy and protective security.",
};

/** Category-level services only — individual trainings live under each catalogue page. */
const directoryServices = services.filter((service) =>
  [
    "mosque-services",
    "madrassah-support",
    "imam-services",
    "strategic-services",
    "safeguarding",
    "safety",
  ].includes(service.slug),
);

export default function ServicesPage() {
  return (
    <EditorialDirectory
      eyebrow="What we do"
      title="Specialist support for faith institutions."
      summary="Practical services shaped by two decades of work with leaders, trustees, volunteers and public-sector partners."
      image="/assets/real/security-training-session.jpg"
      introTitle="Deep sector knowledge, translated into practical change."
      introBody="Faith institutions operate in a complex environment. Our services bring together governance, safety, leadership and delivery expertise so teams can act with greater clarity and confidence."
      items={directoryServices}
      basePath="/services"
    />
  );
}
