export type PublicationCategory =
  | "Governance & standards"
  | "Security & resilience"
  | "Safeguarding & inclusion"
  | "Reports & insight"
  | "Legacy guidance";

type PublicationSource = {
  slug: string;
  title: string;
  image: string;
  updated: string;
  summary?: string;
};

export type Publication = PublicationSource & {
  category: PublicationCategory;
  format: "Booklet" | "Guide" | "Report" | "Resource" | "Newsletter";
  year: string;
  isLegacy: boolean;
  downloadUrl?: string;
  zohoFormUrl?: string;
  legacyNoticeTitle: string;
  legacyNoticeBody: string;
  accessEyebrow: string;
  downloadCtaLabel: string;
  requestCtaLabel: string;
  publishedBy: string;
  resourceTypeLabel: string;
  catalogueYearLabel: string;
  overviewEyebrow: string;
  overviewTitle: string;
  overviewBody: string;
  requestEyebrow: string;
  requestTitle: string;
  requestBody: string;
  usageEyebrow: string;
  usageSteps: string[];
  implementationTitle: string;
  implementationBody: string;
  implementationCtaLabel: string;
  relatedEyebrow: string;
  relatedTitle: string;
  relatedCtaLabel: string;
};

const publicationSources: PublicationSource[] = [
  { slug: "mosque-and-madrassah-quarterly-i1-q3", title: "Mosque and Madrassah Quarterly I1 Q3", image: "https://www.faithassociates.co.uk/wp-content/uploads/2017/12/Cover-Page-I1Q31-675x954.jpg", updated: "2020-02-28" },
  { slug: "uel-certified-introduction-to-madrassah-teaching", title: "UEL Certified Introduction To Madrassah Teaching", image: "https://www.faithassociates.co.uk/wp-content/uploads/2017/12/UEL-Madrassah-Teachers-Open-Day-.png", updated: "2020-02-28" },
  { slug: "mosque-and-madrassah-quarterly-2016", title: "Mosque and Madrassah Quarterly – 2016", image: "https://www.faithassociates.co.uk/wp-content/uploads/2017/12/Mosque-and-Madrassah-Quarterly-2016.jpg", updated: "2020-02-28" },
  { slug: "mosque-and-madrassah-quarterly-2014-i1-q1", title: "Mosque and Madrassah Quarterly 2014, I1 Q1", image: "https://www.faithassociates.co.uk/wp-content/uploads/2017/12/M-M-Quart-2014-I1-Q1-.png", updated: "2020-02-28" },
  { slug: "mosque-and-madrassah-quarterly-ramadan-2015", title: "Mosque and Madrassah Quarterly, Ramadan 2015", image: "https://www.faithassociates.co.uk/wp-content/uploads/2017/12/MM-Quarterly-2015.jpg", updated: "2020-02-28" },
  { slug: "mosque-and-madrassah-quarterly-issue-1-quarter-1-2013", title: "Mosque and Madrassah Quarterly Issue 1 Quarter 1 – 2013", image: "https://www.faithassociates.co.uk/wp-content/uploads/2017/12/Front-Page-Issue-1-V11-675x955.jpg", updated: "2020-02-28" },
  { slug: "mosque-and-madrassah-quarterly-i1-q2", title: "Mosque and Madrassah Quarterly I1 Q2", image: "https://www.faithassociates.co.uk/wp-content/uploads/2017/12/FA-MM-Quaterly-I1Q2-Front-page-675x955.jpg", updated: "2020-02-28" },
  { slug: "faith-associates-newsletter-2018", title: "Faith Associates Newsletter 2018", image: "https://www.faithassociates.co.uk/wp-content/uploads/2018/11/FA-Newsletter-2018-compressed-01.jpg", updated: "2020-02-28" },
  { slug: "muslim-digital-citizens-guide-animated-version", title: "Muslim Digital Citizens Guide (Animated Version)", image: "https://www.faithassociates.co.uk/wp-content/uploads/2018/06/animation-cover-JPEG.jpg", updated: "2020-05-14" },
  { slug: "mosque-and-madrassah-quarterly-201780", title: "Mosque and Madrassah Quarterly 2017", image: "https://www.faithassociates.co.uk/wp-content/uploads/2017/12/MM-2017-front-cover.jpg", updated: "2020-05-14" },
  { slug: "muslim-digital-safety-ambassadors-digital-citizens-2020-2021-impact-report", title: "Muslim Digital Safety Ambassadors & Digital Citizens 2020-2021 Impact Report", image: "https://www.faithassociates.co.uk/wp-content/uploads/2022/07/2020-21-Impact-Report-Front-Image.jpg", updated: "2023-05-22" },
  { slug: "4th-british-beacon-mosque-awards-2021-booklet", title: "4th British Beacon Mosque Awards 2021 Booklet", image: "https://www.faithassociates.co.uk/wp-content/uploads/2021/12/British-Beacon-Mosque-Awards-2021.png", updated: "2023-05-22" },
  { slug: "disabled-access", title: "Disabled Access in Mosques", image: "https://www.faithassociates.co.uk/wp-content/uploads/2021/10/284b04a0-4e7b-40c7-9f4f-b22a90b3b183.jpg", updated: "2023-05-22", summary: "Information and guidance for places of worship assessing disabled access and creating a more welcoming environment." },
  { slug: "3rd-british-beacon-mosque-awards-2020-booklet", title: "3rd British Beacon Mosque Awards 2020 Booklet", image: "https://www.faithassociates.co.uk/wp-content/uploads/2020/12/British-beacon-Mosque-Awards-2020-FINAL-page-001.jpg", updated: "2023-05-22" },
  { slug: "mosque-management-covid19-secure-advise-from-july-19th-2021", title: "Mosque Management COVID-19 Secure Advice from July 19th 2021", image: "https://www.faithassociates.co.uk/wp-content/uploads/2021/07/9a33ec03-bbd3-42f9-a976-79a0fcf031ac.jpeg", updated: "2023-05-23" },
  { slug: "preparing-for-ramadan-2021-mosque-management-guidance", title: "Preparing for Ramadan 2021: Mosque Management Guidance", image: "https://www.faithassociates.co.uk/wp-content/uploads/2021/04/image_6483441-42.jpg", updated: "2023-05-23" },
  { slug: "england-lockdown-mosque-and-madrassah-management", title: "England Lockdown – Mosque and Madrassah Management", image: "https://www.faithassociates.co.uk/wp-content/uploads/2020/11/Mosque-and-Madrassah-Management-Guidance-2nd-Lockdown.jpg", updated: "2023-05-23" },
  { slug: "one-year-on-from-october-7th-incidents-against-mosques-muslim-institutions-in-the-uk", title: "One Year On From October 7th: Incidents Against Mosques & Muslim Institutions In The UK", image: "https://www.faithassociates.co.uk/wp-content/uploads/2024/10/IMG-20241008-WA0001.jpg", updated: "2025-06-19" },
  { slug: "incident-management-guide-2019", title: "Incident Management Guide 2019", image: "https://www.faithassociates.co.uk/wp-content/uploads/2017/12/Incident-Management-Guide-Draft-2_Page_01.jpg", updated: "2025-06-23", summary: "A guide for faith institution managers and leaders introducing incident management and walking through each stage of a response." },
  { slug: "6th-british-beacon-mosque-awards-2023-booklet", title: "6th British Beacon Mosque Awards 2023 Booklet", image: "https://www.faithassociates.co.uk/wp-content/uploads/2023/11/British-Beacon-Mosque-Awards-2023-1.jpg", updated: "2025-06-23", summary: "The official booklet celebrating the 2023 nominees and the work recognised through the British Beacon Mosque Awards." },
  { slug: "5th-british-beacon-mosque-awards-2022-booklet", title: "5th British Beacon Mosque Awards 2022 Booklet", image: "https://www.faithassociates.co.uk/wp-content/uploads/2023/02/British-Beacon-Mosque-Awards-2022.png", updated: "2025-06-23", summary: "The official booklet celebrating the 2022 nominees and the work recognised through the British Beacon Mosque Awards." },
  { slug: "muslim-digital-safety-ambassadors-digital-citizens-2021-2022-impact-report", title: "Muslim Digital Safety Ambassadors & Digital Citizens 2021-2022 Impact Report", image: "https://www.faithassociates.co.uk/wp-content/uploads/2022/07/2021-22-Impact-Report-Front-Image.jpg", updated: "2025-06-23" },
  { slug: "faith-associates-newsletter", title: "Faith Associates Newsletter", image: "https://www.faithassociates.co.uk/wp-content/uploads/2017/12/Faith-Newsletter_Newsletter-11-09-Page-0011-212x300.jpg", updated: "2025-06-23" },
  { slug: "mosque-advice-on-coronavirus", title: "Mosque Advice on Coronavirus / Supported by Council of Mosques", image: "https://www.faithassociates.co.uk/wp-content/uploads/2020/03/Printable-Poster-13-3-20.png", updated: "2025-06-25", summary: "Archived guidance for mosques, madrassahs and imams, developed with support from UK councils of mosques." },
  { slug: "mosque-itikaf-covid-19-safe-risk-assessment-checklist", title: "Mosque I’tikaf Safe Risk Assessment Checklist", image: "https://www.faithassociates.co.uk/wp-content/uploads/2021/05/2021-I-TIKAF-Mosque-COVID-Safe-RA-Review-CFM-Self-Assessment-page-001.jpg", updated: "2025-06-26" },
  { slug: "10-security-tips-for-mosques-during-covid-19-lockdown", title: "10 Security Tips for Mosques", image: "https://www.faithassociates.co.uk/wp-content/uploads/2020/02/10-security-tips-for-Mosques-during-Coronavirus-Lockdown-Final-page-001-1.jpg", updated: "2025-06-26" },
  { slug: "mosque-management-covid-19-guidance-omicron-advise-plan-b-measures", title: "Mosque Management Guidance: Omicron Advice / Plan B Measures", image: "https://www.faithassociates.co.uk/wp-content/uploads/2020/02/Mosque-Management-COVID-19-Guidance-Omicron-Advise-Plan-B-Measures.jpg", updated: "2025-06-26" },
  { slug: "managing-suspected-covid-19-outbreak-in-madrassah-ooss", title: "Managing a Suspected Outbreak in a Madrassah / OOSS", image: "https://www.faithassociates.co.uk/wp-content/uploads/2020/10/image_6483441.jpg", updated: "2025-06-26" },
  { slug: "10-security-tips-for-covid-19-secure-mosques-or-islamic-centre", title: "10 Security Tips for Secure Mosques with European Translations", image: "https://www.faithassociates.co.uk/wp-content/uploads/2020/08/3987-FA-M-Mosques-Post-COVID-19-Mosque-Re-Opening-V3.jpg", updated: "2025-06-26", summary: "Security tips for mosque leaders reopening places of worship while maintaining protection from hate crime." },
  { slug: "mosque-covid-19-safety-poster-templates", title: "Mosque Safety Poster Templates – 18 Posters Available", image: "https://www.faithassociates.co.uk/wp-content/uploads/2020/06/FA-Mosque-COVID-19-POSTER-TEMPLATE-page-011.jpg", updated: "2025-06-26" },
  { slug: "covid-19-risk-assessment-keeping-our-mosques-safe", title: "Keeping Our Mosques & Worshippers Safe – Risk Assessment Guidance", image: "https://www.faithassociates.co.uk/wp-content/uploads/2020/05/8bb03fb6-8790-47e1-86ad-7e0ba687072e.jpeg", updated: "2025-06-26", summary: "Archived risk-assessment guidance produced to support safer mosque and madrassah reopening." },
  { slug: "positive-covid-19-test-mosque-notification-checklist", title: "Positive Test – Mosque Notification Checklist", image: "https://www.faithassociates.co.uk/wp-content/uploads/2015/08/oa.jpg", updated: "2025-06-26", summary: "An archived checklist outlining the steps a mosque should take following notification of a positive test." },
  { slug: "7th-british-beacon-mosque-awards-2024-booklet", title: "7th British Beacon Mosque Awards 2024 Booklet", image: "https://www.faithassociates.co.uk/wp-content/uploads/2024/12/Booklet-British-Beacon-Mosque-Awards-2023.png", updated: "2026-01-05" },
  { slug: "faith-associates-2024-activity-report", title: "Faith Associates 2024 Activity Report", image: "https://www.faithassociates.co.uk/wp-content/uploads/2024/12/Faith-Associates-2024-Report-1.png", updated: "2026-01-05", summary: "A review of Faith Associates programmes, partnerships and community impact across 2024." },
  { slug: "hate-harassement-extremism-in-video-games", title: "Hate, Harassment & Extremism in Video Games", image: "https://www.faithassociates.co.uk/wp-content/uploads/2024/01/Hate-Harassament-Extremism-in-Video-Games_page-0001.jpg", updated: "2026-03-26" },
  { slug: "10-security-tips-for-women-attending-the-mosque", title: "10 Security Tips for Women Attending the Mosque", image: "https://www.faithassociates.co.uk/wp-content/uploads/2024/08/IMG-20240807-WA0016.jpg", updated: "2026-03-26" },
  { slug: "muslim-digital-citizens-guide", title: "Muslim Digital Citizens Guide", image: "https://www.faithassociates.co.uk/wp-content/uploads/2019/01/19723-FA-M-Muslim-Digital-Citizens-Toolkit-document-on-A5-arabic-V21-01.jpg", updated: "2026-03-26", summary: "A practical guide to rights, responsibilities and positive behaviour in an increasingly connected online world." },
  { slug: "covid-19-balancing-the-mosque-finances-during-covid-19-lockdown", title: "Balancing the Mosque Finances", image: "https://www.faithassociates.co.uk/wp-content/uploads/2020/05/Mosque-Balance-Finance-FP1.png", updated: "2026-03-26", summary: "Archived guidance on fundraising, donations, strategic communication and social media during lockdown." },
  { slug: "keeping-muslims-safe-online", title: "Keeping Muslims Safe Online", image: "https://www.faithassociates.co.uk/wp-content/uploads/2017/12/IMG_20171129_080408.jpg", updated: "2026-03-26" },
  { slug: "zakat", title: "Mosque Collecting and Distributing Zakat Locally", image: "https://www.faithassociates.co.uk/wp-content/uploads/2026/03/Al-Fuqara-1.png", updated: "2026-04-13", summary: "Shaukat Warraich’s practical guide to how mosques can collect zakat and sadaqa and distribute support locally with trust and care." },
  { slug: "protect-duty-presentation", title: "Protect Duty Presentation", image: "https://www.faithassociates.co.uk/wp-content/uploads/2023/06/Green-Natural-Project-Report-4.png", updated: "2026-06-22" },
  { slug: "beacon-mosque-vision-2020-2050", title: "Beacon Mosque Vision 2020–2050", image: "https://www.faithassociates.co.uk/wp-content/uploads/2019/12/Beacon-Mosque-Vision-2020-50-page-001.jpg", updated: "2026-06-22", summary: "Shaukat Warraich’s vision for the role, quality and community impact of the 21st-century Beacon Mosque." },
  { slug: "muslim-womens-guide-to-mosque-governance-management-and-service-delivery", title: "Guide to Women in Mosque Management", image: "https://www.faithassociates.co.uk/wp-content/uploads/2017/12/Muslim-Women-Guide-.jpg", updated: "2026-06-22", summary: "A guide to women’s participation in mosque governance, management and excellent service delivery." },
  { slug: "implementing-sbd-in-existing-buildings", title: "Implementing SBD in Existing Buildings", image: "https://www.faithassociates.co.uk/wp-content/uploads/2022/09/Implementing-SBD-in-Existing-Buildings.png", updated: "2026-06-22" },
  { slug: "mosque-open-day-guide", title: "Mosque Open Day Guide", image: "https://www.faithassociates.co.uk/wp-content/uploads/2017/12/mosque_openday-fp1-675x958.jpg", updated: "2026-06-22", summary: "Practical guidance for mosques and Islamic centres opening their doors and strengthening relationships with the wider community." },
  { slug: "mosque-security-and-safety-tips", title: "Mosque Security and Safety Tips", image: "https://www.faithassociates.co.uk/wp-content/uploads/2017/12/Mosque-Safety-Tips-1.jpg", updated: "2026-06-22", summary: "Practical steps for management committees protecting mosque buildings, staff, volunteers and congregations." },
  { slug: "safety-checklist-for-madrassah-teachers", title: "Safety Checklist for Madrassah Teachers", image: "https://www.faithassociates.co.uk/wp-content/uploads/2017/12/Safety-Checklist-for-Madrassah-Teachers.jpg", updated: "2026-06-22" },
  { slug: "madrassah-management-and-safeguarding", title: "Madrassah Management and Safeguarding", image: "https://www.faithassociates.co.uk/wp-content/uploads/2017/12/0001.png", updated: "2026-06-22", summary: "A handbook covering governance, staffing, teaching, curriculum and child protection in madrassahs and supplementary schools." },
  { slug: "mosque-security-training-catalogue", title: "Mosque Security Training Catalogue", image: "https://www.faithassociates.co.uk/wp-content/uploads/2019/12/Digital-version-1-1_Page_1.jpg", updated: "2026-06-22" },
  { slug: "safeguarding-guide-2016", title: "Safeguarding Guide for Faith-Based Establishments", image: "https://www.faithassociates.co.uk/wp-content/uploads/2017/12/Safeguarding-Gudie.png", updated: "2026-06-22", summary: "Child protection and adult safeguarding guidance for mosques, madrassahs, churches, temples, synagogues and other faith institutions." },
  { slug: "mosque-management-toolkit", title: "Mosque Management Toolkit", image: "https://www.faithassociates.co.uk/wp-content/uploads/2017/12/Mosque-Management-Toolkit-FA-UK-1.jpg", updated: "2026-06-22", summary: "A pioneering management guide developed by Shaukat Warraich following extensive research and training with mosque leaders and volunteers." },
  { slug: "madrassah-safeguarding-card", title: "Madrassah Safeguarding Card", image: "https://www.faithassociates.co.uk/wp-content/uploads/2017/12/Madrassah-Safeguarding-Card-2014-Top-Page-001.jpg", updated: "2026-06-22" },
  { slug: "8th-british-beacon-mosque-awards-2025-booklet", title: "8th British Beacon Mosque Awards 2025 Booklet", image: "https://www.faithassociates.co.uk/wp-content/uploads/2026/01/WhatsApp-Image-2025-11-26-at-17.38.01-600x849-1.jpeg", updated: "2026-06-23" },
  { slug: "incident-management-guide-mosques", title: "Incident Management Guide – Mosques", image: "https://www.faithassociates.co.uk/wp-content/uploads/2022/09/Incident-Management-Guide.png", updated: "2026-06-23" },
];

