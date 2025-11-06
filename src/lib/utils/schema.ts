export function generateArticleSchema({
  title,
  description,
  authorName,
  authorUrl,
  publishedTime,
  modifiedTime,
  image,
  url,
  tags,
}: {
  title: string;
  description: string;
  authorName: string;
  authorUrl: string;
  publishedTime: string;
  modifiedTime: string;
  image: string;
  url: string;
  tags: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: image,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    author: {
      '@type': 'Person',
      name: authorName,
      url: authorUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: process.env.NEXT_PUBLIC_SITE_TITLE || 'Ikira Blog',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
      },
    },
    url: url,
    isAccessibleForFree: true,
    keywords: tags.join(', '),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}