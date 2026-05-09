import type { Metadata } from 'next';
import { client } from '@/sanity/lib/client';
import { siteSettingsQuery } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import type { SiteSettings } from '@/types/sanity';
import './globals.css';
import './subpages.css';

const FALLBACK_TITLE = 'Fotograf — Emlak fotoğrafçılığı stüdyosu';
const FALLBACK_DESCRIPTION =
  'Profesyonel emlak fotoğrafçılığı, drone, sanal tur ve cinematic video.';

export async function generateMetadata(): Promise<Metadata> {
  let settings: SiteSettings | null = null;
  try {
    settings = await client.fetch<SiteSettings | null>(siteSettingsQuery);
  } catch {
    // Sanity may be unconfigured during early dev — fall back to defaults.
    settings = null;
  }

  const title =
    settings?.seo?.metaTitle || settings?.title || FALLBACK_TITLE;
  const description =
    settings?.seo?.metaDescription || settings?.tagline || FALLBACK_DESCRIPTION;

  const ogImageRef = settings?.seo?.ogImage;
  let ogImageUrl: string | undefined;
  if (ogImageRef) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ogImageUrl = urlFor(ogImageRef as any).width(1200).height(630).url();
    } catch {
      ogImageUrl = undefined;
    }
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(ogImageUrl
        ? { images: [{ url: ogImageUrl, width: 1200, height: 630 }] }
        : {}),
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
