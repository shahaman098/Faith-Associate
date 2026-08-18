import { serviceOfferings } from "./service-catalogues";

export type ContentCard = {
  title: string;
  body: string;
};

export type QuickFact = {
  label: string;
  value: string;
};

export type AgendaItem = {
  title: string;
  body?: string;
};

export type EditorialPageData = {
  slug: string;
  eyebrow: string;
  title: string;
  summary: string;
  image: string;
  intro: string[];
  highlights: ContentCard[];
  outcomes: string[];
  ctaLabel?: string;
  externalUrl?: string;
  zohoFormUrl?: string;
  stat?: { value: string; label: string };

  /* ---- Course / training fields (NSPCC + ACAS style detail pages) ----
     All optional so existing records keep compiling. Only populate from
     published Faith Associates copy — never infer a price or a duration. */

  /** Hero chips, e.g. "One day" / "£595 + VAT for up to 20 delegates". */
  duration?: string;
  cost?: string;
  /** Extra hero chips beyond duration and cost (format, certification, status). */
  chips?: string[];
  /** Left-hand "At a glance" rail. */
  quickFacts?: QuickFact[];
  /** "Who it is for" list. */
  audience?: string[];
  /** Real agenda / training-content list, rendered numbered — not vague cards. */
  agendaTitle?: string;
  agenda?: AgendaItem[];
  /** Materials delegates take away. */
  materialsTitle?: string;
  materials?: string[];
  /** Named benefit blocks where the source page has them. */
  benefits?: ContentCard[];
  /** Certificate / accreditation statement. */
  certificate?: string;
  /** Closing pull-quote from the source page. */
  quote?: { text: string; attribution?: string };
  /** Sibling pages in the same family. */
  relatedSlugs?: string[];
  /** Extra outbound link rendered next to the primary CTA. */
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
};

