import { Metadata } from 'next';
import { settingsRepository } from '@/lib/repositories/settings.repository';
import { getRobotsMeta } from './robots';

type MetadataInput = {
  title: string;
  description: string;
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
  image,
  isAdminPage = false,
  isPreview = false,
  isDraft = false,
  isError = false
}: MetadataInput): Promise<Metadata> {
  // Get settings
  const settings = await settingsRepository.getAll();
  
  // Get base URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vercel-blog-template.vercel.app';
  
  // Normalize the favicon path
  const rawFavicon = settings.site_favicon;
  const favicon = rawFavicon 
    ? (rawFavicon.startsWith('/') || rawFavicon.startsWith('http')
        ? rawFavicon
        : `/${rawFavicon}`)
    : null;

  return {
    title: {
      absolute: title, // Use the exact title without template
    },
    description,
    robots: getRobotsMeta({ isAdminPage, isPreview, isDraft, isError }),
    openGraph: {
      title,
      description,
      url: baseUrl,
      siteName: settings.site_title || 'Blog',
      locale: 'en_US',
      type: 'article',
      images: image 
        ? [{ url: image, width: 1200, height: 630, alt: title }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
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