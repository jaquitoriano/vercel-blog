import { prisma } from '@/lib/db/prisma';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const headersList = headers();
    const domain = headersList.get('host') || 'ikira-blog.vercel.app';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = `${protocol}://${domain}`;

    // Fetch all published posts
    const posts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED'
      },
      select: {
        slug: true,
        updatedAt: true
      }
    });

    // Fetch all categories
    const categories = await prisma.category.findMany({
      select: {
        slug: true,
        updatedAt: true
      }
    });

    // Fetch all tags
    const tags = await prisma.tag.findMany({
      select: {
        slug: true,
        updatedAt: true
      }
    });

    // Fetch all authors
    const authors = await prisma.author.findMany({
      select: {
        id: true,
        updatedAt: true
      }
    });

    // Build XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main pages -->
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/posts</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Posts -->
  ${posts.map(post => `
  <url>
    <loc>${baseUrl}/posts/${post.slug}</loc>
    <lastmod>${post.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
  
  <!-- Categories -->
  ${categories.map(category => `
  <url>
    <loc>${baseUrl}/categories/${category.slug}</loc>
    <lastmod>${category.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
  
  <!-- Tags -->
  ${tags.map(tag => `
  <url>
    <loc>${baseUrl}/tags/${tag.slug}</loc>
    <lastmod>${tag.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
  
  <!-- Authors -->
  ${authors.map(author => `
  <url>
    <loc>${baseUrl}/authors/${author.id}</loc>
    <lastmod>${author.updatedAt.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`).join('')}
</urlset>`;

    // Return XML with proper content type
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}