const downloadUrls: Partial<Record<string, string>> = {
  "uel-certified-introduction-to-madrassah-teaching": "https://www.faithassociates.co.uk/wp-content/uploads/2018/03/uel-madrassah-teacher-brochure-1.pdf",
  "mosque-and-madrassah-quarterly-2016": "https://www.faithassociates.co.uk/wp-content/uploads/2018/03/mm-quarterly-2016-.pdf",
  "mosque-and-madrassah-quarterly-2014-i1-q1": "https://www.faithassociates.co.uk/wp-content/uploads/2018/03/mosque-and-madrassah-quarterly-2014_i1_q1.pdf",
  "mosque-and-madrassah-quarterly-ramadan-2015": "https://www.faithassociates.co.uk/wp-content/uploads/2018/03/mm-newsletter-web-final-2015-2.pdf",
  "mosque-and-madrassah-quarterly-issue-1-quarter-1-2013": "https://www.faithassociates.co.uk/wp-content/uploads/2018/03/famm-issue-1q1-final.pdf",
  "mosque-and-madrassah-quarterly-i1-q2": "https://www.faithassociates.co.uk/wp-content/uploads/2018/03/mm-quaterly-i1q2-final.pdf",
  "faith-associates-newsletter-2018": "https://www.faithassociates.co.uk/wp-content/uploads/2018/11/FA-Newsletter-2018-compressed.pdf",
  "muslim-digital-citizens-guide-animated-version": "https://www.faithassociates.co.uk/wp-content/uploads/2019/01/Muslim-Digital-Citizens-Guide-Animation-Version.pdf",
  "mosque-and-madrassah-quarterly-201780": "https://www.faithassociates.co.uk/wp-content/uploads/2018/03/mmq-2017-lo-res-web.pdf",
  "muslim-digital-safety-ambassadors-digital-citizens-2020-2021-impact-report": "https://www.faithassociates.co.uk/wp-content/uploads/2022/07/Muslim-Digital-Safety-Ambassadors-Digital-Citizens-2020-2021-Impact-Report.pdf",
  "4th-british-beacon-mosque-awards-2021-booklet": "https://www.faithassociates.co.uk/wp-content/uploads/2021/12/British-beacon-Mosque-Awards-2021.pdf",
  "disabled-access": "https://www.faithassociates.co.uk/wp-content/uploads/2021/10/Disability-and-Places-of-worship-N-C.pdf",
  "3rd-british-beacon-mosque-awards-2020-booklet": "https://www.faithassociates.co.uk/wp-content/uploads/2020/12/British-beacon-Mosque-Awards-2020-FINAL.pdf",
  "mosque-management-covid19-secure-advise-from-july-19th-2021": "https://www.faithassociates.co.uk/wp-content/uploads/2021/07/Mosque-Management-COVID19-Secure-Advise-From-19th-July-2021.pdf",
  "preparing-for-ramadan-2021-mosque-management-guidance": "https://www.faithassociates.co.uk/wp-content/uploads/2021/04/Ramadan-Preparation-2021-for-Mosque-Management.pdf",
  "england-lockdown-mosque-and-madrassah-management": "https://www.faithassociates.co.uk/wp-content/uploads/2020/11/Mosque-and-Madrassah-2nd-Lockdown-Management.pdf",
  "one-year-on-from-october-7th-incidents-against-mosques-muslim-institutions-in-the-uk": "https://www.faithassociates.co.uk/wp-content/uploads/2024/10/One-Year-on-from-October-7th-2023-Report-8-10-24-1.pdf",
  "incident-management-guide-2019": "https://www.faithassociates.co.uk/wp-content/uploads/2018/03/incident-management-guide-2016.pdf",
  "6th-british-beacon-mosque-awards-2023-booklet": "https://www.faithassociates.co.uk/wp-content/uploads/2023/12/British-Beacon-Mosque-Awards-2023-1.pdf",
  "5th-british-beacon-mosque-awards-2022-booklet": "https://www.faithassociates.co.uk/wp-content/uploads/2023/02/British-Beacon-Mosque-Awards-2022.pdf",
  "muslim-digital-safety-ambassadors-digital-citizens-2021-2022-impact-report": "https://www.faithassociates.co.uk/wp-content/uploads/2022/07/Muslim-Digital-Safety-Ambassadors-Digital-Citizens-2021-2022-Impact-Report.pdf",
  "mosque-advice-on-coronavirus": "https://www.faithassociates.co.uk/wp-content/uploads/2020/03/Mosque-CORONAVIRUS-ADVISE-FINAL-13-03-20-1-1.pdf",
  "mosque-itikaf-covid-19-safe-risk-assessment-checklist": "https://www.faithassociates.co.uk/wp-content/uploads/2021/05/2021-ITIKAF-Mosque-COVID-Safe-RA-Review-CFM-Self-Assessment.pdf",
  "10-security-tips-for-mosques-during-covid-19-lockdown": "https://www.faithassociates.co.uk/wp-content/uploads/2020/03/10-security-tips-for-Mosques-during-Coronavirus-Lockdown-Final.pdf",
  "mosque-covid-19-safety-poster-templates": "https://www.faithassociates.co.uk/wp-content/uploads/2020/06/FA-Mosque-COVID-19-POSTER-TEMPLATE.pdf",
  "covid-19-risk-assessment-keeping-our-mosques-safe": "https://www.faithassociates.co.uk/wp-content/uploads/2021/05/Step-3-17th-May-2021-Opening-Guidance-for-Mosques-and-Madrassahs-UK.pdf",
  "positive-covid-19-test-mosque-notification-checklist": "https://www.faithassociates.co.uk/wp-content/uploads/2020/08/Mosque-action-checklist-if-someone-tests-positive-for-COVID-19.pdf",
  "7th-british-beacon-mosque-awards-2024-booklet": "https://www.faithassociates.co.uk/wp-content/uploads/2024/12/Booklet-British-Beacon-Mosque-Awards-2024.pdf",
  "faith-associates-2024-activity-report": "https://www.faithassociates.co.uk/wp-content/uploads/2024/12/Faith-Associates-2024-Report-1.pdf",
  "hate-harassement-extremism-in-video-games": "https://www.faithassociates.co.uk/wp-content/uploads/2024/01/Hate-Harassament-Extremism-in-Video-Games.pdf",
  "muslim-digital-citizens-guide": "https://www.faithassociates.co.uk/wp-content/uploads/2019/01/Muslim-Digital-Citizens-Guide-Final-Version.pdf",
  "covid-19-balancing-the-mosque-finances-during-covid-19-lockdown": "https://www.faithassociates.co.uk/wp-content/uploads/2020/05/Mosque-Balance-Finance-May-2020-1.pdf",
  "keeping-muslims-safe-online": "https://www.faithassociates.co.uk/wp-content/uploads/2018/03/keeping-muslims-safe-online-nov-2017-compressed.pdf",
  "protect-duty-presentation": "https://www.faithassociates.co.uk/wp-content/uploads/2023/06/Protect-Duty-and-Martyns-Law-Is-Your-Mosque-Ready.pdf",
  "beacon-mosque-vision-2020-2050": "https://www.faithassociates.co.uk/wp-content/uploads/2023/02/Beacon-Mosque-Vision-2020-2050.pdf",
  "muslim-womens-guide-to-mosque-governance-management-and-service-delivery": "https://www.faithassociates.co.uk/wp-content/uploads/2018/03/women-in-mosque-management-and-service-deliver-2016.pdf",
  "implementing-sbd-in-existing-buildings": "https://www.faithassociates.co.uk/wp-content/uploads/2022/09/SOAR-Format-Scoping-Paper-3-V1.pdf",
  "mosque-open-day-guide": "https://www.faithassociates.co.uk/wp-content/uploads/2018/03/mosque_open_day_guide-final.pdf",
  "mosque-security-and-safety-tips": "https://www.faithassociates.co.uk/wp-content/uploads/2018/03/Mosque-Madrassah-Security-and-Safety-Tips-1.pdf",
  "madrassah-management-and-safeguarding": "https://www.faithassociates.co.uk/wp-content/uploads/2018/03/faith-associates-madrassah-management-and-safeguarding-2012.pdf",
  "mosque-security-training-catalogue": "https://www.faithassociates.co.uk/wp-content/uploads/2019/12/Mosque-Security-Training-Catalogue.pdf",
  "safeguarding-guide-2016": "https://www.faithassociates.co.uk/wp-content/uploads/2018/03/faith-establishment-safeguarding-guide-jan-2016.pdf",
  "mosque-management-toolkit": "https://www.faithassociates.co.uk/wp-content/uploads/2018/03/faith-associates-mosque-management-toolkit-fa-uk.pdf",
  "madrassah-safeguarding-card": "https://www.faithassociates.co.uk/wp-content/uploads/2018/03/sg-fa-1-2014l.pdf",
  "8th-british-beacon-mosque-awards-2025-booklet": "https://www.faithassociates.co.uk/wp-content/uploads/2026/01/Booklet-British-Beacon-Mosque-Awards-2025a-1.pdf",
  "incident-management-guide-mosques": "https://www.faithassociates.co.uk/wp-content/uploads/2022/09/Incident-Management-Guide.pdf",
};

