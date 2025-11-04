import React from 'react';
import { settingsRepository } from '@/lib/repositories/settings.repository';

/**
 * Server component that injects JSON-LD structured data for WebSite and Organization.
 * This helps search engines understand the site and enables rich results.
 */
export default async function StructuredData() {
  const settings = await settingsRepository.getAll();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vercel-blog-template.vercel.app';
  const siteTitle = settings.site_title || 'Ikira';
  const description = settings.meta_description || 'A modern Ikira built with Next.js';
  const logo = settings.og_image || `${baseUrl}/images/fallbacks/og-image.png`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        'url': baseUrl,
        'name': siteTitle,
        'description': description,
        'publisher': { '@id': `${baseUrl}/#organization` },
      },
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        'name': siteTitle,
        'url': baseUrl,
        'logo': { '@type': 'ImageObject', 'url': logo },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
