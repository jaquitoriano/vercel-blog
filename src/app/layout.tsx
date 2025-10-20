import "./globals.css";
import { Inter, Source_Serif_4 } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminIndicator from "@/components/AdminIndicator";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { SettingsProvider } from "@/lib/contexts/SettingsContext";
import { generateMetadata } from "./metadata";

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
  
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable} scroll-smooth dark`}>
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