export const services: EditorialPageData[] = [
  {
    slug: "mosque-services",
    eyebrow: "Mosque services",
    title: "Practical support for stronger mosque governance.",
    summary: "Training, policies, risk support and management guidance built around the day-to-day realities of mosque leadership.",
    image: "/assets/real/about-fa-training-room.png",
    intro: [
      "Faith Associates has worked with mosque trustees, staff and volunteers for more than two decades. Our support combines sector knowledge with practical tools that leadership teams can implement.",
      "Programmes can be delivered as focused masterclasses, organisational reviews or longer development partnerships shaped around the institution’s priorities.",
    ],
    highlights: [
      { title: "Management & governance", body: "One- and two-day masterclasses for trustees and leaders covering governance, accountability, finance and community service." },
      { title: "Policies & procedures", body: "Bespoke policy development with clear processes, legal alignment and implementation support for staff and volunteers." },
      { title: "Risk & resilience", body: "Risk assessment, first aid, safer recruitment and security awareness designed for busy places of worship." },
      { title: "Election management", body: "Independent support for voter registration, election planning, secure voting, monitoring and transparent results." },
    ],
    outcomes: ["Clearer trustee roles and decision-making", "Policies that work in practice", "Stronger operational and financial controls", "More confident staff and volunteers"],
    stat: { value: "20+", label: "years supporting mosque leadership" },
  },
  {
    slug: "madrassah-support",
    eyebrow: "Madrassah support",
    title: "Safer learning. Better-run institutions.",
    summary: "Governance, safeguarding and teaching support for madrassahs, maktabs and supplementary schools.",
    image: "/assets/real/community-impact-training.png",
    intro: [
      "Faith Associates understands the pressures placed on madrassah leaders, teachers and volunteers. Our work helps institutions put consistent management and safeguarding arrangements around the learning experience.",
      "Support is grounded in the Madrassah Management and Safeguarding framework and years of work with supplementary schools across the UK and internationally.",
    ],
    highlights: [
      { title: "Governance review", body: "Structures, responsibilities, policies and reporting lines that support accountable leadership." },
      { title: "Safeguarding practice", body: "Child protection training, safer recruitment, disclosure handling and practical audit support." },
      { title: "Staff development", body: "Training for teachers, administrators and volunteers on their operational and safeguarding duties." },
      { title: "Quality framework", body: "Support across admission, curriculum, teaching practice, assessment and continuous improvement." },
    ],
    outcomes: ["Safer provision for children and young people", "Clear policies and staff responsibilities", "Improved parent confidence", "A practical improvement plan"],
    stat: { value: "3,467+", label: "madrassahs engaged across three continents" },
  },
  {
    slug: "imam-services",
    eyebrow: "Imam services",
    title: "Leadership support for a changing context.",
    summary: "Non-theological training, networks and digital capability for imams and faith leaders serving diverse communities.",
    image: "/assets/real/faith-training-speaker.jpg",
    intro: [
      "Imams are trusted grassroots leaders. Faith Associates complements theological expertise with training in leadership, communication, safeguarding and institutional development.",
      "Through Imams Online and international partnerships, we help leaders share good practice and engage confidently with contemporary community needs.",
    ],
    highlights: [
      { title: "Leadership development", body: "Practical management, public leadership and community engagement skills for faith leaders." },
      { title: "Digital communication", body: "Support to communicate safely and effectively through online platforms and social media." },
      { title: "Safeguarding awareness", body: "Clear responsibilities for protecting children and adults at risk in faith settings." },
      { title: "Peer networks", body: "Opportunities to connect leaders, exchange learning and build cross-border relationships." },
    ],
    outcomes: ["Confident public and institutional leadership", "Safer digital engagement", "Stronger links with trustees and communities", "Access to a wider practitioner network"],
  },
  {
    slug: "strategic-services",
    eyebrow: "Strategic services",
    title: "Turn complex institutional challenges into clear action.",
    summary: "Research, strategy, governance and programme design for institutions, public bodies and delivery partners.",
    image: "/assets/real/leadership-development-event.webp",
    intro: [
      "Faith Associates works at the point where public policy, institutional leadership and community reality meet. We help partners understand a challenge, set a direction and deliver change.",
      "Assignments range from focused research and consultation to multi-partner programme design, evaluation and implementation support.",
    ],
    highlights: [
      { title: "Research & consultation", body: "Culturally informed engagement, evidence gathering and insight that reaches grassroots stakeholders." },
      { title: "Strategy development", body: "Priorities, operating models and practical roadmaps that leadership teams can own and deliver." },
      { title: "Programme design", body: "End-to-end design for training, networks, standards, events and community interventions." },
      { title: "Partnership delivery", body: "Coordination across public bodies, national institutions, funders and local organisations." },
    ],
    outcomes: ["A shared understanding of the challenge", "A deliverable strategic roadmap", "Stronger stakeholder ownership", "Evidence for learning and investment"],
  },
  {
    slug: "safeguarding",
    eyebrow: "Safeguarding services",
    title: "Safeguarding that becomes everyday practice.",
    summary: "Tailored training, audits and policies for mosques, madrassahs, supplementary schools and faith organisations.",
    image: "/assets/real/risk-22.jpg",
    intro: [
      "Faith Associates has specialised in child protection and adult safeguarding in faith settings for over 15 years. Training is shaped around the environments in which staff and volunteers actually work.",
      "We can tailor delivery to an organisation’s existing arrangements and provide a focused action plan where gaps are identified.",
    ],
    highlights: [
      { title: "Level 1 training", body: "Introduction-level safeguarding for staff, teachers, managers, administrators and volunteers." },
      { title: "Safeguarding audit", body: "A structured review of current measures, strengths, weaknesses and priority actions." },
      { title: "Policy & process", body: "Clear procedures for recruitment, disclosures, allegations, referrals and information sharing." },
      { title: "Online safety", body: "Training and resources addressing social media, digital risks and safe online participation." },
    ],
    outcomes: ["Staff understand their safeguarding duty", "Concerns are handled consistently", "Policies align with practice", "Leadership has a prioritised action plan"],
    stat: { value: "15+", label: "years of specialist safeguarding delivery" },
  },
  {
    slug: "safety",
    eyebrow: "Safety",
    title: "Protect people online, offline and at worship.",
    summary: "Integrated safeguarding, online safety and protective-security support for faith-based establishments.",
    image: "/assets/real/hero-risk-assessment-poster.jpg",
    intro: [
      "Our aim is to protect the welfare of children and adults online and in institutions while helping places of worship keep their congregations safe.",
      "Faith Associates brings safeguarding, digital citizenship and physical-security expertise into one practical safety offer.",
    ],
    highlights: [
      { title: "Online safety", body: "Digital Safety Ambassadors, e-safety training and resources for young people, parents and leaders." },
      { title: "Offline safeguarding", body: "Training and tools for madrassahs, faith institutions and anyone working with children or adults at risk." },
      { title: "Protective security", body: "Awareness, risk assessment and incident planning for places of worship." },
      { title: "Safety resources", body: "Practical guides, cards, checklists and toolkits that teams can use in their daily work." },
    ],
    outcomes: ["A joined-up understanding of safety", "Better-prepared leaders and volunteers", "Accessible tools for everyday use", "Clear routes for specialist support"],
  },
];

