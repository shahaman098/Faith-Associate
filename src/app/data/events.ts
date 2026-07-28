export type EventPageData = {
  slug: string;
  eyebrow: string;
  title: string;
  summary: string;
  cardSummary: string;
  category: string;
  client: string;
  date: string;
  location: string;
  time: string;
  heroImage: string;
  posterImage: string;
  posterAlt: string;
  registrationUrl: string;
  overview: string[];
  focusAreas: { title: string; body: string }[];
};

export const eventPages: EventPageData[] = [
  {
    slug: "national-emergency-conference-uk-mosque-safety-and-security",
    eyebrow: "Events",
    title: "Strengthening Mosque Security Through National Emergency Planning",
    summary:
      "Practical national guidance, local planning, and partnership-led support to help mosques, madrassahs, Islamic centres, Imams, Alimahs, teachers, administrators, and community leaders strengthen safety, security, and emergency preparedness.",
    cardSummary:
      "Practical guidance for mosques, madrassahs and Islamic centres on security planning, emergency preparedness and partnership-led resilience.",
    category: "Community Safety & Security",
    client: "UK Mosques, Islamic Centres & Madrassahs",
    date: "Saturday, 25 July 2026",
    location: "Birmingham",
    time: "10:00 AM - 4:00 PM",
    heroImage:
      "https://faithassociates.co.uk/wp-content/uploads/2026/07/national-emergency-conference-2026-1110x550.png",
    posterImage:
      "https://faithassociates.co.uk/wp-content/uploads/2026/07/national-emergency-conference-2026.png",
    posterAlt: "Emergency National Conference UK Mosque and Madrassah Security poster",
    registrationUrl:
      "https://www.eventbrite.co.uk/e/national-emergency-conference-uk-mosque-safety-and-security-tickets-1992844342073?aff=oddtdtcreator",
    overview: [
      "The National Emergency Conference brings together mosque leaders, madrassah representatives, Islamic centre administrators, Imams, Alimahs, teachers, security personnel, and community stakeholders to discuss practical safety and security measures for Muslim institutions across the UK.",
      "The conference focuses on the theme National Plan - Local Action, supporting local communities to understand security risks, develop emergency response plans, improve safeguarding arrangements, and strengthen preparedness across mosques, madrassahs, and Islamic centres.",
      "Attendees will gain insight into mosque security profiling, round-table planning, community infrastructure protection, man guarding options, hate crime reporting, and the role of academic and scholarly approaches in improving safety and resilience.",
      "This in-person conference is designed to encourage collaboration, shared learning, and practical action, helping Muslim institutions prepare effectively while maintaining safe, welcoming, and accessible spaces for worship, education, and community life.",
    ],
    focusAreas: [
      {
        title: "National guidance, local action",
        body: "Turn national protective-security thinking into site-specific plans that leadership teams, teachers and volunteers can use locally.",
      },
      {
        title: "Emergency planning",
        body: "Build proportionate emergency response arrangements, clearer escalation routes and practical preparedness across worship and education settings.",
      },
      {
        title: "Community protection",
        body: "Strengthen mosque security profiling, infrastructure protection, man guarding options and safer day-to-day operating practice.",
      },
      {
        title: "Reporting and resilience",
        body: "Improve hate-crime reporting, partnership working and evidence-based learning that supports safer, more resilient institutions.",
      },
    ],
  },
];

export function getEvent(slug: string) {
  return eventPages.find((event) => event.slug === slug);
}
