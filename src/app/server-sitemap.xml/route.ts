import { getServerSideSitemap } from 'next-sitemap';
import type { ISitemapField } from 'next-sitemap';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  // Base URL from environment variable
  const baseUrl = process.env.SITE_URL || 'https://ikira-blog.vercel.app';

  try {
    // Fetch all published posts
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    // Fetch all categories
    const categories = await prisma.category.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    // Fetch all tags
    const tags = await prisma.tag.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    // Create sitemap entries for posts
    const postEntries: ISitemapField[] = posts.map((post) => ({
      loc: `${baseUrl}/posts/${post.slug}`,
      lastmod: post.updatedAt.toISOString(),
      changefreq: 'weekly',
      priority: 0.8,
    }));

    // Create sitemap entries for categories
    const categoryEntries: ISitemapField[] = categories.map((category) => ({
      loc: `${baseUrl}/categories/${category.slug}`,
      lastmod: category.updatedAt?.toISOString(),
      changefreq: 'weekly',
      priority: 0.7,
    }));

    // Create sitemap entries for tags
    const tagEntries: ISitemapField[] = tags.map((tag) => ({
      loc: `${baseUrl}/tags/${tag.slug}`,
      lastmod: tag.updatedAt?.toISOString(),
      changefreq: 'weekly',
      priority: 0.6,
    }));

    // Combine all entries
    const entries = [...postEntries, ...categoryEntries, ...tagEntries];

    // Return the sitemap
    return getServerSideSitemap(entries);
  } catch (error) {
    console.error('Error generating server sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}