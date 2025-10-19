import "./globals.css";
import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://vercel-blog-template.vercel.app'),
  title: {
    default: "BLACKPINK Blog",
    template: "%s | BLACKPINK Blog"
  },
  description: "A modern blog template with BLACKPINK-inspired theme built with Next.js and deployed on Vercel",
  openGraph: {
    title: "BLACKPINK Blog",
    description: "A modern blog template with BLACKPINK-inspired theme built with Next.js and deployed on Vercel",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://vercel-blog-template.vercel.app',
    siteName: "BLACKPINK Blog",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/fallbacks/thumbnail.svg",
        width: 1200,
        height: 630,
        alt: "BLACKPINK Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BLACKPINK Blog",
    description: "A modern blog template with BLACKPINK-inspired theme built with Next.js and deployed on Vercel",
    images: ["/images/fallbacks/thumbnail.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable} scroll-smooth dark`}>
      <body className="font-sans antialiased flex flex-col min-h-screen">
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
        <Analytics />
      </body>
    </html>
  );
}
