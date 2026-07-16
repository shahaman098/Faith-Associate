# Faith Associates Website Content Inventory

Source checked: local WordPress backup running at `http://127.0.0.1:8080/`

Last reviewed: 2026-07-14

## Migration Principle

The new site should not start from Bain, BCG, or Herrington content. Those sites are references for quality, information architecture, and interaction polish. The content source of truth is the existing Faith Associates WordPress site.

The new site should preserve Faith Associates' real services, projects, publications, news archive, sector focus, and credibility proof, then reorganise them into a modern consulting-style structure.

## Current Brand Positioning

- Page title: `Faith Associates | Building Standards Across The Globe`
- Meta description: `Faith Associates are a global consultancy empowering communities, building standards and protecting places of worship across the world.`
- Site description from WordPress: `Faith Associates - Global Leaders in Mosque Madrassah development`
- Homepage anniversary message: `Faith Associates (2005-2025) Serving for 20 Years`
- Existing about copy says Faith Associates was set up in 2004 as a non-theological consultancy for ethnic minority faith-based communities.

Recommended new positioning:

- `Building standards, resilience, and leadership across faith institutions.`
- Keep the 20-year credibility theme, but reconcile 2004 setup date versus 2005-2025 anniversary wording before launch.

## Existing Primary Navigation

Current WordPress navigation extracted from the local homepage:

- Home
- About Us
- Strategic Projects
- Careers
- Vacancies
- Organisation history
- Our clients
- Our team
- Privacy Policy
- Services
- Safety
- What We Do
- Mosque Services
- Madrassah Support
- Imam Services
- Strategic Services
- Safeguarding Services
- Events
- Sports
- International
- Publications
- News
- Contact Us

Recommended new top-level navigation:

- About
- Services
- Projects
- Sport
- International
- Publications
- News
- Contact

Recommended dropdowns:

- About: Organisation History, Clients, Team, Careers, Vacancies
- Services: Mosque Services, Madrassah Support, Imam Services, Strategic Services, Safeguarding Services, Safety
- Projects: Mosque Expo, British Beacon Mosque Awards, Mosque MBA, Mosque Security, Eco Mosque, Fattah Cup, Eman Cup

## Homepage Content To Preserve

### Hero / Slider Themes

Existing slider messages:

- `Faith Associates (2005-2025) Serving for 20 Years`
- `Fattah Cup - Launch London Inter-Madrassah Football Tournament`
- `Launching the Eman Cup in partnership with England and Wales Cricket Board`
- `Developing European Empowerment Networks`
- `Sport and Faith`
- `The Mosque Expo Project`
- `Bespoke Training To Improve Standards`
- `Mosque Management Development Internationally`
- `Toolkits For Mosque And Madrassah Leaders`
- `British Beacon Mosque Awards`

New homepage should not use a dated rotating slider. It should turn these into a strong editorial hero plus featured initiative rail.

### Three Lead Service Pillars

Current homepage lead pillars:

- `Development of International Networks`
  Developing and maintaining national and international networks of leadership from different sectors, expertise and countries to empower communities.
- `Securing at-Risk Religious Sites`
  Providing expert training, advice and delivery to ensure the protection of places of worship from increased attacks and threats in partnership with governments and international organisations.
- `Inclusivity in Sport`
  Working in partnership with national and international sporting bodies to take recreational activities to faith institutions and communities.

Recommended new treatment:

- Use these as first visible proof/service pillars under the hero.
- Link them to International, Safety/Mosque Security, and Sport respectively.

### Striving For Excellence Initiatives

Current homepage featured initiatives:

- `Mosque Expo 2026` -> `https://mosqueexpo.com`
- `British Beacon Mosque Awards 2026` -> `https://beaconmosque.com`
- `Faith Institution Leadership Development - MBA` -> `https://mosque.mba/`

Recommended new treatment:

- Present as flagship programmes with clear description, audience, and CTA.
- Use real WordPress media assets for launch if possible.

### Recent Projects

Current homepage recent projects:

