import { eventPages as events } from "@/app/data/events";
import { guidedSupportContent } from "@/app/data/guided-support";
import { publications } from "@/app/data/publications";
import { serviceCatalogues, serviceOfferings } from "@/app/data/service-catalogues";
import { history, newsItems, projects, services, team } from "@/app/data/site-content";
import type { EntryRecord, HomeBlocks, PageRecord, SeedPayload, SiteSettingsData } from "./types";

const social = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/faith-associates/" },
  { label: "Facebook", href: "https://www.facebook.com/FaithAssociates1/" },
  { label: "X", href: "https://x.com/faithassociates" },
];

const navigation: SiteSettingsData["header"]["navigation"] = [
  {
    label: "About",
    href: "/about",
    children: [
      ["Our story", "/about"],
      ["Organisation history", "/about/history"],
      ["Our clients", "/about/clients"],
      ["Our team", "/about/team"],
      ["Our approach", "/about/approach"],
      ["Careers", "/about/careers"],
      ["Vacancies", "/about/vacancies"],
    ],
  },
  {
    label: "Services",
    href: "/services",
    children: [
      ["Mosque services", "/services/mosque-services"],
      ["Madrassah support", "/services/madrassah-support"],
      ["Imam services", "/services/imam-services"],
      ["Strategic services", "/services/strategic-services"],
      ["Safeguarding", "/services/safeguarding"],
      ["Safety", "/services/safety"],
    ],
  },
  {
    label: "Projects",
    href: "/projects",
    children: [
      ["Mosque Expo", "/projects/mosque-expo"],
      ["Beacon Mosque Awards", "/projects/british-beacon-mosque-awards"],
      ["Faith Associates Academy", "/projects/faith-associates-academy"],
      ["Mosque Security", "/projects/mosque-security"],
      ["Fattah Cup", "/projects/fattah-cup"],
      ["Eman Cup", "/projects/eman-cup"],
    ],
  },
  { label: "International", href: "/international" },
  { label: "Publications", href: "/publications" },
  {
    label: "News & events",
    href: "/news",
    children: [
      ["Latest news", "/news"],
      ["Events", "/events"],
    ],
  },
];

const settings: SiteSettingsData = {
  seo: {
    title: "Faith Associates | Building Standards Across The Globe",
    description:
      "Faith Associates are a global consultancy empowering communities, building standards and protecting places of worship across the world.",
    keywords: [
      "faith institution consultancy",
      "mosque governance",
      "madrassah safeguarding",
      "mosque security",
      "faith leadership",
      "community development",
    ],
    ogImage: {
      url: "/assets/real/mosque-expo-2024-hall.jpg",
      width: 1110,
      height: 550,
      alt: "Faith Associates leaders and partners at Mosque Expo",
    },
  },
  contact: {
    addressLines: ["Faith Associates", "41 Baker Street", "High Wycombe", "HP11 2RZ"],
    phoneDisplay: "+44 (0) 1494 416202",
    phoneTel: "+441494416202",
    email: "info@faithassociates.co.uk",
    hours: "9:30–18:00, Monday to Friday",
  },
  header: {
    tagline: "Building standards across the globe",
    phone: "+44 (0) 1494 416202",
    navigation,
    social,
  },
  footer: {
    blurb: "Building standards, resilience and leadership across faith institutions and communities worldwide.",
    social,
    groups: [
      {
        title: "Services",
        links: [
          ["All services", "/services"],
          ["Mosque services", "/services/mosque-services"],
          ["Safeguarding", "/services/safeguarding"],
          ["Safety", "/services/safety"],
          ["Strategic services", "/services/strategic-services"],
        ],
      },
      {
        title: "Explore",
        links: [
          ["About us", "/about"],
          ["Projects", "/projects"],
          ["Publications", "/publications"],
          ["International", "/international"],
        ],
      },
      {
        title: "News & events",
        links: [
          ["Latest news", "/news"],
          ["Events", "/events"],
        ],
      },
    ],
    ctaLabel: "Contact the team",
    ctaHref: "/contact",
    copyright: "© 2026 Faith Associates",
    email: "info@faithassociates.co.uk",
    phone: "+44 (0) 1494 416202",
  },
};

