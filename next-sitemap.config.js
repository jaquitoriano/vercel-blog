/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://vercel-blog-template.vercel.app',
  generateRobotsTxt: true,
  exclude: [
    '/admin/*',
    '/api/*',
    '/403',
    '/server-sitemap.xml'
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/api',
          '/403'
        ],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL}/server-sitemap.xml`,
    ],
  },
  // Change priority and frequency based on page importance
  changefreq: 'daily',
  priority: 0.7,
  // Process all routes statically at build time
  generateIndexSitemap: false
}