const zohoFormUrls: Partial<Record<string, string>> = {
  "incident-management-guide-2019":
    "https://forms.zohopublic.eu/info157/form/IncidentManagementGuide/formperma/pQ8AdYJbVxZZgrB2rXuTm4Ze_n75KSEbuYr2o2tgcbc",
  "covid-19-risk-assessment-keeping-our-mosques-safe":
    "https://forms.zohopublic.eu/info157/form/OrderForm/formperma/VNfwTKseXPdj10-i0H2GrEfIHUE4_IjKKcZr_4lEgiU",
  "4th-british-beacon-mosque-awards-2021-booklet":
    "https://forms.zohopublic.eu/info157/form/BeaconMosque2021/formperma/wTPLfSLWGi8ZCj8rLthQ0Z-aCcADP6aiPWIjU4J1OxY",
  "5th-british-beacon-mosque-awards-2022-booklet": "https://zfrmz.eu/hYXLZvI1yr9SieYzwDVo",
  "6th-british-beacon-mosque-awards-2023-booklet": "https://zfrmz.eu/BA0489d0pQEkNzbawEwd",
  "8th-british-beacon-mosque-awards-2025-booklet":
    "https://forms.zohopublic.eu/info157/form/8thBritishBeaconMosqueAwards2025Booklet/formperma/nsX58N4fdTKHvVmKkD8mLNRHHh6nRE6-gd2tSlLmAZM",
  zakat:
    "https://forms.zohopublic.eu/info157/form/MosqueCollectingandDistributingZakatLocally/formperma/pbew8Vww4yzUSAZAgCTUL7MNYFEGgcDEw2Jsu8BHkJA",
  "beacon-mosque-vision-2020-2050":
    "https://forms.zohopublic.eu/info157/form/BeaconMosqueVision20202050/formperma/Pus66bYSvKCcvnbE7WqLzaE-d-wduR2jHdA4XiRlOYg",
  "madrassah-management-and-safeguarding":
    "https://forms.zohopublic.eu/info157/form/MadrassahManagementSafeguarding/formperma/bq6eymaTlldgnAEcS9IoczWnBkR1_Pp-c9fp8Wha3KA",
};

