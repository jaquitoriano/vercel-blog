import { Metadata, ResolvingMetadata } from 'next';
import { settingsRepository } from '@/lib/repositories/settings.repository';

type Props = {
  params: { [key: string]: string };
};

/**
 * Generate dynamic metadata based on site settings
 */
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  type SiteSettings = {
    meta_title?: string;
    site_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    og_image?: string;
    twitter_handle?: string;
    site_favicon?: string;
  };

  // Get settings from cache with fallback to database
  let settings: SiteSettings = {};
  try {
    const { getMetadataWithCache } = await import('@/lib/cache/metadata-cache');
    const metadata = await getMetadataWithCache();
    if (metadata && typeof metadata === 'object') {
      settings = metadata as SiteSettings;
    }
  } catch (error) {
    console.error('Failed to load settings for metadata:', error);
    // Continue with empty settings - we'll use fallbacks
  }
  
  // Fallback to parent metadata if available
  const parentMetadata = await parent;
  
  // Get base URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vercel-blog-template.vercel.app';
  
  // Get the current path from params and build the canonical URL
  const pathname = Object.values(params).join('/');
  const canonicalUrl = new URL(pathname, baseUrl).toString();
  
  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: settings.meta_title || parentMetadata.title?.absolute || 'Ikira',
      template: `%s | ${settings.site_title || 'Ikira'}`
    },
    description: settings.meta_description || parentMetadata.description || 'A modern Ikira built with Next.js',
    keywords: settings.meta_keywords || undefined,
    openGraph: {
      title: settings.meta_title || parentMetadata.openGraph?.title || 'Ikira',
      description: settings.meta_description || parentMetadata.openGraph?.description || 'A modern Ikira built with Next.js',
      url: baseUrl,
      siteName: settings.site_title || 'Ikira',
      locale: 'en_US',
      type: 'website',
      images: settings.og_image 
        ? [{ url: settings.og_image, width: 1200, height: 630, alt: settings.site_title || 'Blog' }] 
        : parentMetadata.openGraph?.images,
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.meta_title || parentMetadata.twitter?.title || 'Ikira',
      description: settings.meta_description || parentMetadata.twitter?.description || 'A modern Ikira built with Next.js',
      images: settings.og_image ? [settings.og_image] : parentMetadata.twitter?.images,
      creator: settings.twitter_handle || undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
    // Add canonical URL
    alternates: {
      canonical: canonicalUrl,
    },
    // Provide icons so Next and browsers know where to find favicons.
    // Use `site_favicon` from settings when available
    icons: (() => {
      const rawFavicon = settings.site_favicon || '/images/fallbacks/favicon.svg';
      
      // If user provided a relative path without leading slash, normalize it
      const favicon = rawFavicon.startsWith('/') || rawFavicon.startsWith('http')
        ? rawFavicon
        : `/${rawFavicon}`;

      // Provide multiple sizes for better device support
      return {
        icon: [
          { url: favicon, sizes: '32x32' },
          { url: favicon, sizes: '192x192' },
          { url: favicon, sizes: '512x512' },
        ],
        shortcut: favicon,
        apple: [
          { url: favicon, sizes: '180x180' },
        ],
      };
    })(),
    manifest: "/manifest.json",
    // Automatically update manifest.json icons with current favicon
    other: {
      'msapplication-TileImage': settings.site_favicon || '/favicon.svg',
      'msapplication-TileColor': '#2563EB',
    },
  };
}