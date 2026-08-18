import type { EditorialPageData } from "./site-content";

export type CatalogueLink = {
  title: string;
  href: string;
  summary?: string;
  image?: string;
  external?: boolean;
};

export type CatalogueSection = {
  id: string;
  title: string;
  summary?: string;
  links: CatalogueLink[];
  /** Body paragraphs for statement sections that carry copy rather than links. */
  body?: string[];
  /** Plain list items (e.g. the Safety page's online / offline safety lists). */
  bullets?: string[];
  /** Optional call to action at the foot of the section. */
  ctaLabel?: string;
  ctaHref?: string;
  /** Optional supporting photograph. */
  image?: string;
};

export type ServiceCatalogue = {
  slug: string;
  variant?: "grid" | "safety";
  /** Closing pull-quote, where the source page has one. */
  quote?: { text: string; attribution?: string };
  intro?: string[];
  sections: CatalogueSection[];
  policyHref?: string;
  policyLabel?: string;
};

/**
 * Service artwork lifted from the WordPress site and served locally, so the pages
 * keep working once faithassociates.co.uk is retired.
 */
const wp = (path: string) => `/assets/services/${path.split("/").pop()}`;

/** Individual service / training detail pages (shared across catalogues). */
export const serviceOfferings: EditorialPageData[] = [
  {
    slug: "1-day-mosque-management-governance-master-class-training",
    eyebrow: "Training course",
    title: "1 Day Mosque Management & Governance Master Class",
    summary:
      "Essential management and leadership techniques for running a mosque or Islamic centre within legal, civic and Islamically effective frameworks.",
    image: wp("2017/12/IMG_5243.jpg"),
    intro: [
      "This one-day master class covers the practical leadership approaches required to run a mosque or Islamic centre well — from trustee duties to safeguarding and strategic vision.",
      "Workshops and presentations are delivered by mosque management and legal-compliance specialists, with materials leaders can take back and use immediately.",
    ],
    highlights: [
      { title: "Beacon Mosque standards", body: "Developing a 21st-century Beacon Mosque and understanding quality benchmarks." },
      { title: "Governance essentials", body: "Trustees’ rights and responsibilities, policies, procedures and safeguarding." },
      { title: "Risk & fundraising", body: "Risk assessment and safe fundraising practice for busy institutions." },
      { title: "Practical toolkit", body: "Policy templates, role guidance, volunteer frameworks and Charity Commission compliance support." },
    ],
    outcomes: ["Clearer trustee roles", "Stronger policy foundations", "Practical compliance awareness", "A pathway toward higher institutional standards"],
    duration: "One day",
    cost: "Price on enquiry",
    chips: ["In-person masterclass"],
    quickFacts: [
      { label: "Duration", value: "One day" },
      { label: "Format", value: "In-person workshops and presentations" },
      { label: "Delivered by", value: "Mosque management and legal-compliance specialists" },
      { label: "Cost", value: "Price on enquiry" },
    ],
    audience: [
      "Mosque trustees and committee members",
      "Islamic centre managers and administrators",
      "Madrassah leads and safeguarding officers",
      "Volunteers stepping into management or governance roles",
    ],
    agendaTitle: "Mosque management training content",
    agenda: [
      { title: "Beacon Mosque Standards", body: "Developing a 21st-century Beacon Mosque and understanding what a 5-star compliant institution looks like." },
      { title: "Trustee rights and responsibilities", body: "Clear governance duties for management committee members." },
      { title: "Risk assessment and safe fundraising", body: "Practical controls for common institutional risks." },
      { title: "Strategic vision", body: "Building direction, structure and improvement priorities for the mosque." },
      { title: "Policies, procedures and safeguarding", body: "The documents and working practices needed for safer, accountable delivery." },
    ],
    materialsTitle: "Training materials included",
    materials: [
      "Roles and Responsibilities of Management Committee Members booklet",
      "Imam Job Advert workshop",
      "Mosque and Madrassah Quarterly material",
      "Building Islamic Faith Leaders workshop",
      "9 Core Critical Success Indicators",
      "Mosque hierarchy and structure worksheet",
      "Recruitment policy booklet",
      "Complaints and grievances procedure booklet",
      "Mosque volunteer policy guidelines",
      "National Association of Madrassahs brochure",
      "Imams Online brochure",
      "Safe Giving Zakat infographic",
    ],
  },
  {
    slug: "2-day-mosque-management-governance-master-class-training",
    eyebrow: "Training course",
    title: "2 Day Mosque Management & Governance Master Class",
    summary:
      "An advanced two-day programme covering governance, finance, madrassah management, safeguarding and community development.",
    image: wp("2016/11/Blackburn-Training.jpg"),
    intro: [
      "This is a more advanced training offer than the one-day master class, covering essential management and leadership techniques in greater depth.",
      "The purpose is to foster better governance, raise service quality and encourage best practice in British and international mosques.",
    ],
    highlights: [
      { title: "Extended curriculum", body: "Financial management, madrassah management, legal structures and community development." },
      { title: "Leadership & vision", body: "Strategic vision, Beacon Mosque standards and trustee accountability." },
      { title: "Safeguarding & risk", body: "Policies, procedures, risk assessment and safeguarding practice." },
      { title: "Implementation support", body: "Materials, templates and specialist advice on issues facing your mosque." },
    ],
    outcomes: ["Deeper governance capability", "Stronger financial and operational controls", "Better-aligned leadership teams", "A clear improvement agenda"],
    duration: "Two days",
    cost: "Price on enquiry",
    chips: ["Advanced programme"],
    quickFacts: [
      { label: "Duration", value: "Two days" },
      { label: "Level", value: "Advanced — builds on the one-day masterclass" },
      { label: "Format", value: "In-person workshops and presentations" },
      { label: "Cost", value: "Price on enquiry" },
    ],
    audience: [
      "Trustees and senior committee members",
      "Mosque managers and administrators",
      "Madrassah management teams",
      "Institutions seeking deeper governance and compliance support",
    ],
    agendaTitle: "Training content",
    agenda: [
      { title: "Developing a 21st-century mosque", body: "Beacon Mosque standards and what a compliant, high-performing institution looks like." },
      { title: "Trustee rights and responsibilities" },
      { title: "Risk assessment and safe fundraising" },
      { title: "Strategic vision and institutional planning" },
      { title: "Policies and procedures" },
      { title: "Financial management" },
      { title: "Madrassah management" },
      { title: "Safeguarding" },
      { title: "Community development" },
      { title: "Legal structures and frameworks" },
    ],
  },
  {
    slug: "safer-recruitment-training",
    eyebrow: "Training course",
    title: "Safer Recruitment Training",
    summary:
      "Help mosque and madrassah teams hire managers, teachers, administrators and volunteers using safer, more consistent recruitment practice.",
    image: wp("2022/07/Recruitment.png"),
    intro: [
      "Safer Recruitment training supports institutions to employ the best candidates while protecting children, adults at risk and the organisation itself.",
      "It is essential for anyone responsible for hiring — whether for paid roles or volunteer positions.",
      "The training helps mosque, madrassah and centre teams follow consistent procedures so the safety of students, staff and the wider institution is treated as a core recruitment responsibility.",
    ],
    highlights: [
      { title: "Safer processes", body: "Practical steps for advertising, shortlisting, interviewing and appointment." },
      { title: "Checks & references", body: "How to handle disclosures, references and suitability decisions consistently." },
      { title: "Hiring responsibilities", body: "Clear expectations for managers, teachers, administrators, trustees and volunteers involved in recruitment." },
      { title: "Institutional protection", body: "Reduce avoidable risk while building a capable, trusted workforce around children and adults at risk." },
    ],
    outcomes: ["Safer hiring decisions", "Consistent recruitment practice", "Clearer role expectations", "Stronger protection for the institution"],
    duration: "One day",
    cost: "£595 + VAT for up to 20 delegates",
    certificate:
      "Attendees receive a certificate after participating for the full duration of the course.",
    quickFacts: [
      { label: "Duration", value: "One day" },
      { label: "Cost", value: "£595 + VAT for up to 20 delegates" },
      { label: "Certificate", value: "Issued on full participation" },
      {
        label: "Safeguarding guidance",
        value:
          "At least two members of an organisation, including one board member, should take this training every five years.",
      },
    ],
    audience: [
      "Board members and trustees involved in recruitment",
      "Mosque and madrassah managers",
      "Head teachers, teachers and administrators",
      "Volunteer coordinators and safeguarding leads",
    ],
    agendaTitle: "Training content",
    agenda: [
      { title: "Recruitment overview" },
      { title: "Risk factors and legislation" },
      { title: "Preparing job descriptions" },
      { title: "Advertising a vacancy and using application forms" },
      { title: "Reviewing and selecting candidates for interview" },
      { title: "Pre-employment checks, references and DBS" },
      { title: "Induction and monitoring of new staff" },
    ],
  },
  {
    slug: "first-aid-training-for-mosques-and-madrassahs",
    eyebrow: "Training course",
    title: "First Aid Training for Mosques and Madrassahs",
    summary:
      "Certified first aid training that keeps staff and volunteers prepared for emergencies as part of wider health and safety requirements.",
    image: wp("2018/08/first-aid-1-2.jpg"),
    intro: [
      "Faith Associates offers certified First Aid training for mosques and madrassahs, helping teams respond confidently when someone is injured or becomes ill.",
      "Courses can be tailored to institutional needs, including Emergency First Aid at Work and Paediatric First Aid pathways.",
    ],
    highlights: [
      { title: "Emergency First Aid at Work", body: "One-day Level 2 award covering incident management, resuscitation, bleeding, choking and common injuries." },
      { title: "Paediatric First Aid", body: "Two-day Ofqual-regulated training aligned with Ofsted and EYFS guidance for those working with children." },
      { title: "Assessment & certification", body: "Theory, practical and written assessment with certification typically valid for three years." },
      { title: "Faith-setting delivery", body: "Training shaped around the realities of mosques, madrassahs and busy community venues." },
    ],
    outcomes: ["Nominated first aiders in place", "Faster emergency response", "Reduced risk from injury or illness", "Certification for staff and volunteers"],
  },
  {
    slug: "covid-19-risk-assessment-training-for-mosques-and-madrassahs",
    eyebrow: "Training course",
    title: "Risk Assessment Training for Mosques and Madrassahs",
    summary:
      "On-site risk assessment training and practical checklists developed with councils of mosques to help institutions operate more safely.",
    image: wp("2020/06/grand-bradford.jpg"),
    intro: [
      "Since 2020 Faith Associates has worked with councils of mosques and regional bodies to deliver bespoke risk assessment training for Islamic institutions across the UK.",
      "The offer combines on-site inspection with practical tools, including updated risk assessment checklist templates for mosques and out-of-school settings.",
    ],
    highlights: [
      { title: "On-site assessment", body: "A structured inspection of premises that host worship, learning and community services." },
      { title: "Practical templates", body: "Checklist documents institutions can download, adapt and reuse." },
      { title: "Partnership delivery", body: "Programmes delivered with regional partners, including large city-wide mosque networks." },
      { title: "National reach", body: "Training and support delivered to hundreds of mosques across dozens of UK cities." },
    ],
    outcomes: ["A clearer view of site risks", "Actionable checklist tools", "Better-prepared reopening or operations", "Shared learning across institutions"],
  },
  {
    slug: "mosque-security-training",
    eyebrow: "Training course",
    title: "Mosque Security Awareness Training",
    summary:
      "Practical security awareness for mosque buildings and congregations — how to prevent harm and how to respond if an incident occurs.",
    image: wp("2019/07/mosque-security-training-wolverhampton.jpg"),
    intro: [
      "Mosque Security Training outlines the risks your building and congregation may face, how to protect yourselves against them, and how to react to minimise harm if they occur.",
      "The training is designed for trustees, staff and volunteers who need proportionate, practical security awareness — not fear-driven overreaction.",
    ],
    highlights: [
      { title: "Threat awareness", body: "Understand common risks to places of worship and community venues." },
      { title: "Prevention", body: "Practical steps to strengthen vigilance, access and everyday security culture." },
      { title: "Incident response", body: "Clear actions that help teams protect people and communicate under pressure." },
      { title: "Institutional fit", body: "Guidance that keeps mosques welcoming while improving preparedness." },
    ],
    outcomes: ["Shared security awareness", "Clearer prevention habits", "More confident incident response", "Better protection for congregations"],
  },
  {
    slug: "protect-duty-and-martyns-law-training",
    eyebrow: "Mosque services",
    title: "Protect Duty and Martyn’s Law Training",
    summary:
      "Prepare your institution for Martyn’s Law — the Terrorism (Protection of Premises) Act 2025 — with practical training for public venues and community spaces.",
    image: wp("2020/06/grand-bradford.jpg"),
    intro: [
      "Martyn’s Law is designed to ensure that public venues, events and community spaces are better prepared for the threat of terrorism.",
      "Faith Associates helps mosque and community leaders understand what the legislation means in practice and how to put proportionate protective measures in place.",
    ],
    highlights: [
      { title: "Legislative clarity", body: "What Martyn’s Law / Protect Duty expects from premises and organisers." },
      { title: "Practical preparedness", body: "Risk awareness, planning and response proportionate to your venue." },
      { title: "Leadership briefing", body: "Support for trustees and managers who need to brief staff and volunteers." },
      { title: "Faith-institution context", body: "Training shaped around mosques, halls and community events." },
    ],
    outcomes: ["Clearer legal understanding", "Proportionate protective plans", "More confident leadership briefings", "Better-prepared venues and events"],
  },
  {
    slug: "beacon-mosque-accreditation",
    eyebrow: "Mosque services",
    title: "Beacon Mosque Accreditation",
    summary:
      "Rate your mosque against Beacon Mosque criteria to achieve a 3*, 4* or 5* standard that serves congregation and wider community.",
    image: wp("2019/02/DzYK2PHWwAEJeEC.jpg"),
    intro: [
      "The Beacon Mosque initiative helps leadership teams assess their institution against a clear quality framework and work toward a recognised star rating.",
      "A 5* Beacon Mosque combines spiritual purpose with efficient, inclusive and sustainable services for the whole community.",
    ],
    highlights: [
      { title: "Enquiry & scoping", body: "Start with a conversation about readiness and the accreditation journey." },
      { title: "Audit process", body: "A structured review across the Beacon Mosque standards categories." },
      { title: "Certification", body: "Formal recognition of the star rating achieved, with documentation for the institution." },
      { title: "Continuous improvement", body: "A global quality benchmark developed from two decades of mosque review work." },
    ],
    outcomes: ["A clear quality baseline", "Recognised star rating pathway", "Shared leadership ambition", "Improved congregation and community experience"],
    ctaLabel: "Enquire about accreditation",
  },
  {
    slug: "women-in-mosque-leadership",
    eyebrow: "Mosque services",
    title: "Women in Mosque Leadership",
    summary:
      "Training programmes designed to give women the knowledge, confidence and tools to contribute to mosque and Islamic centre leadership.",
    image: wp("2017/12/womens-in-mosque.jpg"),
    intro: [
      "Faith Associates has developed training programmes exclusively for women, supporting participation in mosque governance, management and service delivery.",
      "The focus is practical capability — so women can contribute confidently inside the institutions that serve their communities.",
      "The programme connects training with the Muslim Women, Mosque Governance, Management and Service Delivery Guide, helping institutions create clearer routes for women to shape decisions and improve services.",
    ],
    highlights: [
      { title: "Leadership capability", body: "Knowledge and tools for governance, management, service design and decision-making roles." },
      { title: "Institutional context", body: "Training shaped around mosque and Islamic centre structures, committees and day-to-day delivery." },
      { title: "Inclusive practice", body: "Support for institutions widening participation so women can contribute to stronger community services." },
      { title: "Guide-led learning", body: "Practical discussion rooted in the women in mosque governance and service delivery guide." },
    ],
    outcomes: ["Greater leadership confidence", "Clearer pathways into governance roles", "Stronger inclusive practice", "Practical tools for day-to-day contribution"],
    duration: "One day",
    cost: "Price on enquiry",
    quickFacts: [
      { label: "Duration", value: "One day" },
      { label: "Format", value: "Women-only training programme" },
      {
        label: "Based on",
        value:
          "Muslim Women, Mosque Governance, Management and Service Delivery Guide",
      },
      { label: "Cost", value: "Price on enquiry" },
    ],
    audience: [
      "Women seeking to contribute to mosque governance and service delivery",
      "Mosque leaders looking to widen participation",
      "Institutions developing more inclusive leadership pathways",
      "Community activists, volunteers and emerging leaders",
    ],
    agendaTitle: "Training structure",
    agenda: [
      {
        title: "Historical Reference",
        body: "Examples of women as pillars of mosques at the time of the Prophet, showing their important roles in mosque life.",
      },
      {
        title: "Solutions",
        body: "Practical examples of roles needed in the running of a mosque, including convert care, counselling services, chaplaincy and staff recruitment.",
      },
      {
        title: "Sustainability",
        body: "How mosques can ensure different roles are managed by different members of the community successfully over the long term.",
      },
    ],
    secondaryCtaLabel: "Download the guide",
    secondaryCtaHref: "/publications/muslim-women-mosque-governance-management-and-service-delivery-guide",
  },
  {
    slug: "mosque-policy-and-procedure-development",
    eyebrow: "Policy development",
    title: "Policies written for the way your mosque really works.",
    summary: "Bespoke governance policies, operating procedures, staff workshops and ongoing implementation support.",
    image: "/assets/real/law-24.jpg",
    intro: [
      "Effective policies build trust only when people understand and use them. Faith Associates develops clear, tailored documents aligned with an institution’s values, legal duties and operating context.",
      "We support the full journey from drafting and approval to staff training, review and continuous improvement.",
    ],
    highlights: [
      { title: "Custom policy drafting", body: "Inclusive policies shaped around the ethos, governance and needs of the institution." },
      { title: "Procedure formulation", body: "Clear, actionable steps that translate policy into consistent daily practice." },
      { title: "Training & workshops", body: "Practical sessions so staff and volunteers understand responsibilities and application." },
      { title: "Compliance support", body: "Review against relevant local and national requirements, with updates as needs evolve." },
    ],
    outcomes: ["More transparent governance", "Consistent operational practice", "Reduced compliance risk", "Policies that stay current"],
  },
  {
    slug: "mosque-election-management",
    eyebrow: "Election management",
    title: "Independent, transparent mosque elections.",
    summary: "End-to-end planning and oversight, from voter registration to result declaration and post-election support.",
    image: "/assets/real/law-36.jpg",
    intro: [
      "Faith Associates helps mosque leadership teams run fair, efficient elections that protect community trust and respect the institution’s values.",
      "The service can cover the whole process or provide independent support at defined stages where additional assurance is needed.",
    ],
    highlights: [
      { title: "Voter management", body: "Secure, accessible registration and accurate records for eligible community members." },
      { title: "Planning & strategy", body: "Timelines, roles, resources and communications for every phase of the election." },
      { title: "Voting & monitoring", body: "Traditional or electronic voting systems with confidentiality, oversight and compliance." },
      { title: "Post-election support", body: "Result tabulation, transparent communication and structured dispute resolution." },
    ],
    outcomes: ["A fair and trusted process", "Higher accessibility and participation", "Secure handling of votes and data", "Clear, transparent results"],
    ctaLabel: "Guide my election",
    externalUrl: "https://beaconmosque.com",
    secondaryCtaLabel: "Visit Beacon Mosque",
    secondaryCtaHref: "https://beaconmosque.com",
    // Live embed lifted from faithassociates.co.uk/mosque-election-management/
    zohoFormUrl: "https://zfrmz.eu/kBHoqCaeCvfuvnAoOW06",
    quickFacts: [
      { label: "Service", value: "End-to-end or stage-by-stage election support" },
      { label: "Covers", value: "Voter registration through to result declaration" },
      { label: "Assurance", value: "Independent monitoring and compliance oversight" },
      { label: "Cost", value: "Price on enquiry" },
    ],
    audience: [
      "Mosque trustees and election committees",
      "Institutions planning a new election cycle",
      "Mosques needing independent oversight or process assurance",
      "Communities seeking a clearer and more trusted election process",
    ],
    agendaTitle: "Our services",
    agenda: [
      {
        title: "Voter registration and management",
        body: "Secure, accessible registration and accurate records for eligible community members.",
      },
      {
        title: "Election planning and strategy",
        body: "Timelines, role assignment, resource planning and communications for each phase of the election.",
      },
      {
        title: "Voting system setup and management",
        body: "Traditional ballot or electronic voting options, with integrity and confidentiality built in.",
      },
      {
        title: "Monitoring and compliance",
        body: "Oversight to help elections run fairly and in line with local laws and Islamic principles.",
      },
      {
        title: "Post-election support",
        body: "Result tabulation, dispute resolution and transparent communication of outcomes.",
      },
    ],
    benefits: [
      {
        title: "Transparency and integrity",
        body: "A fair process that upholds community trust.",
      },
      {
        title: "Efficiency and accessibility",
        body: "Smoother operations and accessible voting methods that support participation.",
      },
      {
        title: "Compliance and security",
        body: "Protection for the sanctity of every vote and the credibility of the election.",
      },
    ],
  },
  {
    slug: "mosque-security-risk-assessment",
    eyebrow: "Security risk assessment",
    title: "Understand vulnerabilities before they become incidents.",
    summary: "On-site evaluation, workshops and prioritised recommendations for safer mosque and faith-institution environments.",
    image: "/assets/real/risk-30.jpg",
    intro: [
      "Places of worship need to remain welcoming and accessible while protecting faith leaders, staff, volunteers and worshippers. Our assessment balances both needs.",
      "The process combines an on-site inspection with a security workshop, followed by a detailed report and implementation guidance.",
    ],
    highlights: [
      { title: "Comprehensive evaluation", body: "A review of physical, informational and human assets alongside current security arrangements." },
      { title: "Collaborative workshop", body: "Management, volunteers and stakeholders identify threats, consequences and priorities together." },
      { title: "Prioritised report", body: "Clear areas of concern and sequenced recommendations based on risk and practicality." },
      { title: "Implementation support", body: "Guidance and connections to local or national partners as security measures are strengthened." },
    ],
    outcomes: ["A clear view of current vulnerabilities", "Practical, proportionate recommendations", "Improved emergency awareness", "Greater confidence among staff and worshippers"],
  },
  {
    slug: "strategic-campaign-planning-execution",
    eyebrow: "Strategic services",
    title: "Strategic Campaign Planning & Execution",
    summary:
      "Digital campaigns and communication strategies for faith institutions, ethnic-minority communities and public-interest programmes.",
    image: wp("2019/03/marketing-.png"),
    intro: [
      "Faith Associates has planned and delivered digital campaigns for more than a decade, with a specialist team covering strategy, content, media and community engagement.",
      "Work ranges from national public-interest campaigns to targeted community communications across the UK and internationally.",
    ],
    highlights: [
      { title: "Full-funnel capability", body: "Social, PPC, content, web, branding, analytics, polling and message development." },
      { title: "Proven campaigns", body: "Ramadan Reminders, Safer Giving, vaccine communications and community storytelling series." },
      { title: "Global reach", body: "Campaigns that have reached audiences across the UK, Europe, Africa, Asia, Australia and North America." },
      { title: "Community fluency", body: "Messaging shaped for faith institutions and BAME communities." },
    ],
    outcomes: ["A clear campaign plan", "Stronger message discipline", "Measurable reach and engagement", "Trusted community communications"],
  },
  {
    slug: "strategic-conference-and-event-planning",
    eyebrow: "Strategic services",
    title: "Strategic Conference and Event Planning",
    summary:
      "End-to-end design and delivery for conferences, summits and events with governments, NGOs, tech partners and faith institutions.",
    image: wp("2019/09/MG_5496.jpg"),
    intro: [
      "Faith Associates has organised conferences and events nationally and internationally for over a decade, helping partners meet goals, logistics and stakeholder needs.",
      "The team brings sector experience from digital summits and Mosque Expo through to awards ceremonies and security training roadshows.",
    ],
    highlights: [
      { title: "Conference design", body: "Concept, programme development and production timelines." },
      { title: "Partnerships & sponsors", body: "Brochure development, advertising and stakeholder coordination." },
      { title: "Delivery support", body: "AV, webcasting, implementation and on-the-day production." },
      { title: "Follow-through", body: "Evaluation, database management and post-event learning." },
    ],
    outcomes: ["A clear event strategy", "Smoother production logistics", "Stronger stakeholder experience", "Useful post-event insight"],
  },
  {
    slug: "media-planning",
    eyebrow: "Strategic services",
    title: "Media Planning",
    summary:
      "Training and support to plan media strategy, handle interviews and manage social platforms with confidence.",
    image: wp("2018/06/media-.jpg"),
    intro: [
      "Faith Associates has delivered media campaigns for over a decade and developed a Media Planning programme for individuals and organisations.",
      "Trainers bring mainstream media experience and shape delivery around the exposure needs of faith leaders and institutions.",
    ],
    highlights: [
      { title: "Campaign delivery", body: "Plan and execute successful media campaigns." },
      { title: "Broadcast & press", body: "Use interviews, radio, newspaper and television strategically." },
      { title: "Social platforms", body: "Manage channels with clearer purpose and consistency." },
      { title: "Imams Online journey", body: "Learning informed by Faith Associates’ own media and leadership networks." },
    ],
    outcomes: ["A practical media plan", "More confident spokespeople", "Stronger platform management", "Clearer public messaging"],
  },
  {
    slug: "away-day-strategic-planning-facilitation-for-charities-businesses-mosques",
    eyebrow: "Strategic services",
    title: "Away Day Strategic Planning Facilitation",
    summary:
      "Facilitated strategy away-days for charities, businesses and mosques — clarifying vision, priorities and shared goals.",
    image: wp("2017/12/fa_slider1.jpg"),
    intro: [
      "Strategic planning away-days help institutions review direction, focus resources and align people around common outcomes.",
      "Faith Associates brings methods and facilitation experience so leadership teams can set priorities and strengthen operations.",
    ],
    highlights: [
      { title: "Priority setting", body: "Plan organisational priorities with clarity and realism." },
      { title: "Resource focus", body: "Strengthen operations by concentrating effort where it matters." },
      { title: "Shared goals", body: "Align employees, volunteers and stakeholders around common outcomes." },
      { title: "Vision & mission", body: "Create or refine vision, mission and objectives for the next phase." },
    ],
    outcomes: ["A shared strategic direction", "Clearer priorities and outcomes", "Stronger stakeholder alignment", "Practical next steps"],
  },
  {
    slug: "designated-safeguarding-lead",
    eyebrow: "Safeguarding training",
    title: "Designated Safeguarding Lead Training",
    summary:
      "One-day DSL training for the adult with lead responsibility for safeguarding, referrals and staff advice.",
    image: wp("2017/12/Madrassah-Training-Ealing.jpg"),
    intro: [
      "Every setting should designate an adult — the Designated Safeguarding Lead — with lead responsibility for safeguarding and child protection.",
      "This one-day course strengthens understanding of abuse and safeguarding risks, how to refer concerns, and what happens after a referral.",
    ],
    highlights: [
      { title: "DSL role clarity", body: "Advice, support and decision-making responsibilities inside the institution." },
      { title: "Referrals", body: "When and how to refer to the local authority or police." },
      { title: "Allegations & complaints", body: "Handling concerns involving staff and volunteers." },
      { title: "Certification", body: "Certificate on full participation for the duration of the course." },
    ],
    outcomes: ["A clearer DSL role", "Stronger referral confidence", "Better support for staff", "Improved safeguarding leadership"],
  },
  {
    slug: "international-safeguarding-training",
    eyebrow: "Safeguarding training",
    title: "International Safeguarding Training",
    summary:
      "Accredited safeguarding training for mosques and madrassahs, delivered across the UK and internationally including UN-linked programmes.",
    image: wp("2018/02/FullSizeRender-3-1110x550.jpg"),
    intro: [
      "This programme enhances knowledge of protecting children and vulnerable people in Islamic institutions, recognising warning signs and taking the right action.",
      "Alongside 15 years of UK delivery, Faith Associates has trained leaders across Africa, Asia and Europe — including UN-linked work in Tanzania.",
    ],
    highlights: [
      { title: "Core safeguarding curriculum", body: "Abuse definitions, CSE, contextual safeguarding, disclosure and information sharing." },
      { title: "Contemporary risks", body: "E-safety, radicalisation, FGM, forced marriage and peer-on-peer abuse." },
      { title: "Islamic institutional context", body: "Roles, responsibilities and practice for mosques and madrassahs." },
      { title: "International delivery", body: "Programmes adapted for partners beyond the UK." },
    ],
    outcomes: ["Stronger safeguarding awareness", "Clearer action on concerns", "Better institutional protection", "Shared standards across borders"],
  },
  {
    slug: "imam-e-safety-training",
    eyebrow: "Safeguarding training",
    title: "E-Safety Training",
    summary:
      "Interactive e-safety training for imams, teachers and mosque leaders, grounded in real faith-sector cases and Digital Citizens resources.",
    image: wp("2016/01/imam-smartphobe.jpg"),
    intro: [
      "As mosques and madrassahs work more online, children, staff and volunteers need protection from harmful and inappropriate digital material.",
      "Training covers categories of risk, good e-safety practice and how leaders can teach digital citizenship using Faith Associates’ Muslim Digital Citizens resources.",
    ],
    highlights: [
      { title: "Risk awareness", body: "Technology risks for children and staff, including cyber-bullying and exploitation." },
      { title: "Prevention & response", body: "Filters, monitoring, disclosures and incident handling." },
      { title: "Policy into practice", body: "Link safe technology use to institutional policies." },
      { title: "Leadership cascade", body: "Equip leaders to deliver sessions to congregations and students." },
    ],
    outcomes: ["Clearer e-safety responsibilities", "Stronger digital safeguarding habits", "Certificate for attendees", "Leaders able to cascade learning"],
  },
  {
    slug: "child-protection-and-safeguarding",
    eyebrow: "Safeguarding training",
    title: "Child Protection & Safeguarding Training",
    summary:
      "Accredited introduction-level safeguarding for staff and leaders supervising children in mosques and madrassahs.",
    image: wp("2017/12/Madrassah-Training-Ealing.jpg"),
    intro: [
      "This course is essential for personnel responsible for supervising pupils, helping institutions fulfil their duty to keep children safe.",
      "It builds awareness of warning signs, incident handling and preventative practice. No previous safeguarding knowledge is required.",
    ],
    highlights: [
      { title: "Mandatory awareness", body: "Suitable for teachers, managers, administrators and assistants — paid or volunteer." },
      { title: "Practical application", body: "Act on concerns about safety and welfare with confidence." },
      { title: "Policy familiarity", body: "Participants should know their institution’s safeguarding policy and staff code of conduct." },
      { title: "Certification", body: "Certificate typically valid for three years after full participation." },
    ],
    outcomes: ["Baseline safeguarding competence", "Clearer incident response", "Stronger pupil protection", "Documented staff training"],
    stat: { value: "3 hrs", label: "typical course duration" },
  },
  {
    slug: "mosque-safeguarding-review",
    eyebrow: "Safeguarding training",
    title: "Mosque Leadership and Management Safeguarding Training",
    summary:
      "Level 1 local-authority-accredited safeguarding for mosque and madrassah leadership teams.",
    image: wp("2018/02/liverpool-training.jpg"),
    intro: [
      "This Level 1 programme is tailored for Islamic institutions and updated to cover contemporary safeguarding risks facing children and vulnerable people.",
      "It is designed for leaders and staff who work directly with children, young people and families.",
    ],
    highlights: [
      { title: "Core topics", body: "Safeguarding in Islam, national agenda, definitions of abuse and disclosure practice." },
      { title: "Complex risks", body: "CSE, FGM, forced marriage, radicalisation, peer-on-peer abuse and e-safety." },
      { title: "Roles & responsibilities", body: "Clear expectations inside mosques and supplementary schools." },
      { title: "Expert materials", body: "Accredited trainers and materials to review annually." },
    ],
    outcomes: ["Leadership-level safeguarding fluency", "Stronger recognition of risk", "Clearer institutional responsibilities", "Materials for ongoing review"],
  },
  {
    slug: "madrassah-teacher-training",
    eyebrow: "Madrassah support",
    title: "Madrassah Teacher Training",
    summary:
      "A two-day intensive course for madrassah and supplementary-school teachers covering pedagogy, behaviour, planning and safeguarding.",
    image: wp("2016/01/image1-1024x576.jpg"),
    intro: [
      "Being a madrassah or supplementary-school teacher is demanding. This course gives practical knowledge teachers can apply immediately to improve professionalism, effectiveness and pupils’ learning experience.",
      "It is designed for teachers and assistants working with children aged 5–17.",
    ],
    highlights: [
      { title: "Classroom practice", body: "Positive classroom context, expectations, lesson structures and learning behaviours." },
      { title: "Behaviour & relationships", body: "Motivation, behaviour responses, class agreements and building positive relationships." },
      { title: "Teaching craft", body: "Resources, initiatives, differentiation and assessment approaches." },
      { title: "Safeguarding context", body: "National safeguarding agenda awareness for teaching staff." },
    ],
    outcomes: ["Stronger classroom practice", "Clearer behaviour approaches", "Better lesson planning", "Certificate typically valid for three years"],
  },
  {
    slug: "imam-chaplaincy-awareness-program",
    eyebrow: "Imam services",
    title: "Imam Chaplaincy Awareness Program",
    summary:
      "Chaplaincy skills for imams working in hospitals, prisons, schools and multi-faith institutional settings.",
    image: wp("2017/12/Imams-Online-Audience-2-1024x684.jpg"),
    intro: [
      "This course is for imams who want to develop chaplaincy skills — supporting spiritual and pastoral needs while working closely with people of other faiths or no faith.",
      "Chaplains may work in settings such as the NHS, HM prisons and schools, and need a philosophy of practice suited to those contexts.",
    ],
    highlights: [
      { title: "Institutional chaplaincy", body: "Manage the challenge of being a religious representative in hospitals and education settings." },
      { title: "Multi-faith practice", body: "Critical reflection on working with other faiths and people of no faith." },
      { title: "Personal philosophy", body: "Develop an approach consistent with your strengths, training and operating context." },
      { title: "On-site delivery", body: "Expert trainers deliver bespoke materials at your chosen venue." },
    ],
    outcomes: ["Stronger chaplaincy confidence", "Clearer multi-faith practice", "A personal chaplaincy philosophy", "Better readiness for institutional roles"],
  },
  {
    slug: "digital-safety-ambassadors-programme",
    eyebrow: "Online safety",
    title: "Muslim Digital Safety Ambassadors Programme",
    summary:
      "A peer-led mentoring and classroom programme that helps young Muslims challenge hate, build resilience and become model digital citizens.",
    image: wp("2019/12/a29330fd-c8ee-4499-8f0b-c19efb86541c.jpg"),
    intro: [
      "The Muslim Digital Safety Ambassadors initiative combines mentoring, technical learning and peer-led classroom training, with online portal support and face-to-face delivery.",
      "Supported by partners including Google and the London Mayor’s Office, the programme focuses on online safety, mental health and peer-to-peer support.",
    ],
    highlights: [
      { title: "Core practice areas", body: "Digital citizenship, media balance, privacy, fake news, relationships, cyberbullying and hate speech." },
      { title: "Peer leadership", body: "Ambassadors support fellow pupils with advice and positive digital habits." },
      { title: "School fit", body: "Aligns with health and wellbeing curriculum priorities around online safety." },
      { title: "Proven launch path", body: "Piloted with Muslim schools and partners including a Facebook HQ conference." },
    ],
    outcomes: ["Peer digital-safety champions", "Stronger resilience to online harm", "Practical classroom curriculum", "A celebration pathway for pupil work"],
  },
];