const homeBlocks: HomeBlocks = {
  hero: {
    video: "/assets/real/hero-law-society.mp4",
    poster: "/assets/real/hero-law-society-poster.jpg",
    messages: [
      { eyebrow: "Faith Associates 2026", title: "Raising standards for faith institutions.", body: "Practical support for mosques, madrassahs and community leaders.", ctaLabel: "Explore our work", href: "/projects" },
      { eyebrow: "Security and resilience", title: "Safer mosques. Stronger governance.", body: "Training, guidance and standards for places of worship.", ctaLabel: "See our services", href: "/services" },
      { eyebrow: "Leadership and networks", title: "Developing leaders and community impact.", body: "Programmes, partnerships and events that strengthen institutions.", ctaLabel: "View programmes", href: "/projects" },
    ],
    stories: [
      { label: "Mosque Security", href: "/projects/mosque-security" },
      { label: "Leadership Development", href: "/projects/faith-associates-academy" },
      { label: "International Networks", href: "/international" },
      { label: "Mosque Expo 2026", href: "/projects/mosque-expo", active: true },
    ],
  },
  whatWeDo: {
    title: "What we do",
    body: "Specialist consultancy across governance, security, leadership and international networks.",
    capabilities: [
      { title: "Institutional Development", body: "Governance, standards, leadership and practical support for mosques, madrassahs and faith charities.", icon: "institution" },
      { title: "Protective Security", body: "Training, risk awareness and incident guidance for places of worship and community institutions.", icon: "security" },
      { title: "Cohesion Programmes", body: "Sport, youth engagement and partnership programmes that build cohesion across communities.", icon: "cohesion" },
      { title: "Global Networks", body: "International convening, research and knowledge sharing across faith institution leadership networks.", icon: "networks" },
    ],
  },
  guidedSupport: guidedSupportContent,
  whoWeAre: {
    eyebrow: "Who we are",
    title: "We work with you to raise standards in faith institutions.",
    body: [
      "Faith Associates is a specialist consultancy helping mosques, madrassahs and community organisations overcome critical challenges and seize their greatest opportunities.",
      "Our work is rooted in deep collaboration across a global network of practitioners dedicated to building capable, resilient and trusted faith institutions every day.",
    ],
    image: "/assets/real/who-we-are-roundtable.jpg",
    imageAlt: "Faith Associates roundtable with community leaders at Al Manaar",
    ctaLabel: "More about us",
    ctaHref: "/about",
    secondaryCtaLabel: "Our history since 2004",
    secondaryCtaHref: "/about/history",
    statValue: "5000+",
    statLabel: "Mosques",
    statSublabel: "Supported across communities",
    stats: [
      { value: "5000+", label: "Mosques supported" },
      { value: "3467+", label: "Madrassahs engaged" },
      { value: "20+", label: "Years of impact" },
    ],
    slides: [
      { title: "Our Mission.", body: "We help faith institutions turn complexity into capability by combining specialist knowledge, partnership working and grounded sector understanding." },
      { title: "Our Approach.", body: "We work alongside mosque, madrassah and charity leaders with practical frameworks that strengthen governance, safeguarding, security and community impact." },
      { title: "Our Commitment.", body: "Since 2004 we have supported institutions with research, training and advice that is culturally informed, operationally useful and built for real-world pressure." },
    ],
  },
  servicesCarousel: {
    eyebrow: "What we deliver",
    title: "Key Strategic Services",
    body: "Flagship programmes spanning sport, security, leadership and environmental practice.",
    items: [
      { title: "Inclusivity in Sports", image: "/assets/inclusivity-sport.png", href: "/sport", icon: "sport" },
      { title: "Security in Places of Worship", image: "/assets/real/security-training-session.jpg", href: "/projects/mosque-security", icon: "security" },
      { title: "Strategic Leadership Development", image: "/assets/real/who-we-are-training.jpg", href: "/projects/faith-associates-academy", icon: "leadership" },
      { title: "Environmental Practices", image: "/assets/environmental-practices.png", href: "/projects/eco-mosque", icon: "environment" },
    ],
  },
  newsCarousel: {
    eyebrow: "Latest updates",
    title: "From across the network",
    items: [
      { title: "Mosque Expo 2026 returns, uniting leaders and innovators", image: "/assets/real/mosque-expo-2024-hall.jpg", meta: "May 7, 2026 / Announcement", href: "/news/mosque-expo-2026" },
      { title: "Strengthening Mosque Resilience with Aston University", image: "/assets/real/faith-training-speaker.jpg", meta: "June 2, 2025 / Blog", href: "/news/mosque-resilience-aston" },
      { title: "Eco-Mosque Net Zero Conference for mosque leadership", image: "/assets/real/eco-mosque-conference.jpg", meta: "April 22, 2025 / Sustainability", href: "/news/eco-mosque-net-zero" },
    ],
  },
  featuredPublications: {
    eyebrow: "Featured publication",
    title: "Standards, toolkits and reports.",
    tabs: [{ id: "all", label: "All" }, { id: "Mosque Standards", label: "Standards" }, { id: "Vision", label: "Vision" }, { id: "Awards", label: "Awards" }, { id: "Governance", label: "Governance" }],
    items: [
      { id: "zakat-guide", category: "Mosque Standards", type: "Guide", date: "2026", title: "Mosque Collecting and Distributing Zakat Locally", image: "https://www.faithassociates.co.uk/wp-content/uploads/2026/03/Al-Fuqara-1.png", href: "/publications/zakat" },
      { id: "beacon-vision", category: "Vision", type: "Plan", date: "2020-2050", title: "Beacon Mosque Vision 2020-2050", image: "https://www.faithassociates.co.uk/wp-content/uploads/2019/12/Beacon-Mosque-Vision-2020-50-page-001.jpg", href: "/publications/beacon-mosque-vision-2020-2050" },
      { id: "beacon-awards-booklet", category: "Awards", type: "Booklet", date: "2025", title: "8th British Beacon Mosque Awards 2025 Booklet", image: "https://www.faithassociates.co.uk/wp-content/uploads/2026/01/WhatsApp-Image-2025-11-26-at-17.38.01-600x849-1.jpeg", href: "/publications/8th-british-beacon-mosque-awards-2025-booklet" },
      { id: "activity-report", category: "Governance", type: "Report", date: "2024", title: "Faith Associates 2024 Activity Report", image: "https://www.faithassociates.co.uk/wp-content/uploads/2024/12/Faith-Associates-2024-Report-1.png", href: "/publications/faith-associates-2024-activity-report" },
    ],
  },
  contactTeaser: {
    eyebrow: "Get in touch",
    title: "Start a conversation.",
    body: "Tell us what your institution needs and the team will come back with the right next step.",
    addressLines: ["41 Baker Street", "High Wycombe, HP11 2RZ"],
    phoneDisplay: "+44 (0)1494 416202",
    phoneTel: "+441494416202",
    phoneNote: "Use the form for quotes, partnerships and consultations.",
  },
};

