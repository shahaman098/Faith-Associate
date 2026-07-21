import type { Metadata } from "next";
import { EditorialDirectory } from "../components/EditorialDirectory";
import { projects } from "../data/site-content";

export const metadata: Metadata = {
  title: "Projects & Programmes | Faith Associates",
  description: "Explore Faith Associates flagship projects across mosque standards, leadership, protective security, sport, sustainability and digital engagement.",
};

export default function ProjectsPage() {
  return (
    <EditorialDirectory
      eyebrow="Projects & programmes"
      title="Platforms that move whole sectors forward."
      summary="Flagship programmes that connect people, build standards and turn partnerships into visible community impact."
      image="/assets/real/mosque-expo-awards-hall.jpg"
      introTitle="Built to convene, equip and inspire."
      introBody="Our projects respond to recurring sector needs: stronger institutions, safer worship, confident leaders, inclusive opportunities and visible standards of excellence."
      items={projects}
      basePath="/projects"
    />
  );
}
