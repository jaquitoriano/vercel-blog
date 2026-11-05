import { Metadata } from 'next';
import { settingsRepository } from '@/lib/repositories/settings.repository';
import { getRobotsMeta } from './robots';

type MetadataInput = {
  title: string;
  description: string;
  /** Path of this page, used for its canonical URL and og:url. Omit on pages that shouldn't be indexed. */
  path?: string;
  /** Site-level page: keeps the site title suffix and falls back to the site's sharing image. */
  isListing?: boolean;
  image?: string;
  isAdminPage?: boolean;
  isPreview?: boolean;
  isDraft?: boolean;
  isError?: boolean;
};

/**
 * Creates metadata for inner pages while preserving global settings
 */
export async function createInnerMetadata({
  title,
  description,
  path,
  isListing = false,
  image,
  isAdminPage = false,
  isPreview = false,
  isDraft = false,
  isError = false
}: MetadataInput): Promise<Metadata> {
  // Get settings
  const settings = await settingsRepository.getAll();
  
  // Normalize the favicon path
  const rawFavicon = settings.site_favicon;
  const favicon = rawFavicon 
    ? (rawFavicon.startsWith('/') || rawFavicon.startsWith('http')
        ? rawFavicon
        : `/${rawFavicon}`)
    : null;

  const sharingImage = image || (isListing ? settings.og_image : undefined);

  return {
    // Listing pages use the root title template; other pages use the exact title
    title: isListing ? title : { absolute: title },
    description,
    // Paths resolve against metadataBase, which the root layout sets
    alternates: path ? { canonical: path } : undefined,
    robots: getRobotsMeta({ isAdminPage, isPreview, isDraft, isError }),
    openGraph: {
      title,
      description,
      url: path,
      siteName: settings.site_title || 'Blog',
      locale: 'en_US',
      type: isListing ? 'website' : 'article',
      images: sharingImage
        ? [{ url: sharingImage, width: 1200, height: 630, alt: title }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: sharingImage ? [sharingImage] : undefined,
      creator: settings.twitter_handle || undefined,
    },
    ...(favicon ? {
      icons: {
        icon: [
          { url: favicon, sizes: '32x32' },
          { url: favicon, sizes: '192x192' },
          { url: favicon, sizes: '512x512' },
        ],
        shortcut: favicon,
        apple: [
          { url: favicon, sizes: '180x180' },
        ],
      }
    } : {}),
  };
}