const clients = [
  { name: "United Nations", body: "International development and faith-leadership work, including training and support with communities in Africa.", logo: "/assets/clients/united-nations.jpg" },
  { name: "Google.org", body: "Support for digital citizenship and youth-focused online-safety programmes.", logo: "/assets/clients/google-org.jpg" },
  { name: "Facebook / Meta", body: "Partnership work on the Keeping Muslims Safe Online guide and responsible digital participation.", logo: "/assets/clients/facebook-meta.jpg" },
  { name: "Nordic Safe Cities", body: "European collaboration on inclusive, empowered and safer communities across the Nordic region.", logo: "/assets/clients/nordic-safe-cities.png" },
  { name: "Lancashire Council of Mosques", body: "Institutional engagement, leadership and community programme partnership.", logo: "/assets/clients/lancashire-council-of-mosques.jpg" },
  { name: "Muslim Peace Forum", body: "Dialogue and leadership connections supporting peaceful, resilient communities.", logo: "/assets/clients/muslim-peace-forum.jpg" },
  { name: "X / Twitter", body: "Historic digital-leadership roadshows helping faith leaders understand the positive potential of social media.", logo: "/assets/clients/twitter-x.jpg" },
];

const roles = ["Mosque Development & Support Coordinator", "Writers and Contributors", "Editorial / Writing Intern", "Social Media Intern", "Administrator", "Social Media Content Production Officer", "Systems Development & IT Support Graduate", "Events Planner / Engagement Officer", "Senior Researcher"];

