import type { HomeBlocks } from "@/lib/cms/types";

/**
 * Single source for the homepage guided-support boxes.
 * Imported by both `GuidedSupportSection` and the CMS seed so the two cannot drift.
 *
 * Every box links straight to its destination page — the client review asked for no
 * refine or email step in front of navigation. Where a topic spans more than one page,
 * the extra routes render on the card as direct links too.
 */
export const guidedSupportTopics: HomeBlocks["guidedSupport"]["topics"] = [
  {
    label: "Mosque governance",
    href: "/services/mosque-services",
    summary: "Governance, constitutions, policies and procedures for mosques and Islamic centres.",
    icon: "institution",
    destinations: [
      { label: "Policies & procedures", href: "/services/mosque-policy-and-procedure-development" },
      { label: "Election management", href: "/services/mosque-election-management" },
    ],
  },
  {
    label: "Madrassah support",
    href: "/services/madrassah-support",
    summary: "Management, teacher training and safeguarding for madrassahs and supplementary schools.",
    icon: "training",
    destinations: [
      { label: "Madrassah teacher training", href: "/services/madrassah-teacher-training" },
    ],
  },
  {
    label: "Leadership training",
    href: "/projects/faith-associates-academy",
    summary: "Faith Associates Academy — leadership development for imams, trustees and managers.",
    icon: "leadership",
    destinations: [
      {
        label: "Mosque management masterclass",
        href: "/services/1-day-mosque-management-governance-master-class-training",
      },
    ],
  },
  {
    label: "Safeguarding",
    href: "/services/safeguarding",
    summary: "Accredited safeguarding training, designated leads and institutional reviews.",
    icon: "safeguarding",
    destinations: [
      { label: "Designated safeguarding lead", href: "/services/designated-safeguarding-lead" },
      { label: "Safer recruitment", href: "/services/safer-recruitment-training" },
    ],
  },
  {
    label: "Imam services",
    href: "/services/imam-services",
    summary: "Recruitment, chaplaincy awareness and continuing development for faith leaders.",
    icon: "cohesion",
    destinations: [{ label: "Imam e-safety training", href: "/services/imam-e-safety-training" }],
  },
  {
    label: "Security & safety",
    href: "/services/safety",
    summary: "Online and offline safety, security risk assessment and Protect Duty readiness.",
    icon: "security",
    destinations: [
      { label: "Security risk assessment", href: "/services/mosque-security-risk-assessment" },
      { label: "Mosque Security programme", href: "/projects/mosque-security" },
    ],
  },
  {
    label: "Strategic services",
    href: "/services/strategic-services",
    summary: "Campaign planning, conferences, media planning and facilitated away days.",
    icon: "networks",
    destinations: [{ label: "All projects", href: "/projects" }],
  },
  {
    label: "International work",
    href: "/international",
    summary: "Programmes and partnerships across three continents.",
    icon: "networks",
    destinations: [],
  },
  {
    label: "Publications",
    href: "/publications",
    summary: "Guides, toolkits and standards for faith institutions.",
    icon: "document",
    destinations: [],
  },
  {
    label: "Events & networks",
    href: "/events",
    summary: "Mosque Expo, the Beacon Mosque Awards and the national events programme.",
    icon: "sport",
    destinations: [
      { label: "Mosque Expo", href: "/projects/mosque-expo" },
      { label: "Beacon Mosque Awards", href: "/projects/british-beacon-mosque-awards" },
    ],
  },
];

export const guidedSupportContent: HomeBlocks["guidedSupport"] = {
  image: "/assets/real/guided-support-training.jpg",
  title: "Tell us what you need. We will take you straight there.",
  body: "Every route below opens the service page it names — no forms and no questions in the way.",
  topics: guidedSupportTopics,
};
