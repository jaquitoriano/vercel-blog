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
  // Get settings (with graceful error handling)
  let settings: Record<string, string> = {};
  try {
    settings = await settingsRepository.getAll();
  } catch (error) {
    console.error('Failed to load settings for metadata:', error);
    // Continue with empty settings - we'll use fallbacks
  }
  
  // Fallback to parent metadata if available
  const parentMetadata = await parent;
  
  // Get base URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vercel-blog-template.vercel.app';
  
  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: settings.meta_title || parentMetadata.title?.absolute || 'Blog Template',
      template: `%s | ${settings.site_title || 'Blog Template'}`
    },
    description: settings.meta_description || parentMetadata.description || 'A modern blog template built with Next.js',
    keywords: settings.meta_keywords || undefined,
    openGraph: {
      title: settings.meta_title || parentMetadata.openGraph?.title || 'Blog Template',
      description: settings.meta_description || parentMetadata.openGraph?.description || 'A modern blog template built with Next.js',
      url: baseUrl,
      siteName: settings.site_title || 'Blog Template',
      locale: 'en_US',
      type: 'website',
      images: settings.og_image 
        ? [{ url: settings.og_image, width: 1200, height: 630, alt: settings.site_title || 'Blog' }] 
        : parentMetadata.openGraph?.images,
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.meta_title || parentMetadata.twitter?.title || 'Blog Template',
      description: settings.meta_description || parentMetadata.twitter?.description || 'A modern blog template built with Next.js',
      images: settings.og_image ? [settings.og_image] : parentMetadata.twitter?.images,
      creator: settings.twitter_handle || undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
    manifest: "/manifest.json",
  };
}