import "./globals.css";
import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
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
  title: {
    default: "Blog Template",
    template: "%s | Blog Template"
  },
  description: "A modern blog template built with Next.js",
  openGraph: {
    title: "Blog Template",
    description: "A modern blog template built with Next.js",
    url: "https://your-site.com",
    siteName: "Blog Template",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Template",
    description: "A modern blog template built with Next.js",
  },
  robots: {
    index: true,
    follow: true,
  },
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
      </body>
    </html>
  );
}