/** Zoho booking / enquiry forms scraped from WordPress service pages (and matching SQL backup forms). */
const serviceZohoForms: Record<string, string> = {
  "1-day-mosque-management-governance-master-class-training":
    "https://forms.zohopublic.eu/info157/form/BookingFormBookingForm1DayMosqueManagementGovernan/formperma/qWA5H0T_un6LUDFz2t2Ic2VoW-KbF_9Hx-Y11IbLq-o",
  "2-day-mosque-management-governance-master-class-training":
    "https://forms.zohopublic.eu/info157/form/BookingFormBookingForm2DayMosqueManagementGovernan/formperma/NM0bQtDjhRRaVZwzLSkXpQ6KGxs-vZ5Z1EIPhTRlxW8",
  "safer-recruitment-training":
    "https://forms.zohopublic.eu/info157/form/BookingFormSaferRecruitmentTraining/formperma/Y1PM5jZKQXqxOP7qYntHS27qNYk2rFgdqQ14W_0P2No",
  "first-aid-training-for-mosques-and-madrassahs":
    "https://forms.zohopublic.eu/info157/form/BookingFormFirstAidTraining/formperma/A4Sr3Ez867xmadLgefPPch2E69Ir6EjEU9mb9Sd8tWI",
  "covid-19-risk-assessment-training-for-mosques-and-madrassahs":
    "https://forms.zohopublic.eu/info157/form/OrderForm/formperma/VNfwTKseXPdj10-i0H2GrEfIHUE4_IjKKcZr_4lEgiU",
  "protect-duty-and-martyns-law-training":
    "https://forms.zohopublic.eu/info157/form/OrderForm/formperma/VNfwTKseXPdj10-i0H2GrEfIHUE4_IjKKcZr_4lEgiU",
  "mosque-security-risk-assessment":
    "https://forms.zohopublic.eu/info157/form/OrderForm/formperma/VNfwTKseXPdj10-i0H2GrEfIHUE4_IjKKcZr_4lEgiU",
  "mosque-security-training":
    "https://forms.zohopublic.eu/info157/form/ContactUsMosqueSecurity/formperma/ZCNXvFCtFWp-bf62mYnIGI_UM-3-np6G5AyF7pvWdKg",
  "beacon-mosque-accreditation":
    "https://forms.zohopublic.eu/info157/form/GetAccreditedasaBeaconMosque/formperma/4v3V_rfgrscdlarwEAUy-kOXBSC47G4esIDpwnhXNOk",
  "women-in-mosque-leadership":
    "https://forms.zohopublic.eu/info157/form/WomeninMosqueManagementandLeadership1DayTrainingMa/formperma/FChozlbEZIQczTYunTxacmOXbBoexf6z30l4ZUQTF44",
  "designated-safeguarding-lead":
    "https://forms.zohopublic.eu/info157/form/BookingFormDesignatedSafeguardingLeadTraining/formperma/toQbtWQEjeiZ0U5W4XWdulE6cowj_J883facNgEB8iI",
  "international-safeguarding-training":
    "https://forms.zohopublic.eu/info157/form/BookingFormChildProtectionandSafeguardingTraining/formperma/6sZgOvvpw5fe50wNegmXrDMJIFv7h-dtW_TwIX5YG6c",
  "mosque-safeguarding-review":
    "https://forms.zohopublic.eu/info157/form/BookingFormChildProtectionandSafeguardingTraining/formperma/6sZgOvvpw5fe50wNegmXrDMJIFv7h-dtW_TwIX5YG6c",
  "child-protection-and-safeguarding":
    "https://forms.zohopublic.eu/info157/form/ChildProtectionandSafeguardingTraining/formperma/QBRsdk-MGMLBbL-7JZ7En81640T6hhqVp9hHnWzaHy4",
};

