import type { Metadata } from "next";
import { EditorialHero } from "../components/EditorialHero";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { CmsPage } from "../components/cms/CmsPage";
import { EditableText } from "../components/cms/EditableText";
import { loadCmsPage } from "@/lib/cms/page-helpers";

export const metadata: Metadata = {
  title: "Privacy Policy | Faith Associates",
  description: "Faith Associates privacy policy and information about how personal data is handled.",
};

type LegalSection = {
  title: string;
  body: string;
};

const sections: LegalSection[] = [
  {
    title: "Information we collect",
    body: "We may collect information you provide through enquiry, event, training or publication forms, including your name, organisation, contact details and the nature of your request.",
  },
  {
    title: "How information is used",
    body: "Information is used to respond to enquiries, deliver requested services, administer training or events, maintain appropriate records and—where you have opted in—share relevant updates.",
  },
  {
    title: "Cookies and analytics",
    body: "The website may use essential cookies and privacy-conscious analytics to understand site use, maintain security and improve the experience. Browser controls can be used to manage cookies.",
  },
  {
    title: "Service providers",
    body: "Trusted form, email, analytics and technology providers may process information on our behalf. They are expected to handle it securely and only for the agreed purpose.",
  },
  {
    title: "Data sharing",
    body: "We do not sell personal data. Information is shared only where necessary to deliver a requested programme, meet a legal obligation, protect legitimate interests or where you have given permission.",
  },
  {
    title: "Security and retention",
    body: "Reasonable organisational and technical measures are used to protect information. Records are retained only for as long as needed for the purpose collected, legal requirements or legitimate operational needs.",
  },
  {
    title: "Your rights",
    body: "Depending on the applicable law, you may ask to access, correct, restrict or delete personal information, object to certain processing or withdraw consent.",
  },
  {
    title: "Contact",
    body: "Privacy questions and requests can be sent to info@faithassociates.co.uk or to Faith Associates, 41 Baker Street, High Wycombe, HP11 2RZ.",
  },
];

export default async function PrivacyPage() {
  const { settings, page } = await loadCmsPage("/privacy");
  const blocks = page?.blocks as Record<string, unknown> | undefined;
  const legalBlocks = blocks as
    | Partial<{
        lastReviewed: string;
        sections: Array<LegalSection | [string, string]>;
      }>
    | undefined;
  const hero = blocks?.hero as
    | Partial<{
        eyebrow: string;
        title: string;
        summary: string;
        image: string;
      }>
    | undefined;
  const visibleSections: Array<LegalSection & { titlePath: string; bodyPath: string }> =
    Array.isArray(legalBlocks?.sections) && legalBlocks.sections.length
      ? legalBlocks.sections.map((section, index) => {
          if (Array.isArray(section)) {
            return {
              title: String(section[0] ?? ""),
              body: String(section[1] ?? ""),
              titlePath: `sections.${index}.0`,
              bodyPath: `sections.${index}.1`,
            };
          }

          return {
            title: String(section.title ?? ""),
            body: String(section.body ?? ""),
            titlePath: `sections.${index}.title`,
            bodyPath: `sections.${index}.body`,
          };
        })
      : sections.map((section, index) => ({
          ...section,
          titlePath: `sections.${index}.title`,
          bodyPath: `sections.${index}.body`,
        }));
  return (
    <CmsPage path="/privacy" blocks={page?.blocks}>
    <main id="main-content" className="min-h-screen bg-white text-[var(--ink)]">
      <SiteHeader settings={settings} />
      <EditorialHero
        eyebrow={hero?.eyebrow ?? "Legal"}
        title={hero?.title ?? "Privacy policy"}
        summary={hero?.summary ?? "How Faith Associates collects, uses and protects personal information."}
        image={hero?.image ?? "/assets/real/about-fa-training-room.png"}
      />
      <section className="band band-white">
        <div className="section-shell max-w-4xl">
          <p className="type-body text-sm text-[var(--muted)]">
            Last reviewed: <EditableText value={legalBlocks?.lastReviewed ?? "16 July 2026."} path="lastReviewed" />
          </p>
          <div className="mt-10 border-t border-[var(--line)]">
            {visibleSections.map((section, index) => (
              <section
                key={`${section.title}-${index}`}
                className="grid gap-4 border-b border-[var(--line)] py-8 sm:grid-cols-[0.14fr_0.86fr] sm:gap-8"
              >
                <p className="index-number index-number--quiet" aria-hidden="true">0{index + 1}</p>
                <div>
                  <h2 className="type-title text-[1.35rem] text-[var(--ink)]">
                    <EditableText value={section.title} path={section.titlePath} />
                  </h2>
                  <p className="type-body mt-4 text-[var(--muted)]">
                    <EditableText value={section.body} path={section.bodyPath} multiline />
                  </p>
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter settings={settings} />
    </main>
    </CmsPage>
  );
}
