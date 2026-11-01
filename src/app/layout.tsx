import "./globals.css";
import { Inter, Source_Serif_4 } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';
import Header from "@/components/navigation/Header";
import Footer from "@/components/Footer";
import AdminIndicator from "@/components/AdminIndicator";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { SettingsProvider } from "@/lib/contexts/SettingsContext";
import { generateMetadata } from "./metadata";
import { settingsRepository } from '@/lib/repositories/settings.repository';

// Export the dynamic metadata function
export { generateMetadata };

// Font configurations
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get current user status
  const userStatus = await getCurrentUser();
  // Get Google Analytics ID from site settings (server-side)
  const gaId = (await settingsRepository.getByKey('google_analytics_id')) || '';
  // Fetch a few site settings used for structured data and metadata
  const siteTitle = (await settingsRepository.getByKey('site_title')) || '';
  const siteDescription = (await settingsRepository.getByKey('meta_description')) || '';
  const siteLogo = (await settingsRepository.getByKey('site_logo')) || '';
  const siteUrl = process.env.SITE_URL || 'https://vercel-blog-template.vercel.app';
  
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable} scroll-smooth dark`}>
      <head>
        {gaId && gaId.trim() ? (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}></script>
            <script
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${gaId}', { page_path: window.location.pathname });`,
              }}
            />
          </>
        ) : null}
        {/* JSON-LD structured data for SEO */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: siteTitle || undefined,
              url: siteUrl,
              description: siteDescription || undefined,
              publisher: siteLogo
                ? {
                    "@type": "Organization",
                    name: siteTitle || undefined,
                    logo: {
                      "@type": "ImageObject",
                      url: siteLogo
                    }
                  }
                : undefined,
              potentialAction: {
                "@type": "SearchAction",
                target: `${siteUrl}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              }
            })
          }}
        />
      </head>
      <body className="font-sans antialiased flex flex-col min-h-screen">
        <SettingsProvider>
          <div className="flex flex-col min-h-screen bg-background text-foreground">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl">
              <Header />
              <main className="flex-grow w-full">
                <div className="py-10 md:py-16">
                  {children}
                </div>
              </main>
              <Footer />
            </div>
          </div>
          {/* Admin indicator - appears on all pages except admin pages */}
          <AdminIndicator userStatus={userStatus} />
          <Analytics />
        </SettingsProvider>
      </body>
    </html>
  );
}