const approach = [
  { title: "Listen before designing", body: "We begin with the people closest to the challenge: leaders, staff, volunteers, users and delivery partners." },
  { title: "Connect evidence and context", body: "Research and standards matter most when interpreted through the realities of faith institutions and communities." },
  { title: "Build practical capability", body: "Training, tools and implementation support leave teams better equipped to carry the work forward." },
  { title: "Strengthen the wider system", body: "Networks, partnerships and shared learning turn local progress into sector-level improvement." },
];

const regions = [
  { slug: "africa", name: "Africa", body: "Partnership with the United Nations Development Programme and local organisations to develop faith institutions, empower leaders and support peacebuilding.", countries: ["Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cameroon", "Central African Rep.", "Chad", "Congo", "Côte d'Ivoire", "Dem. Rep. Congo", "Djibouti", "Egypt", "Eq. Guinea", "Eritrea", "eSwatini", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania", "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Rwanda", "Senegal", "Sierra Leone", "Somalia", "South Africa", "South Sudan", "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda", "W. Sahara", "Zambia", "Zimbabwe"] },
  { slug: "europe", name: "Europe", body: "More than a decade of work in security, governance and sport with European institutions, city partners and community networks.", countries: ["Albania", "Austria", "Belgium", "Bosnia and Herz.", "Bulgaria", "Croatia", "Czechia", "Estonia", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy", "Kosovo", "Latvia", "Lithuania", "Luxembourg", "Moldova", "Montenegro", "Netherlands", "Macedonia", "Poland", "Portugal", "Romania", "Serbia", "Slovakia", "Slovenia", "Spain", "Switzerland", "Ukraine", "United Kingdom"] },
  { slug: "nordic", name: "Nordic states", body: "Government, city and Nordic Safe Cities partnerships centred on inclusion, empowerment, protective security and the MEET network.", countries: ["Denmark", "Finland", "Iceland", "Norway", "Sweden"] },
  { slug: "middle-east", name: "Middle East", body: "Leadership and dialogue work linked to Imams Online and the Forum for Peace, supported through regional partnerships.", countries: ["Bahrain", "Iran", "Iraq", "Israel", "Jordan", "Kuwait", "Lebanon", "Oman", "Palestine", "Qatar", "Saudi Arabia", "Syria", "Turkey", "United Arab Emirates", "Yemen"] },
  { slug: "north-america", name: "North America", body: "Conferences, retreats and sector engagement sharing learning on mosque and imam development from policy to grassroots delivery.", countries: ["Canada", "United States of America"] },
  { slug: "australasia", name: "Australia & New Zealand", body: "Protective-security and institution-development exchange following Christchurch, alongside wider international learning through UNOCT.", countries: ["Australia", "New Zealand"] },
];

const hero = (eyebrow: string, title: string, summary: string, image: string) => ({ eyebrow, title, summary, image });

const pages: PageRecord[] = [
  { path: "/", blocks: homeBlocks, status: "published" },
  {
    path: "/about",
    title: "About Us | Faith Associates",
    status: "published",
    blocks: {
      hero: hero("About Faith Associates", "Two decades of practical faith institution support.", "Governance, security, leadership and sector partnerships shaped around real community needs.", "/assets/real/hero-law-society-poster.jpg"),
      intro: [
        "Faith Associates was founded in 2004 as a non-theological consultancy serving ethnic minority faith-based communities. Our work brings research, training, advice and implementation guidance together so institutions can make better decisions under real-world pressure.",
        "We support mosques, madrassahs, charities and sector partners with governance, safeguarding, strategic leadership, protective security and community development. The goal is practical change, not abstract theory.",
      ],
      mission: "We help faith institutions turn complexity into capability by combining specialist knowledge, partnership working and grounded sector understanding.",
      milestones: [
        { year: "Since 2004", title: "A purposeful start", body: "Faith Associates was established to support ethnic minority faith-based communities with practical, non-theological consultancy." },
        { year: "2008 - 2016", title: "Standards development", body: "Governance, leadership and institutional development programmes expanded across mosques, madrassahs and community organisations." },
        { year: "2017 - 2022", title: "Security and resilience", body: "Training, research, safeguarding and risk guidance strengthened how places of worship respond to evolving threats." },
        { year: "2023 - 2026", title: "Global partnerships", body: "Events, sector networks and flagship platforms connected national work to wider international learning and collaboration." },
      ],
      coreFocusAreas: ["Governance and standards", "Security and resilience", "Leadership and training"],
      impactStats: [{ value: "5000+", label: "mosques supported" }, { value: "3467+", label: "madrassahs engaged" }, { value: "20000+", label: "people trained" }, { value: "20+", label: "years of impact" }],
    },
  },
  { path: "/about/history", title: "Organisation history | Faith Associates", status: "published", blocks: { hero: hero("About us", "Organisation history", "Two decades of practical work to improve faith institutions, strengthen leadership and support communities.", "/assets/wp-about/Faith-Associates-2005-2025-scaled-e1750413022356.jpg"), items: history } },
  { path: "/about/clients", title: "Our clients & partners | Faith Associates", status: "published", blocks: { hero: hero("About us", "Our clients & partners", "Relationships across civil society, technology, government, sport and international development.", "/assets/real/mosque-expo-awards-hall.jpg"), items: clients } },
  { path: "/about/team", title: "Our team | Faith Associates", status: "published", blocks: { hero: hero("About us", "Our team", "A multidisciplinary network bringing together institutional, programme, regional and technology expertise.", "/assets/wp-about/MG_2346.jpg"), intro: "Faith Associates also works through a wider network of specialist associates, trainers, programme staff and international partners assembled around each assignment." } },
  { path: "/about/approach", title: "Our approach | Faith Associates", status: "published", blocks: { hero: hero("About us", "Our approach", "Culturally informed, evidence-led and focused on improvements that institutions can sustain.", "/assets/real/about-fa-training-room.png"), items: approach } },
  { path: "/about/careers", title: "Careers | Faith Associates", status: "published", blocks: { hero: hero("Work with us", "Careers", "Join work that connects institutional development, leadership and meaningful community impact.", "/assets/real/leadership-development-event.webp"), heading: "Bring your judgement, curiosity and commitment to community impact.", intro: "The roles below are preserved from the existing vacancy archive. Availability should be confirmed with the team before applying.", roles } },
  { path: "/about/vacancies", title: "Vacancies | Faith Associates", status: "published", blocks: { hero: hero("Work with us", "Vacancies", "Roles and opportunities across programmes, research, events, media and technology.", "/assets/real/leadership-development-event.webp"), heading: "Bring your judgement, curiosity and commitment to community impact.", intro: "The roles below are preserved from the existing vacancy archive. Availability should be confirmed with the team before applying.", roles } },
  { path: "/sport", title: "Inclusivity in Sport | Faith Associates", status: "published", blocks: { hero: hero("Inclusivity in sport", "Faith and sport: a force for generational change.", "Working with national sporting bodies to take accessible activity, leadership pathways and lasting opportunity into faith institutions.", "/assets/inclusivity-sport.png"), introTitle: "Bring opportunity to the spaces people already trust.", intro: ["Faith and sport are two powerful sources of connection. Faith Associates brings them together so children, women, volunteers and emerging leaders can access opportunity through familiar community settings.", "Our partnerships with national bodies in football and cricket combine high-quality sporting pathways with an extensive network of faith institutions across the UK."], programmes: [{ title: "Football", body: "Recreational opportunities, volunteer pathways and partnerships with England Football, London FA and Middlesex FA.", href: "/projects/fattah-cup", image: "/assets/inclusivity-sport.png" }, { title: "Cricket", body: "Accessible activity, activator training and a national inter-madrassah tournament supported by the ECB.", href: "/projects/eman-cup", image: "/assets/eman-cup.webp" }, { title: "Girls’ participation", body: "Wildcats centres, coaching support and campaigns designed to widen access for girls and women.", href: "/projects/fattah-cup", image: "/assets/real/community-impact-training.png" }], impact: [{ value: "150+", label: "new cricket activators trained" }, { value: "50+", label: "football leaders accredited" }, { value: "15+", label: "UK cities reached through cricket" }, { value: "500+", label: "people at the inaugural Fattah Cup" }] } },
  { path: "/international", title: "International | Faith Associates", status: "published", blocks: { hero: hero("International", "Connected leadership across five continents.", "Sustainable partnerships, institutional development and knowledge exchange shaped with communities—not simply delivered to them.", "/assets/real/beacon-awards-stage.jpg"), introTitle: "International reach, grounded local relationships.", intro: ["Faith Associates collaborates with communities and international organisations across Europe, the Middle East, Africa, North America, Australia and the UK.", "Our work addresses shared challenges in governance, protective security, leadership and inclusion while respecting the realities of each place and partnership."], regions, cta: { title: "Bring community insight into international action.", body: "We support research, training, network development and programme delivery with public bodies, international organisations and civil-society partners.", label: "Start a conversation →", href: "/contact" } } },
  { path: "/contact", title: "Contact | Faith Associates", status: "published", blocks: { hero: hero("Contact", "Start with the challenge. We will help find the next step.", "Contact the team about consultancy, training, resources, events or partnership opportunities.", "/assets/real/faith-training-speaker.jpg"), addressLines: ["Faith Associates", "41 Baker Street", "High Wycombe", "HP11 2RZ"], telephone: "+44 (0) 1494 416202", email: "info@faithassociates.co.uk", hours: "9:30–18:00, Monday to Friday", links: [["Browse services", "/services"], ["View projects", "/projects"], ["Find a publication", "/publications"]] } },
  { path: "/privacy", title: "Privacy Policy | Faith Associates", status: "published", blocks: { hero: hero("Legal", "Privacy policy", "How Faith Associates collects, uses and protects personal information.", "/assets/real/about-fa-training-room.png"), lastReviewed: "16 July 2026.", sections: [{ title: "Information we collect", body: "We may collect information you provide through enquiry, event, training or publication forms, including your name, organisation, contact details and the nature of your request." }, { title: "How information is used", body: "Information is used to respond to enquiries, deliver requested services, administer training or events, maintain appropriate records and—where you have opted in—share relevant updates." }, { title: "Cookies and analytics", body: "The website may use essential cookies and privacy-conscious analytics to understand site use, maintain security and improve the experience. Browser controls can be used to manage cookies." }, { title: "Service providers", body: "Trusted form, email, analytics and technology providers may process information on our behalf. They are expected to handle it securely and only for the agreed purpose." }, { title: "Data sharing", body: "We do not sell personal data. Information is shared only where necessary to deliver a requested programme, meet a legal obligation, protect legitimate interests or where you have given permission." }, { title: "Security and retention", body: "Reasonable organisational and technical measures are used to protect information. Records are retained only for as long as needed for the purpose collected, legal requirements or legitimate operational needs." }, { title: "Your rights", body: "Depending on the applicable law, you may ask to access, correct, restrict or delete personal information, object to certain processing or withdraw consent." }, { title: "Contact", body: "Privacy questions and requests can be sent to info@faithassociates.co.uk or to Faith Associates, 41 Baker Street, High Wycombe, HP11 2RZ." }] } },
  { path: "/services", title: "Services | Faith Associates", status: "published", blocks: { hero: hero("What we do", "Specialist support for faith institutions.", "Practical services shaped by two decades of work with leaders, trustees, volunteers and public-sector partners.", "/assets/real/security-training-session.jpg"), introTitle: "Deep sector knowledge, translated into practical change.", introBody: "Faith institutions operate in a complex environment. Our services bring together governance, safety, leadership and delivery expertise so teams can act with greater clarity and confidence." } },
  { path: "/projects", title: "Projects & Programmes | Faith Associates", status: "published", blocks: { hero: hero("Projects & programmes", "Platforms that move whole sectors forward.", "Flagship programmes that connect people, build standards and turn partnerships into visible community impact.", "/assets/real/mosque-expo-awards-hall.jpg"), introTitle: "Built to convene, equip and inspire.", introBody: "Our projects respond to recurring sector needs: stronger institutions, safer worship, confident leaders, inclusive opportunities and visible standards of excellence." } },
  { path: "/publications", title: "Publications & Toolkits | Faith Associates", status: "published", blocks: { hero: hero("Ideas & resources", "Publications built for practical use.", "Reports, toolkits and guidance drawn from more than two decades of work with faith institutions and community partners.", "/assets/real/fa-activity-report-2024.png"), featuredSlug: "zakat", libraryAnchor: "library" } },
  { path: "/news", title: "News & Events | Faith Associates", status: "published", blocks: { hero: hero("News & events", "What we are learning, building and convening.", "Updates from Faith Associates programmes, partnerships, events and publications.", "/assets/real/mosque-expo-2024-hall.jpg"), updatesAnchor: "updates" } },
  { path: "/events", title: "Events | Faith Associates", status: "published", blocks: { hero: hero("Events", "Events built around practical action.", "Current Faith Associates events, conferences and briefings that help leaders, teachers and institutions respond to real operational challenges.", events[0].heroImage), eventsAnchor: "events", cta: { eyebrow: "Bring an event to your network", title: "Talk to our events and programmes team.", label: "Start a conversation →", href: "/contact" } } },
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const withoutSlug = <T extends { slug: string }>(item: T) => {
  const { slug, ...data } = item;
  void slug;
  return data;
};

const records = <T extends { slug: string }>(type: string, items: T[]): EntryRecord[] =>
  items.map((item, sort_order) => ({
    type,
    slug: item.slug,
    data: withoutSlug(item),
    sort_order,
    status: "published",
  }));

export function buildSeedPayload(): SeedPayload {
  return {
    settings,
    pages,
    entries: [
      ...records("service", services),
      ...records("service_offering", serviceOfferings),
      ...records("service_catalogue", serviceCatalogues),
      ...records("project", projects),
      ...records("publication", publications),
      ...records("event", events),
      ...records("news", newsItems),
      ...team.map((member, sort_order) => ({ type: "team_member", slug: slugify(member.name), data: member, sort_order, status: "published" as const })),
      ...history.map((item, sort_order) => ({ type: "history_item", slug: slugify(`${item.year}-${item.title}`), data: item, sort_order, status: "published" as const })),
      ...clients.map((client, sort_order) => ({ type: "client", slug: slugify(client.name), data: client, sort_order, status: "published" as const })),
      ...regions.map((region, sort_order) => ({ type: "region", slug: region.slug, data: withoutSlug(region), sort_order, status: "published" as const })),
      ...roles.map((title, sort_order) => ({ type: "vacancy_role", slug: slugify(title), data: { title }, sort_order, status: "published" as const })),
    ],
  };
}

export const localSeed = buildSeedPayload();