/** High-level service categories shown on /services. Detail offerings live in service-catalogues.ts. */
export const serviceCategories = services;

export const projects: EditorialPageData[] = [
  {
    slug: "mosque-expo",
    eyebrow: "Flagship programme",
    title: "Mosque Expo",
    summary: "A sector-wide gathering for the people, ideas and suppliers shaping the 21st-century mosque.",
    image: "/assets/real/mosque-expo-2024-hall.jpg",
    intro: [
      "Mosque Expo brings mosque leaders, volunteers, designers, suppliers and innovators together to share practical learning and strengthen institutions.",
      "The project is rooted in the Beacon Mosque vision: places of worship that combine spiritual leadership with excellent educational, social and community service.",
    ],
    highlights: [
      { title: "Ideas & learning", body: "Talks, workshops and peer exchange on governance, design, sustainability and service delivery." },
      { title: "Sector marketplace", body: "Direct access to organisations and suppliers that understand faith-institution needs." },
      { title: "National network", body: "A space for leaders and volunteers from across the country to connect and collaborate." },
      { title: "Awards platform", body: "Delivered alongside the British Beacon Mosque Awards to celebrate excellence in the sector." },
    ],
    outcomes: ["Practical ideas leaders can implement", "New sector relationships", "Visibility for innovative solutions", "A stronger shared standard of excellence"],
    externalUrl: "https://mosqueexpo.com",
    ctaLabel: "Visit Mosque Expo",
  },
  {
    slug: "british-beacon-mosque-awards",
    eyebrow: "Flagship programme",
    title: "British Beacon Mosque Awards",
    summary: "Recognising the mosques, leaders and volunteers setting an outstanding standard of service.",
    image: "/assets/real/beacon-awards-stage.jpg",
    intro: [
      "The British Beacon Mosque Awards celebrates the breadth of excellent work taking place in mosques across the UK.",
      "The programme creates positive benchmarks, shares examples of good practice and gives recognition to the people driving improvement in their institutions and communities.",
    ],
    highlights: [
      { title: "Celebrate excellence", body: "Recognition for institutions, leaders, volunteers and programmes creating meaningful impact." },
      { title: "Share good practice", body: "Nominees and winners become visible examples of what excellent delivery can look like." },
      { title: "Raise aspirations", body: "A national platform encouraging institutions to invest in standards and continuous improvement." },
      { title: "Build community", body: "An annual moment that connects mosque leadership from across the country." },
    ],
    outcomes: ["Positive recognition for the sector", "More visible models of good practice", "Stronger national connections", "Momentum for institutional improvement"],
    externalUrl: "https://beaconmosque.com",
    ctaLabel: "Visit Beacon Mosque",
  },
  {
    slug: "faith-associates-academy",
    eyebrow: "Leadership development",
    title: "Faith Associates Academy",
    summary: "Accredited institutional leadership and management learning designed for people serving religious institutions.",
    image: "/assets/real/leadership-development-event.webp",
    intro: [
      "The Academy brings two decades of Faith Associates learning into structured programmes for trustees, managers and emerging leaders.",
      "Courses combine leadership development, stewardship and community service with the practical skills needed to navigate organisational complexity.",
    ],
    highlights: [
      { title: "Accredited programmes", body: "Recognised learning pathways in institutional leadership and management." },
      { title: "Expert instructors", body: "Teaching informed by deep sector experience and practical delivery." },
      { title: "Applied curriculum", body: "Tools and knowledge that can be used immediately inside an institution." },
      { title: "Community focus", body: "Leadership development anchored in service, stewardship and real community dynamics." },
    ],
    outcomes: ["Stronger strategic leadership", "Practical management capability", "Recognised learning credentials", "A peer community of institutional leaders"],
    externalUrl: "https://mosque.mba",
    ctaLabel: "Explore the Academy",
  },
  {
    slug: "mosque-security",
    eyebrow: "Protective security",
    title: "Mosque Security",
    summary: "Training, assessment and incident guidance that helps places of worship remain open, welcoming and prepared.",
    image: "/assets/real/wolverhampton-security-training.jpg",
    intro: [
      "Faith Associates has advised mosques and Islamic centres on protective security for more than 15 years, working with institutions, councils, government and international partners.",
      "Our approach equips managers and volunteers to identify, reduce and respond to harmful risks while maintaining the openness of the institution.",
    ],
    highlights: [
      { title: "Security awareness", body: "Training for staff and volunteers on threats, prevention, vigilance and proportionate response." },
      { title: "Risk assessment", body: "On-site evaluation and prioritised recommendations tailored to the building and community." },
      { title: "Incident management", body: "Step-by-step preparation, protection and response planning for serious incidents." },
      { title: "Support networks", body: "Connections between institutions and local or national partners to share learning and support." },
    ],
    outcomes: ["Better-prepared staff and volunteers", "Proportionate protective measures", "Clearer incident procedures", "A safer experience for worshippers"],
    stat: { value: "30+", label: "UK cities reached through security delivery" },
  },
  {
    slug: "eco-mosque",
    eyebrow: "Sustainability",
    title: "Eco Mosque",
    summary: "Helping faith institutions reduce environmental impact, operating costs and carbon emissions.",
    image: "/assets/real/eco-mosque-conference.jpg",
    intro: [
      "Eco Mosque connects environmental responsibility with practical institutional development. The programme supports leaders to understand their footprint and plan achievable improvements.",
      "Conferences, standards and partnerships bring technical knowledge into a context that mosque teams can act on.",
    ],
    highlights: [
      { title: "Leadership awareness", body: "Accessible learning on net zero, energy, waste and environmental stewardship." },
      { title: "Practical roadmap", body: "Prioritised steps that reflect the building, budget and capacity of each institution." },
      { title: "Supplier connections", body: "Access to partners and technical expertise relevant to places of worship." },
      { title: "Quality standards", body: "An improvement framework encouraging sustained environmental practice." },
    ],
    outcomes: ["Lower environmental impact", "More informed investment decisions", "Reduced operating costs over time", "Visible community leadership on sustainability"],
    externalUrl: "https://ecomosque.com",
    ctaLabel: "Explore Eco Mosque",
  },
  {
    slug: "fattah-cup",
    eyebrow: "Football & faith",
    title: "The Fattah Cup",
    summary: "A FIFA Forward Inter-Madrassah football programme delivered with London FA, Middlesex FA and England Football partners.",
    image: "/assets/inclusivity-sport.png",
    intro: [
      "The first Fattah Cup brought madrassah clubs together for a landmark tournament in London, combining participation for young people with leadership development for volunteers.",
      "The wider programme creates pathways for mosques and madrassahs to become part of the football ecosystem and deliver safe, sustainable activity in their communities.",
    ],
    highlights: [
      { title: "Inter-madrassah tournament", body: "Age-group competition bringing institutions, children, parents and volunteers together." },
      { title: "Volunteer development", body: "Training and accreditation for new football leaders based in mosques and madrassahs." },
      { title: "Leadership at St George’s Park", body: "World-class learning and networking for institutional leaders and delivery volunteers." },
      { title: "Community pathways", body: "Support to become affiliated and create sustainable local football opportunities." },
    ],
    outcomes: ["More young people accessing football", "New accredited community volunteers", "Stronger institutional partnerships", "Sustainable local delivery pathways"],
    stat: { value: "500+", label: "people at the inaugural tournament" },
  },
  {
    slug: "eman-cup",
    eyebrow: "Cricket & faith",
    title: "The Eman Cup",
    summary: "A national inter-madrassah cricket competition for children aged 8–11, supported by the ECB.",
    image: "/assets/eman-cup.webp",
    intro: [
      "The Eman Cup creates an accessible first experience of competitive cricket for children from madrassahs across the UK.",
      "Regional tournaments lead to a national finals day while equipment, staff training and volunteer support help institutions keep cricket going beyond the event.",
    ],
    highlights: [
      { title: "Regional tournaments", body: "Competition in Birmingham, Bradford, London and Manchester for boys and girls aged 8–11." },
      { title: "National finals", body: "Regional champions progress to a national celebration at the home of cricket." },
      { title: "Free participation", body: "No entry fee, with kit and equipment support for participating madrassahs." },
      { title: "Coach development", body: "Training for staff and volunteers to nurture young players and sustain activity locally." },
    ],
    outcomes: ["A memorable first cricket experience", "More inclusive grassroots participation", "Trained community activators", "Stronger links between madrassahs and cricket bodies"],
  },
  {
    slug: "mosque-support-helpline",
    eyebrow: "Institutional support",
    title: "Mosque Support Helpline",
    summary: "A practical route to advice, guidance and specialist support for mosque leaders and volunteers.",
    image: "/assets/real/about-fa-training-room.png",
    intro: [
      "Mosque leaders regularly face governance, safeguarding, staffing, finance and operational questions without easy access to specialist advice.",
      "The Mosque Support Helpline connects institutions to relevant guidance and helps leadership teams identify the right next step.",
    ],
    highlights: [
      { title: "Initial triage", body: "A clear first conversation to understand the issue, urgency and institutional context." },
      { title: "Practical guidance", body: "Signposting to appropriate tools, services, training or specialist help." },
      { title: "Leadership support", body: "A confidential space for trustees and managers working through complex situations." },
      { title: "Follow-through", body: "Where needed, structured consultancy or training to move from advice to implementation." },
    ],
    outcomes: ["Faster access to relevant support", "Clearer options for leadership teams", "Reduced isolation for volunteers", "A practical route from issue to action"],
  },
  {
    slug: "imams-online",
    eyebrow: "Digital platform",
    title: "Imams Online",
    summary: "A platform for Islamic leadership, positive content, professional opportunities and peer connection.",
    image: "/assets/real/faith-training-speaker.jpg",
    intro: [
      "Imams Online was created as an accessible portal for aspiring and established imams, chaplains, alims and aalimas.",
      "It shares positive Islamic content, professional opportunities and contemporary thought leadership while helping faith leaders engage with issues affecting their communities.",
    ],
    highlights: [
      { title: "Leadership voice", body: "A platform for considered contributions from imams and Islamic leaders." },
      { title: "Professional pathways", body: "Information, careers and development opportunities for current and future leaders." },
      { title: "Digital capability", body: "Support for positive, safe and effective online communication." },
      { title: "Global connection", body: "Exchange between practitioners across the UK and wider Muslim world." },
    ],
    outcomes: ["More visible positive leadership", "Better access to opportunities", "Stronger digital engagement", "A connected practitioner community"],
  },
];

