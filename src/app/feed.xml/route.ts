import { prisma } from '@/lib/prisma'
import { MetadataRoute } from 'next'

function wrapCdata(content: string | null | undefined): string {
  if (!content) return ''
  // Escape CDATA end marker if it exists in the content
  const escaped = content.replace(/]]>/g, ']]]]><![CDATA[>')
  return `<![CDATA[${escaped}]]>`
}

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED'
    },
    include: {
      author: true,
      category: true,
    },
    orderBy: {
      date: 'desc'
    },
    take: 20
  })

  const settings = await prisma.siteSetting.findMany({
    where: {
      key: {
        in: ['site_title', 'site_description']
      }
    }
  })
  const siteTitle = settings.find(s => s.key === 'site_title')?.value || 'Blog'
  const siteDescription = settings.find(s => s.key === 'site_description')?.value || 'Recent blog posts'
  const baseUrl = process.env.SITE_URL || 'http://ikira-blog.vercel.app'

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${wrapCdata(siteTitle)}</title>
    <link>${baseUrl}</link>
    <description>${wrapCdata(siteDescription)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${posts.map(post => `
    <item>
      <title>${wrapCdata(post.title)}</title>
      <link>${baseUrl}/posts/${post.slug}</link>
      <guid>${baseUrl}/posts/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${wrapCdata(post.excerpt)}</description>
      ${post.category ? `<category>${wrapCdata(post.category.name)}</category>` : ''}
      <author>${wrapCdata(post.author ? post.author.name : 'Unknown Author')}</author>
    </item>`
    ).join('')}
  </channel>
</rss>`

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=1200, stale-while-revalidate=600',
    },
  })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return new Response('Error generating RSS feed', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }
}