function getCategory(item: PublicationSource): PublicationCategory {
  const value = `${item.slug} ${item.title}`.toLowerCase();

  if (/covid|coronavirus|lockdown|omicron|outbreak|positive test|ramadan 2021|i’tikaf|itikaf/.test(value)) {
    return "Legacy guidance";
  }
  if (/safeguard|digital|online|women|disabled access|madrassah teacher|video games/.test(value)) {
    return "Safeguarding & inclusion";
  }
  if (/security|incident|protect duty|sbd|risk assessment/.test(value)) {
    return "Security & resilience";
  }
  if (/management|beacon|zakat|open day/.test(value)) {
    return "Governance & standards";
  }
  return "Reports & insight";
}

function getFormat(item: PublicationSource): Publication["format"] {
  const value = item.title.toLowerCase();
  if (value.includes("booklet")) return "Booklet";
  if (value.includes("report")) return "Report";
  if (value.includes("newsletter") || value.includes("quarterly")) return "Newsletter";
  if (value.includes("guide") || value.includes("toolkit") || value.includes("checklist")) return "Guide";
  return "Resource";
}

function getYear(item: PublicationSource) {
  const years = item.title.match(/20\d{2}/g);
  const plausiblePublicationYears = years?.filter((year) => Number(year) <= 2026);
  const uploadYear = item.image.match(/\/uploads\/(20\d{2})\//)?.[1];
  return plausiblePublicationYears?.at(-1) ?? uploadYear ?? item.updated.slice(0, 4);
}

function getFallbackSummary(category: PublicationCategory, title: string) {
  const summaries: Record<PublicationCategory, string> = {
    "Governance & standards": "Practical guidance from Faith Associates to help mosque and faith institution leaders strengthen governance, standards and community service.",
    "Security & resilience": "A practical Faith Associates resource supporting safer, better-prepared places of worship and community institutions.",
    "Safeguarding & inclusion": "Guidance designed to help faith institutions protect people, widen participation and create safer, more inclusive services.",
    "Reports & insight": "A record of Faith Associates learning, programmes and sector insight for faith institution leaders and partners.",
    "Legacy guidance": "Archived operational guidance retained for reference. Check current public-health and legal requirements before using it.",
  };

  return `${summaries[category]} ${title.includes("Quarterly") ? "This issue captures the priorities and activity of its period." : ""}`.trim();
}

export const publications: Publication[] = publicationSources
  .map((item) => {
    const category = getCategory(item);
    return {
      ...item,
      category,
      format: getFormat(item),
      year: getYear(item),
      isLegacy: category === "Legacy guidance",
      downloadUrl: downloadUrls[item.slug],
      zohoFormUrl: zohoFormUrls[item.slug],
      summary: item.summary || getFallbackSummary(category, item.title),
      legacyNoticeTitle: "Archived operational guidance.",
      legacyNoticeBody:
        "This resource is preserved for historical reference and may not reflect current public-health, legal or regulatory requirements.",
      accessEyebrow: "Access the resource",
      downloadCtaLabel: "Download publication",
      requestCtaLabel: "Request this publication",
      publishedBy: "Published by Faith Associates",
      resourceTypeLabel: "Resource type",
      catalogueYearLabel: "Catalogue year",
      overviewEyebrow: "Overview",
      overviewTitle: "Guidance grounded in sector experience.",
      overviewBody:
        "Faith Associates develops publications from direct work with faith institutions, leadership teams and delivery partners. The aim is to turn field learning into practical material that can inform discussion, planning and implementation.",
      requestEyebrow: "Request this publication",
      requestTitle: "Complete the form below.",
      requestBody:
        "Register your details to receive this publication from Faith Associates.",
      usageEyebrow: "Using this publication",
      usageSteps: [
        "Review the resource with the people responsible for governance or delivery in your institution.",
        "Adapt recommendations to your context, legal duties, risk profile and available capacity.",
        "Turn agreed actions into named responsibilities, timescales and a clear review point.",
      ],
      implementationTitle: "Need help implementing it?",
      implementationBody:
        "The Faith Associates team can support training, review, policy development and implementation linked to this area of work.",
      implementationCtaLabel: "Talk to the team",
      relatedEyebrow: "Continue reading",
      relatedTitle: "Related publications",
      relatedCtaLabel: "View library",
    };
  })
  .sort((a, b) => b.updated.localeCompare(a.updated));

export const publicationCategories: Array<"All" | PublicationCategory> = [
  "All",
  "Governance & standards",
  "Security & resilience",
  "Safeguarding & inclusion",
  "Reports & insight",
  "Legacy guidance",
];

export function getPublication(slug: string) {
  return publications.find((publication) => publication.slug === slug);
}
