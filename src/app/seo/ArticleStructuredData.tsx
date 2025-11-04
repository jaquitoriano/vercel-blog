import React from 'react';
import { settingsRepository } from '@/lib/repositories/settings.repository';

type PostForStructuredData = {
  id: string;
  title: string;
  excerpt?: string;
  slug: string;
  coverImage?: string | null;
  date: string | Date;
  updatedAt?: string | Date;
  author: { id?: string; name: string; avatar?: string | null };
  tags?: { id?: string; name?: string; slug?: string }[];
  category?: { id?: string; name?: string; slug?: string } | null;
};

export default async function ArticleStructuredData({ post }: { post: PostForStructuredData }) {
  const settings = await settingsRepository.getAll();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vercel-blog-template.vercel.app';
  const publishDate = new Date(post.date).toISOString();
  const modifiedDate = post.updatedAt ? new Date(post.updatedAt).toISOString() : publishDate;
  const image = post.coverImage || settings.og_image || `${baseUrl}/images/fallbacks/og-image.png`;
  const siteTitle = settings.site_title || 'Ikira';

  const keywords = post.tags?.map(t => t.name).filter(Boolean) || [];
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${baseUrl}/posts/${post.slug}`,
    },
    'headline': post.title,
    'description': post.excerpt || settings.meta_description || '',
    'image': [image],
    'author': {
      '@type': 'Person',
      'name': post.author?.name || settings.site_author || siteTitle,
    },
    'publisher': {
      '@type': 'Organization',
      'name': siteTitle,
      'logo': {
        '@type': 'ImageObject',
        'url': settings.og_image || `${baseUrl}/images/fallbacks/og-image.png`,
      },
    },
    'datePublished': publishDate,
    'dateModified': modifiedDate,
    // Optional article fields
    ...(post.category ? { 'articleSection': post.category.name } : {}),
    ...(keywords.length ? { 'keywords': keywords.join(', ') } : {}),
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
    />
  );
}