export const team: Array<{ name: string; role: string; image?: string }> = [
  {
    name: "Shaukat Warraich",
    role: "Founder & CEO",
    image: "/assets/team/shaukat-warraich.png",
  },
  { name: "Kaashif Awan", role: "Senior Associate", image: "/assets/team/kaashif-awan.png" },
  { name: "Rashid Laher", role: "Events Co-ordinator", image: "/assets/team/rashid-laher.png" },
  { name: "Dr Mohamed Elsharkwy", role: "Senior Associate", image: "/assets/team/mohamed-elsharkwy.png" },
  { name: "Sheikh Ahmed Babikir", role: "Senior Associate", image: "/assets/team/ahmed-babikir.png" },
  { name: "Abu Bakar Fernando", role: "Regional Director: Africa", image: "/assets/team/abu-bakar-fernando.png" },
  { name: "Aman Sah", role: "Technology Lead", image: "/assets/team/aman-sah.png" },
];

/**
 * Organisation timeline, restored verbatim in substance from the live
 * faithassociates.co.uk/about-us/company-history/ page.
 */
export const history = [
  {
    year: "2004",
    title: "Faith Associates founded",
    body: "Faith Associates was set up in 2004 as a non-theological consultancy to meet the needs of faith based communities. We aimed to work in a culturally sensitive, multidisciplinary way to provide research, training, advice and guidance to support the challenges faced by such communities.",
  },
  {
    year: "2006",
    title: "National consultation & launch of MINAB",
    body: "Following a nationwide consultation in the United Kingdom, Faith Associates helped to establish a national umbrella body for mosques and imams in the UK, constituting almost 600+ organisations in a self-governance model. The body established was called MINAB.",
  },
  {
    year: "2007",
    title: "Publication of the 1st Mosque Management Guide",
    body: "A pioneering guide to help support the management of mosques and Islamic centres, accompanied with a 16-hour training programme to support development and change in these centres.",
  },
  {
    year: "2008",
    title: "Established experts in the field",
    body: "Faith Associates had developed bespoke training courses for mosque and madrassah management as well as dedicated certified safeguarding trainers to help improve standards across the UK. Working with safeguarding boards, Faith Associates established a unique and accredited Mosque and Madrassah Safeguarding course.",
  },
  {
    year: "2009",
    title: "Publication of the 1st Madrassah Management Guide",
    body: "The first madrassah management guide published within a safeguarding context.",
  },
  {
    year: "2010",
    title: "Launch of the Mosque Open Day guide",
    body: "Pioneered the development and the concept of how to open mosques to wider society and to encourage the development of an open and transparent culture.",
  },
  {
    year: "2011",
    title: "ImamsOnline.com launched",
    body: "Faith Associates created a dedicated portal for the promotion of Islamic leadership. Imams Online was also set up to provide advice, support and training to religious leaders globally.",
  },
  {
    year: "2012",
    title: "Iftar 2012 and the London Olympics",
    body: "Working closely with the London Olympics 2012 team, some of London’s and the wider UK’s iconic mosques opened their doors to host Olympic teams from around the world during the festival, which coincided with the Islamic month of Ramadan.",
  },
  {
    year: "2013",
    title: "Mosque Iftar",
    body: "A national campaign to open mosques during Ramadan, to share the iftar feast with the wider community.",
  },
  {
    year: "2014",
    title: "Tech giant partnerships",
    body: "Delivering a national roadshow with Twitter to highlight the power of social media and the potential benefits to faith leaders.",
  },
  {
    year: "2015",
    title: "Women in Mosque Management guide",
    body: "Following extensive research and consultation about how women can play a leading role in supporting the development of services from mosques and Islamic centres, a guide was developed and launched to encourage greater involvement of women in service delivery.",
  },
  {
    year: "2016",
    title: "Safeguarding youth and adult toolkit for faith institutions",
    body: "Following extensive consultation with all faith communities, a toolkit was launched in the UK Midlands with the support of six local authorities. The guide has since been reproduced in various parts of the UK, and aspects of it have been shared in Asia and Africa during Faith Associates training in those territories.",
  },
  {
    year: "2017",
    title: "Consolidating our global reach",
    body: "By the end of 2017 we had provided safeguarding training to over 1,000 people across mosques globally. We also started our project with the United Nations offering faith institutional development training across East Africa, and in official partnership with Facebook launched the ‘Keeping Muslims Safe Online’ guide — the first of its kind.",
  },
  {
    year: "2018",
    title: "Beacon Mosque Standards launched",
    body: "Following 15 years of working closely with mosques globally, Faith Associates launched a global benchmark of quality for mosques and Islamic centres, helping mosques measure themselves against matrices of quality in order to grade themselves.",
  },
  {
    year: "2018",
    title: "British Beacon Mosque Awards launched",
    body: "The UK’s best mosques identified and celebrated at the inaugural British Beacon Mosque Awards in London.",
  },
  {
    year: "2019",
    title: "2nd British Beacon Mosque Awards",
    body: "For the second year, 400 British mosques attended the gala dinner in London celebrating and awarding the best mosques of 2019.",
  },
  {
    year: "2019",
    title: "International partnerships",
    body: "Working with European, Middle Eastern and North American partners and bodies, expanding the work of Faith Associates across different continents.",
  },
  {
    year: "2020",
    title: "COVID-19 guidance and support",
    body: "Faith Associates were at the forefront of the COVID-19 pandemic providing constant support and guidance for Islamic institutions across the UK.",
  },
  {
    year: "2021",
    title: "National outreach",
    body: "National outreach to support post-COVID integration.",
  },
  {
    year: "2022",
    title: "Security platform expands",
    body: "Mosque security and other places of worship safety platform expands services across various continents.",
  },
  {
    year: "2023",
    title: "Beacon Awards and Mosque Expo in Greater Manchester",
    body: "The 6th British Beacon Mosque Awards and Mosque Expo taken to Greater Manchester.",
  },
  {
    year: "2024",
    title: "Launch of the Mosque MBA",
    body: "Launch of the master’s-level Mosque MBA, bringing 20 years of learning into one platform.",
  },
  {
    year: "2025",
    title: "Twenty years of service",
    body: "Celebrating 20 years of service, 2005–2025. The Mosque MBA receives recruits from the UK, Europe and Africa.",
  },
];

