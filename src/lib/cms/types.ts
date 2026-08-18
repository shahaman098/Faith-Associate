export type CmsStatus = "draft" | "published";

export type NavChild = [string, string];

export type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
};

export type SocialLink = { label: string; href: string };

export type SiteSettingsData = {
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: { url: string; width: number; height: number; alt: string };
  };
  contact: {
    addressLines: string[];
    phoneDisplay: string;
    phoneTel: string;
    email: string;
    hours: string;
  };
  header: {
    tagline: string;
    phone: string;
    navigation: NavItem[];
    social: SocialLink[];
  };
  footer: {
    blurb: string;
    social: SocialLink[];
    groups: { title: string; links: NavChild[] }[];
    ctaLabel: string;
    ctaHref: string;
    copyright: string;
    email: string;
    phone: string;
  };
};

export type HomeBlocks = {
  hero: {
    video: string;
    poster: string;
    posterPosition?: string;
    messages: {
      eyebrow: string;
      title: string;
      body: string;
      ctaLabel: string;
      href: string;
    }[];
    stories: { label: string; href: string; active?: boolean }[];
  };
  whatWeDo: {
    title: string;
    body: string;
    capabilities: { title: string; body: string; icon: string }[];
  };
  guidedSupport: {
    image: string;
    imagePosition?: string;
    title: string;
    body: string;
    topics: {
      label: string;
      /** Primary destination. Guided support links straight through — no refine step. */
      href?: string;
      summary?: string;
      icon?: string;
      /** Secondary routes in the same family, rendered as direct links on the card. */
      destinations: { label: string; href: string }[];
    }[];
  };
  whoWeAre: {
    eyebrow: string;
    title: string;
    body: string[];
    image: string;
    imagePosition?: string;
    imageAlt: string;
    ctaLabel: string;
    ctaHref: string;
    statValue: string;
    statLabel: string;
    statSublabel: string;
    /** Proof row. Falls back to the single statValue/statLabel pair when absent. */
    stats?: { value: string; label: string }[];
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
    slides: { title: string; body: string }[];
  };
  servicesCarousel: {
    eyebrow: string;
    title: string;
    body: string;
    items: { title: string; image: string; imagePosition?: string; href: string; icon: string }[];
  };
  newsCarousel: {
    eyebrow: string;
    title: string;
    items: { title: string; image: string; imagePosition?: string; meta: string; href: string }[];
  };
  featuredPublications: {
    eyebrow: string;
    title: string;
    tabs: { id: string; label: string }[];
      items: {
      id: string;
      category: string;
      type: string;
      date: string;
      title: string;
      image: string;
      imagePosition?: string;
      href: string;
    }[];
  };
  contactTeaser: {
    eyebrow: string;
    title: string;
    body: string;
    addressLines: string[];
    phoneDisplay: string;
    phoneTel: string;
    phoneNote: string;
  };
};

export type PageRecord = {
  path: string;
  title?: string;
  blocks: Record<string, unknown>;
  draft_blocks?: Record<string, unknown> | null;
  status: CmsStatus;
};

export type EntryRecord = {
  type: string;
  slug: string;
  data: Record<string, unknown>;
  draft_data?: Record<string, unknown> | null;
  sort_order: number;
  status: CmsStatus;
};

export type SeedPayload = {
  settings: SiteSettingsData;
  pages: PageRecord[];
  entries: EntryRecord[];
};

export type EditorProfile = {
  userId: string;
  role: "editor" | "admin";
  displayName?: string | null;
  email?: string | null;
};