for (const offering of serviceOfferings) {
  const zohoFormUrl = serviceZohoForms[offering.slug];
  if (zohoFormUrl) offering.zohoFormUrl = zohoFormUrl;
}

const offer = (slug: string, title?: string): CatalogueLink => {
  const item = serviceOfferings.find((entry) => entry.slug === slug);
  if (!item) throw new Error(`Missing service offering: ${slug}`);
  return {
    title: title ?? item.title,
    href: `/services/${item.slug}`,
    summary: item.summary,
    image: item.image,
  };
};

const pub = (slug: string, title: string, summary?: string): CatalogueLink => ({
  title,
  href: `/publications/${slug}`,
  summary,
});

export const serviceCatalogues: ServiceCatalogue[] = [
  {
    slug: "mosque-services",
    intro: [
      "Practical training, accreditation and operational support for mosque trustees, staff and volunteers.",
      "Browse masterclasses, security and compliance training, leadership programmes and specialist institutional services.",
    ],
    sections: [
      {
        id: "training-courses",
        title: "Training courses",
        summary: "Focused masterclasses and operational training for mosque leadership teams.",
        links: [
          offer("1-day-mosque-management-governance-master-class-training"),
          offer("2-day-mosque-management-governance-master-class-training"),
          offer("safer-recruitment-training"),
          offer("first-aid-training-for-mosques-and-madrassahs"),
          offer("covid-19-risk-assessment-training-for-mosques-and-madrassahs", "Risk Assessment Training for Mosques and Madrassahs"),
          offer("mosque-security-training", "Mosque Security Awareness Training"),
        ],
      },
      {
        id: "mosque-services",
        title: "Mosque services",
        summary: "Accreditation, leadership, policy, elections and protective security support.",
        links: [
          offer("protect-duty-and-martyns-law-training"),
          offer("beacon-mosque-accreditation"),
          offer("women-in-mosque-leadership"),
          offer("mosque-policy-and-procedure-development", "Mosque Policy and Procedure Development"),
          offer("mosque-election-management", "Mosque Election Management"),
          offer("mosque-security-risk-assessment", "Mosque Security Risk Assessment"),
        ],
      },
      {
        id: "strategic-services",
        title: "Strategic services",
        summary: "Campaign, events and media support for institutions and partners.",
        links: [
          offer("strategic-campaign-planning-execution"),
          offer("strategic-conference-and-event-planning"),
          offer("media-planning"),
        ],
      },
      {
        id: "safeguarding-services",
        title: "Safeguarding services",
        summary: "Training that helps safeguarding become everyday practice.",
        links: [
          offer("designated-safeguarding-lead"),
          offer("international-safeguarding-training"),
          offer("imam-e-safety-training"),
          offer("child-protection-and-safeguarding"),
        ],
      },
    ],
  },
  {
    slug: "madrassah-support",
    intro: [
      "Training and support for madrassahs, maktabs and supplementary schools — from teacher development to safeguarding and safer recruitment.",
    ],
    sections: [
      {
        id: "madrassah-training",
        title: "Madrassah training & support",
        summary: "Courses tailored for supplementary-school leaders, teachers and volunteers.",
        links: [
          offer("protect-duty-and-martyns-law-training"),
          offer("covid-19-risk-assessment-training-for-mosques-and-madrassahs", "Risk Assessment Training for Mosques and Madrassahs"),
          offer("safer-recruitment-training"),
          offer("designated-safeguarding-lead"),
          offer("international-safeguarding-training"),
          offer("imam-e-safety-training"),
          offer("madrassah-teacher-training"),
        ],
      },
    ],
  },
  {
    slug: "imam-services",
    intro: [
      "Non-theological development for imams and faith leaders — chaplaincy skills, digital safety and confident public leadership.",
    ],
    sections: [
      {
        id: "imam-training",
        title: "Imam programmes",
        links: [offer("imam-chaplaincy-awareness-program"), offer("imam-e-safety-training")],
      },
    ],
  },
  {
    slug: "strategic-services",
    intro: [
      "Campaign, conference, media and facilitation support for institutions, charities and public-interest programmes.",
    ],
    sections: [
      {
        id: "strategic-offerings",
        title: "Strategic offerings",
        links: [
          offer("strategic-campaign-planning-execution"),
          offer("strategic-conference-and-event-planning"),
          offer("media-planning"),
          offer("away-day-strategic-planning-facilitation-for-charities-businesses-mosques"),
        ],
      },
    ],
  },
  {
    slug: "safeguarding",
    intro: [
      "We offer a range of safeguarding training courses that can be tailored to your organisation’s specific needs. If you cannot find what you need, contact us to discuss requirements.",
    ],
    policyHref:
      "https://www.faithassociates.co.uk/wp-content/uploads/2022/12/FA-CIC-F8_PP1_001-Child-Protection-Policy-2022.pdf",
    policyLabel: "Our safeguarding policy",
    sections: [
      {
        id: "safeguarding-courses",
        title: "Safeguarding courses",
        links: [
          offer("designated-safeguarding-lead"),
          offer("international-safeguarding-training"),
          offer("imam-e-safety-training"),
          offer("child-protection-and-safeguarding"),
          offer("mosque-safeguarding-review"),
        ],
      },
    ],
  },
  {
    slug: "safety",
    variant: "safety",
    intro: [
      "Faith Associates works online and offline to improve the safety of children and adults, and the security of Islamic institutions. Award-winning safety training has been delivered to mosques and madrassahs globally for over 15 years.",
    ],
    sections: [
      {
        id: "stand-for",
        title: "What we stand for",
        body: [
          "Faith Associates are seen as safety experts in faith-based establishments, providing award-winning safety training to mosques and madrassahs globally for over 15 years.",
        ],
        bullets: [
          "Protect the welfare of children and adults online and in Islamic institutions.",
          "Protect mosques and congregations from a security point of view.",
          "Improve quality standards and develop training that benefits mosques and madrassahs.",
        ],
        image: "/assets/real/security-training-session.jpg",
        links: [],
      },
      {
        id: "work-for-change",
        title: "Our work for change",
        body: [
          "Our safety work runs on two fronts. Online, we equip young people, teachers and faith leaders to recognise harm, challenge hate and build resilience. Offline, we train mosque and madrassah teams in safeguarding, incident response and the protective security of the building and congregation.",
          "Fifteen years of delivery has produced accredited courses, national guidance and published toolkits that institutions use in daily practice.",
        ],
        ctaLabel: "Talk to our safety team",
        ctaHref: "/contact",
        links: [],
      },
      {
        id: "digital-ambassadors",
        title: "Muslim Digital Safety Ambassadors Programme",
        summary:
          "A free interactive mentoring, technical and peer-led classroom-based training programme.",
        body: [
          "The programme gives young Muslims the confidence to challenge hate, react positively and build resilience among their peer groups.",
          "Training and support are provided online through a secure portal and in the classroom through face-to-face training. Model Digital Citizens work is supported by Google and the London Mayor’s Office, and concludes with a presentation ceremony in London.",
        ],
        image: "/assets/real/faith-training-speaker.jpg",
        links: [offer("digital-safety-ambassadors-programme")],
      },
      {
        id: "online-safety",
        title: "Online safety",
        summary:
          "Through training, publications and portals, Faith Associates helps safeguard children and adults at risk in the online world.",
        ctaLabel: "Visit our safety publications",
        ctaHref: "/publications",
        links: [
          pub("keeping-muslims-safe-online", "Facebook Safety Guide"),
          pub("keeping-muslims-safe-online", "Keeping Young Muslims Safe Online workshop"),
          offer("digital-safety-ambassadors-programme", "Digital Safety Ambassadors Programme"),
          pub("muslim-digital-citizens-guide", "Muslim Digital Citizens Guide (Infographic)"),
          pub("muslim-digital-citizens-guide-animated-version", "Muslim Digital Citizens Guide (Animation)"),
          offer("imam-e-safety-training", "E-Safety Training"),
        ],
      },
      {
        id: "offline-safety",
        title: "Offline safety",
        summary:
          "Award-winning safeguarding, madrassah and mosque security training tailored for mosque and madrassah leaders.",
        ctaLabel: "See our safety services",
        ctaHref: "/services/safeguarding",
        links: [
          pub("madrassah-management-and-safeguarding", "Madrassah Safeguarding Guide"),
          pub("safeguarding-guide-2016", "Safeguarding guide for Faith Institutions"),
          offer("child-protection-and-safeguarding", "Level 1 Safeguarding Training"),
          offer("mosque-security-training", "Mosque Security safety training"),
        ],
      },
      {
        id: "safety-partnerships",
        title: "Partnerships",
        summary:
          "Safety work has been delivered with technology, civic and community partners so faith institutions can access practical, credible guidance.",
        links: [
          {
            title: "Google.org",
            href: "/about/clients",
            summary: "Digital citizenship and youth-focused online-safety programmes.",
            image: "/assets/clients/google-org.jpg",
          },
          {
            title: "Facebook / Meta",
            href: "/about/clients",
            summary: "Keeping Muslims Safe Online guidance and responsible digital participation.",
            image: "/assets/clients/facebook-meta.jpg",
          },
          {
            title: "Nordic Safe Cities",
            href: "/about/clients",
            summary: "European collaboration on safer, inclusive and empowered communities.",
            image: "/assets/clients/nordic-safe-cities.png",
          },
        ],
      },
      {
        id: "safety-publications",
        title: "Safety publications",
        summary: "Guides, cards and toolkits teams can use in daily practice.",
        ctaLabel: "Download our safety publications",
        ctaHref: "/publications",
        links: [
          pub("madrassah-management-and-safeguarding", "Madrassah Management Safeguarding Guide"),
          pub("safeguarding-guide-2016", "Safeguarding guide for Faith Institutions"),
          pub("madrassah-safeguarding-card", "Madrassah Teacher Safeguarding Card"),
          pub("safety-checklist-for-madrassah-teachers", "Safety Checklist Guide"),
          pub("keeping-muslims-safe-online", "Facebook Safety Guide"),
          pub("muslim-digital-citizens-guide", "Muslim Digital Citizens Toolkit"),
        ],
      },
    ],
    quote: {
      text: "Every one of you is a protector and guardian and responsible for your wards and things under your care.",
      attribution: "The Prophet Muhammad (peace be upon him)",
    },
  },
];

export function getServiceCatalogue(slug: string) {
  return serviceCatalogues.find((catalogue) => catalogue.slug === slug);
}

export function getServiceOffering(slug: string) {
  return serviceOfferings.find((offering) => offering.slug === slug);
}
