import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "faithassociates.co.uk",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.faithassociates.co.uk",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "ihfuankbsfpibldanznw.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/login", destination: "/cms", permanent: false },
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/about-us/company-history", destination: "/about/history", permanent: true },
      { source: "/about-us/our-clients", destination: "/about/clients", permanent: true },
      { source: "/about-us/our-team", destination: "/about/team", permanent: true },
      { source: "/about-us/our-approach", destination: "/about/approach", permanent: true },
      { source: "/about-us/careers", destination: "/about/careers", permanent: true },
      { source: "/about-us/vacancies", destination: "/about/vacancies", permanent: true },
      { source: "/careers", destination: "/about/careers", permanent: true },
      { source: "/vacancies", destination: "/about/vacancies", permanent: true },

      { source: "/mosque-services", destination: "/services/mosque-services", permanent: true },
      { source: "/madrassah-services", destination: "/services/madrassah-support", permanent: true },
      { source: "/imam-services", destination: "/services/imam-services", permanent: true },
      { source: "/strategic-services", destination: "/services/strategic-services", permanent: true },
      { source: "/safeguarding-services", destination: "/services/safeguarding", permanent: true },
      { source: "/safety", destination: "/services/safety", permanent: true },
      { source: "/mosque-security-risk-assessment", destination: "/services/mosque-security-risk-assessment", permanent: true },
      { source: "/mosque-policy-and-procedure-development", destination: "/services/mosque-policy-and-procedure-development", permanent: true },
      { source: "/mosque-election-management", destination: "/services/mosque-election-management", permanent: true },

      { source: "/strategic-projects", destination: "/projects", permanent: true },
      { source: "/mosque-expo", destination: "/projects/mosque-expo", permanent: true },
      { source: "/british-beacon-mosque-awards", destination: "/projects/british-beacon-mosque-awards", permanent: true },
      { source: "/faith-associates-academy", destination: "/projects/faith-associates-academy", permanent: true },
      { source: "/mosque-security", destination: "/projects/mosque-security", permanent: true },
      { source: "/security-of-faith-institutions", destination: "/projects/mosque-security", permanent: true },
      { source: "/eco-mosque", destination: "/projects/eco-mosque", permanent: true },
      { source: "/fattahcup", destination: "/projects/fattah-cup", permanent: true },
      { source: "/emancup2024", destination: "/projects/eman-cup", permanent: true },
      { source: "/mosque-support-helpline", destination: "/projects/mosque-support-helpline", permanent: true },
      { source: "/imams-online", destination: "/projects/imams-online", permanent: true },

      { source: "/football", destination: "/sport", permanent: true },
      { source: "/cricket", destination: "/sport", permanent: true },
      { source: "/wildcats", destination: "/sport", permanent: true },
      { source: "/nikehijab", destination: "/sport", permanent: true },
      { source: "/national-cricket-activator-programme", destination: "/sport", permanent: true },
      { source: "/africa", destination: "/international", permanent: true },

      { source: "/blog", destination: "/news", permanent: true },
      { source: "/events-grid", destination: "/events", permanent: true },
      { source: "/events-modern", destination: "/events", permanent: true },
      {
        source: "/portfolio/national-emergency-conference-uk-mosque-safety-and-security",
        destination: "/events/national-emergency-conference-uk-mosque-safety-and-security",
        permanent: true,
      },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
    ];
  },
};

export default nextConfig;
