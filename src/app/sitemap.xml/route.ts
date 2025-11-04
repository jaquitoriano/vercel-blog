import { getAllPostsWithRelations } from '@/lib/postgresData';

/**
 * Dynamic sitemap.xml route using App Router route handler
 * URL: /sitemap.xml
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vercel-blog-template.vercel.app';

  // Fetch all posts and only include published ones
  let posts: any[] = [];
  try {
    posts = await getAllPostsWithRelations();
  } catch (err) {
    console.error('Failed to fetch posts for sitemap:', err);
    posts = [];
  }

  const published = posts.filter((p: any) => p.status === 'PUBLISHED');

  const urls = published.map((post: any) => {
    const lastmod = post.updatedAt ? new Date(post.updatedAt).toISOString() : (post.date ? new Date(post.date).toISOString() : undefined);
    return `
  <url>
    <loc>${baseUrl}/posts/${post.slug}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${urls}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400'
    }
  });
}