- `Mosque Support Helpline`
- `Mosque Security`
- `Mosque, Islamic Centres & Madrassahs Security and Safety Tips`
- `The Fattah Cup 2024 - FIFA Forward Inter-Madrassah Tournament`
- `ECB Inter-Madrasah Cricket Tournament`
- `10 Security Tips for Mosques in Preparation for Ramadan`
- `20 Security Tips`
- `Incident Management Guide`

Recommended new treatment:

- Split into project cards and resource cards.
- Priority project cards: Mosque Security, Fattah Cup, Eman Cup, Mosque Support Helpline.
- Priority resource cards: 10 Security Tips, 20 Security Tips, Incident Management Guide.

### Key Strategic Services

Current homepage service cards:

- `Inclusivity in Sports`
- `Security in Places of Worship`
- `Strategic Leadership Development` / Faith Associates Academy
- `Environmental Practices in Places of Worship`

Recommended new treatment:

- Keep as service rows or large editorial tiles.
- Do not hide these under generic `consulting services`; these are distinctive Faith Associates offers.

### About / Credibility

Current homepage about text:

`Faith Associates was set up in 2004 as a non-theological consultancy to meet the needs of ethnic minority faith-based communities. We work in a culturally sensitive, multidisciplinary way to provide research, training, advice and guidance to influence the challenges faced by communities. A key area of focus is developing institutional governance, improving strategic choices and developing effective communication strategies.`

Current homepage counters:

- `5000+` mosques on three continents
- `3467+` madrassahs on three continents
- The screenshot appears to show `20000k` people trained. This should be confirmed before reuse; likely intended as `20,000+`.

Recommended new treatment:

- Preserve this copy but rewrite lightly for clarity.
- Confirm metrics before publishing.

### Standards / Associated Platforms

Current homepage section:

- `Faith Associates: Uniting Community, Mosque, and Educational Standards`
- Logo/platform set includes:
- Mosque & Madrassah Safeguarding
- Mosque Support Helpline
- Madrassah.co.uk
- Imams Online
- Beacon Mosque Standards

Recommended new treatment:

- Use as a `Platforms and standards` section.
- Each logo/platform should link to the relevant project or external site.

### CTA

Current CTA:

- `We look forward to helping improve your Faith institutions`
- `Anywhere in the world.`
- `Get a quote`

Recommended new CTA:

- Replace `Get a quote` with `Start a conversation` or `Contact the team`.
- Embed Zoho Forms for enquiry/contact rather than rebuilding forms.

### International

Current homepage international cards:

- `MEET 2024 Conference Held in Kristiansand`
- `Faith Associates working towards United Nations Sustainable Goals`
- `Reflections of our work in 2019`
- `Faith Associates invited across Europe to talk about Mosque Security`

Recommended new treatment:

- Make International a top-level content area with a stronger map/timeline feel.
- Keep MEET and European Mosque Security as proof points.

### Testimonial

Current homepage testimonial:

Source: Mevlana Rumi Mosque, Manager of Mosque

Quote starts:

`I offer my gratitude to Faith Associates for their tireless but steadfast work and their continuous support and cooperation. The Beacon Mosque Project was a team effort...`

Recommended new treatment:

- Keep testimonial but edit only with permission if needed.
- Add case-study context around Beacon Mosque standard.

### Featured Publications

Current homepage visible publications:

- `Mosque Collecting and Distributing Zakat Locally`
- `Beacon Mosque Vision 2020-2050`
- `8th British Beacon Mosque Awards 2025 Booklet`
- `Faith Associates 2024 Activity Report`

The Publications page uses a Visual Composer masonry grid. Standard REST does not expose a dedicated `publications` post type in the checked endpoint, so publication content may be stored through theme/plugin data or regular posts/media. Needs deeper extraction from database/files before final migration.

### Latest News

Current homepage latest news:

- `Announcement: Mosque Expo 2026 returns, uniting leaders and innovators.` dated May 7, 2026
- `Strengthening Mosque Resilience: Birmingham Chapter event at Aston University` dated June 2, 2025
- `Faith Associates Deliver Eco-Mosque Net Zero Conference for Mosque Leadership` dated April 22, 2025
- `1000 Attendees Attend Mosque Expo & 7th Beacon Mosque Awards 2024` dated December 2, 2024

