// Sanity-derived types used by the Next.js frontend.

export interface SanityImage {
  _type: 'image';
  asset: { _ref: string };
}

export interface SiteSettings {
  title?: string;
  tagline?: string;
  footerDescription?: string;
  contact?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  social?: {
    instagram?: string;
    behance?: string;
    youtube?: string;
    linkedin?: string;
  };
  sectionVisibility?: {
    ticker?: boolean;
    services?: boolean;
    portfolio?: boolean;
    beforeAfter?: boolean;
    process?: boolean;
    pricing?: boolean;
    testimonials?: boolean;
    finalCta?: boolean;
  };
  hero?: {
    eyebrow?: string;
    headlineLine1?: string;
    headlineHighlight?: string;
    headlineLine2?: string;
    subtitle?: string;
    image1?: SanityImage;
    image2?: SanityImage;
    featuredProjectName?: string;
    featuredProjectMeta?: string;
    stats?: { label: string; value: string }[];
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: SanityImage;
  };
}

export interface Service {
  _id: string;
  order: number;
  number: string;
  title: string;
  description: string;
  tag: string;
}

export interface ProcessStep {
  _id: string;
  order: number;
  number: string;
  title: string;
  description: string;
  time: string;
}

export interface PricingTier {
  _id: string;
  order: number;
  name: string;
  tag: string;
  priceType: 'fixed' | 'custom';
  price: string;
  currency?: string;
  period?: string;
  features: string[];
  featured?: boolean;
  ctaLabel: string;
}

export interface Testimonial {
  _id: string;
  quote: string;
  name: string;
  role: string;
  initial: string;
  avatar?: SanityImage;
  rating?: number;
  order: number;
}

export interface TickerItem {
  _id: string;
  text: string;
  order: number;
}

export interface BeforeAfterPair {
  _id: string;
  label: string;
  before: SanityImage;
  after: SanityImage;
  order: number;
}

export interface PortfolioProject {
  _id: string;
  name: string;
  slug: { current: string };
  location: string;
  category?: { name: string; slug: { current: string } };
  year: string;
  mainImage: SanityImage;
  gallery?: SanityImage[];
  kind: 'tall' | 'wide' | 'sq';
  span: number;
  featuredOnHome?: boolean;
  homeOrder?: number;
}

export interface HomePageData {
  settings: SiteSettings;
  ticker: TickerItem[];
  services: Service[];
  processSteps: ProcessStep[];
  pricingTiers: PricingTier[];
  testimonials: Testimonial[];
  beforeAfter: BeforeAfterPair[];
  homeProjects: PortfolioProject[];
}

export interface Author {
  _id?: string;
  name: string;
  role?: string;
  initial?: string;
  avatar?: SanityImage;
}

export interface BlogCategory {
  _id?: string;
  name: string;
  slug: { current: string };
}

export interface PortableTextBlock {
  _type: string;
  _key?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  category?: BlogCategory;
  publishedAt: string;
  readTime?: string;
  cover: SanityImage;
  author?: Author;
  tags?: string[];
  body?: PortableTextBlock[];
}

export interface BlogListData {
  posts: BlogPost[];
  categories: BlogCategory[];
  settings: SiteSettings;
}

export interface PortfolioCategory {
  _id?: string;
  name: string;
  slug: { current: string };
}

export interface PortfolioPageData {
  projects: PortfolioProject[];
  categories: PortfolioCategory[];
  settings: SiteSettings;
}
