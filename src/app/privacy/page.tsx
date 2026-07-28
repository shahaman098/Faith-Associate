import type { Metadata } from "next";
import { EditorialHero } from "../components/EditorialHero";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { CmsPage } from "../components/cms/CmsPage";
import { loadCmsPage } from "@/lib/cms/page-helpers";

export const metadata: Metadata = {
  title: "Privacy Policy | Faith Associates",
  description: "Faith Associates privacy policy and information about how personal data is handled.",
};

const sections = [
  [
    "Information we collect",
    "We may collect information you provide through enquiry, event, training or publication forms, including your name, organisation, contact details and the nature of your request.",
  ],
  [
    "How information is used",
    "Information is used to respond to enquiries, deliver requested services, administer training or events, maintain appropriate records and—where you have opted in—share relevant updates.",
  ],
  [
    "Cookies and analytics",
    "The website may use essential cookies and privacy-conscious analytics to understand site use, maintain security and improve the experience. Browser controls can be used to manage cookies.",
  ],
  [
    "Service providers",
    "Trusted form, email, analytics and technology providers may process information on our behalf. They are expected to handle it securely and only for the agreed purpose.",
  ],
  [
    "Data sharing",
    "We do not sell personal data. Information is shared only where necessary to deliver a requested programme, meet a legal obligation, protect legitimate interests or where you have given permission.",
  ],
  [
    "Security and retention",
    "Reasonable organisational and technical measures are used to protect information. Records are retained only for as long as needed for the purpose collected, legal requirements or legitimate operational needs.",
  ],
  [
    "Your rights",
    "Depending on the applicable law, you may ask to access, correct, restrict or delete personal information, object to certain processing or withdraw consent.",
  ],
  [
    "Contact",
    "Privacy questions and requests can be sent to info@faithassociates.co.uk or to Faith Associates, 41 Baker Street, High Wycombe, HP11 2RZ.",
  ],
];

export default async function PrivacyPage() {
  const { settings, page } = await loadCmsPage("/privacy");
  const blocks = page?.blocks as Record<string, any> | undefined;
  const hero = blocks?.hero;
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
      <section className="py-12 lg:py-20">
        <div className="section-shell max-w-4xl">
          <p className="type-body text-sm text-[var(--muted)]">Last reviewed: 16 July 2026.</p>
          <div className="mt-10 border-t border-[var(--line)]">
            {sections.map(([title, body], index) => (
              <section
                key={title}
                className="grid gap-4 border-b border-[var(--line)] py-8 sm:grid-cols-[0.12fr_0.88fr]"
              >
                <p className="capability-index">0{index + 1}</p>
                <div>
                  <h2 className="type-title text-[1.35rem] text-[var(--ink)]">{title}</h2>
                  <p className="type-body mt-4 text-[var(--muted)]">{body}</p>
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