export const newsItems = [
  {
    slug: "mosque-expo-2026",
    date: "7 May 2026",
    category: "Announcement",
    title: "Mosque Expo 2026 returns, uniting leaders and innovators",
    summary: "Mosque leaders, scholars, suppliers and innovators will come together for the next national Mosque Expo.",
    image: "/assets/real/mosque-expo-2024-hall.jpg",
    body: [
      "Mosque Expo returns as a national meeting place for trustees, volunteers, scholars, designers, suppliers and organisations working to strengthen the 21st-century mosque.",
      "The programme will combine practical learning, peer exchange and access to specialist partners across governance, sustainability, technology, security and community service.",
    ],
  },
  {
    slug: "mosque-resilience-aston",
    date: "2 June 2025",
    category: "Security",
    title: "Strengthening Mosque Resilience at Aston University",
    summary: "Leaders, volunteers and security officers gathered for practical learning on mosque resilience.",
    image: "/assets/real/faith-training-speaker.jpg",
    body: [
      "The Aston University gathering brought mosque leaders, volunteers and security practitioners together to examine the practical foundations of a resilient place of worship.",
      "Sessions focused on awareness, proportionate planning, volunteer confidence and the relationships institutions need before an incident occurs.",
    ],
  },
  {
    slug: "eco-mosque-net-zero",
    date: "22 April 2025",
    category: "Sustainability",
    title: "Eco-Mosque Net Zero Conference for mosque leadership",
    summary: "A focused conference equipped leaders with practical approaches to environmental improvement.",
    image: "/assets/real/eco-mosque-conference.jpg",
    body: [
      "The Eco-Mosque conference connected environmental ambition with the operational decisions made by mosque leadership teams every day.",
      "Participants explored practical steps around buildings, energy, procurement and community engagement, with an emphasis on achievable progress and shared learning.",
    ],
  },
  {
    slug: "mosque-expo-awards-2024",
    date: "2 December 2024",
    category: "Events",
    title: "1,000 attendees join Mosque Expo and the 7th Beacon Mosque Awards",
    summary: "A major gathering celebrated community service, innovation and institutional excellence.",
    image: "/assets/real/mosque-expo-awards-hall.jpg",
    body: [
      "Around 1,000 attendees joined a full day of learning, networking and recognition across Mosque Expo and the seventh British Beacon Mosque Awards.",
      "The combined event showcased practical ideas for stronger institutions before celebrating mosques, leaders and volunteers whose work is raising standards across the sector.",
    ],
  },
  {
    slug: "activity-report-2024",
    date: "20 December 2024",
    category: "Report",
    title: "Faith Associates publishes its 2024 Activity Report",
    summary: "The report reviews a year of leadership, security, sport and international partnership delivery.",
    image: "/assets/real/fa-activity-report-2024.png",
    body: [
      "The 2024 Activity Report brings together a year of work across institutional leadership, protective security, inclusive sport and international partnerships.",
      "It records the programmes delivered with communities and partners while setting the work in the wider mission to build capable, connected and resilient faith institutions.",
    ],
  },
  {
    slug: "meet-kristiansand",
    date: "24 June 2024",
    category: "International",
    title: "MEET Conference held in Kristiansand",
    summary: "European partners convened around empowerment, networks and safer, more connected communities.",
    image: "/assets/real/beacon-awards-stage.jpg",
    body: [
      "Partners in the MEET network gathered in Kristiansand to exchange learning on empowerment, inclusion and the local relationships that help communities remain safe and connected.",
      "The conference strengthened links between practitioners and cities while creating space to compare approaches across different European contexts.",
    ],
  },
  {
    slug: "fattah-cup-2024",
    date: "1 June 2024",
    category: "Sport",
    title: "Fattah Cup brings inter-madrassah football to London",
    summary: "More than 500 people and 13 institutions joined the inaugural FIFA Forward tournament.",
    image: "/assets/inclusivity-sport.png",
    body: [
      "More than 500 people and 13 institutions took part in the inaugural Fattah Cup, creating a welcoming competitive football experience for madrassah communities.",
      "The FIFA Forward-supported programme connected participation with volunteer development and stronger pathways between faith institutions and the football system.",
    ],
  },
  {
    slug: "eman-cup-lords",
    date: "12 May 2024",
    category: "Sport",
    title: "Eman Cup national finals reach Lord’s",
    summary: "Regional champions completed a landmark inter-madrassah cricket journey at the home of cricket.",
    image: "/assets/eman-cup.webp",
    body: [
      "Regional Eman Cup champions completed their inter-madrassah cricket journey at Lord’s, giving young players a memorable national finals experience.",
      "The wider programme supports madrassahs with equipment, activator training and practical help so cricket can continue within participating communities after the tournament.",
    ],
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug) ?? serviceOfferings.find((service) => service.slug === slug);
}

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