Recommended new treatment:

- Keep a `Latest thinking and news` section, but separate news, press releases, events, and publications in the content model.

### Footer

Current footer:

- Follow Us
- Mosque Expo
- Mosque MBA
- Get in touch
- Social links: Facebook, X/Twitter, LinkedIn, Instagram
- Contact CTA: `Contact Us`
- Copyright: `Copyright 2026 Faith Associates. All rights reserved`

Recommended new footer:

- Keep social links and programme links.
- Add core service links and legal links.
- Add Zoho/contact CTA.

## Current WordPress Content Types

REST-exposed types:

- Posts
- Pages
- Media
- Navigation menu items (requires auth to view via REST)
- Contact Forms
- Events (`tribe_events`)
- Venues
- Organisers
- MapGeo
- Popup Builder
- Calendar Embeds

Current categories include:

- Blog: 206 items
- News: 156 items
- Event: 64 items
- Leadership: 27 items
- Publication: 21 items
- Charity: 52 items
- Press Release: 17 items
- Case Study: 14 items
- New Case Study: 10 items
- Safeguarding: multiple category variants
- Security
- Management
- Sustainability
- Environment
- International / Mosque Security EU

Recommended Sanity schemas:

- `page`
- `service`
- `project`
- `programme`
- `caseStudy`
- `publication`
- `post`
- `event`
- `person`
- `platform`
- `testimonial`
- `redirect`
- `zohoFormEmbed`

## Priority Pages For Launch

Must build first:

- Home
- About
- Services overview
- Mosque Services
- Madrassah Support
- Imam Services
- Strategic Services
- Safeguarding Services
- Safety / Security of Faith Institutions
- Sport / Inclusivity in Sport
- International
- Publications
- News
- Contact

High-priority project pages:

- Strategic Projects
- Mosque Expo
- British Beacon Mosque Awards
- Mosque MBA / Faith Associates Academy
- Mosque Security
- Fattah Cup
- Eman Cup
- Eco Mosque / Environmental Practices
- Mosque Support Helpline

Archive/migrate carefully:

- COVID-19 risk assessment pages
- Historical press releases
- Old event pages
- Old test/layout pages
- WooCommerce shop/cart/checkout/account pages if no longer needed

## Redirect Notes

Keep these existing slugs or redirect them:

- `/about-us/` -> `/about/`
- `/about-us/company-history/` -> `/about/history/`
- `/about-us/our-clients/` -> `/about/clients/`
- `/about-us/our-team/` -> `/about/team/`
- `/mosque-services/` -> `/services/mosque-services/`
- `/madrassah-services/` -> `/services/madrassah-support/`
- `/imam-services/` -> `/services/imam-services/`
- `/strategic-services/` -> `/services/strategic-services/`
- `/safeguarding-services/` -> `/services/safeguarding/`
- `/safety/` -> `/services/safety/`
- `/sport/` -> `/sport/`
- `/international/` -> `/international/`
- `/publications/` -> `/publications/`
- `/blog/` -> `/news/`
- `/contact-us/` -> `/contact/`
- `/fattahcup/` -> `/projects/fattah-cup/`
- `/emancup2024/` -> `/projects/eman-cup/`
- `/faith-associates-academy/` -> `/projects/faith-associates-academy/`
- `/security-of-faith-institutions/` -> `/projects/mosque-security/`

## Open Content Questions

- Confirm official founding year: 2004 in About copy versus 2005-2025 anniversary message.
- Confirm the people trained metric: old screenshot appears to show `20000k`, likely intended as `20,000+`.
- Confirm whether old WooCommerce pages should be retired.
- Confirm whether all historical posts should migrate or whether only 2018+ / selected content should launch first.
- Confirm final Zoho Forms embed URLs for contact, newsletter, event registration, and programme enquiries.
- Confirm whether external programme domains remain separate: `mosqueexpo.com`, `beaconmosque.com`, `mosque.mba`, `mosquesecurity.com`, `ecomosque.com`, `meetprogramme.eu`.

