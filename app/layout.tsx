import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { SavedJobsProvider } from "@/contexts/SavedJobsContext";
import { ToastProvider } from "@/components/Toast";
import { Analytics } from "@vercel/analytics/next";
import PushRegistrar from "@/components/PushRegistrar";

const plexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-plex-arabic',
});

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-plex-sans',
});

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "مدار | كل وظائف الخارج في مكان واحد",
    template: "مدار |  %s"
  },
  description: "المنصة الأولى لتجميع وظائف مكاتب إلحاق العمالة المصرية بالخارج. ابحث عن فرصتك في دول الخليج وأوروبا بكل سهولة.",
  keywords: ["وظائف بالخارج", "إلحاق عمالة", "سفر للخارج", "وظائف السعودية", "مكاتب توظيف", "مدار"],
  metadataBase: new URL('https://madar-jobs.vercel.app'),
  openGraph: {
    title: "مدار - كل وظائف الخارج في مكان واحد",
    description: "بدل ما تتابع 100 جروب، مدار بيجمعلك كل الوظائف الموثوقة في مكان واحد.",
    url: 'https://madar-jobs.vercel.app',
    siteName: 'مدار',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'شعار مدار لوظائف الخارج',
      },
    ],
    locale: 'ar_EG',
    type: 'website',
  },

  twitter: { card: 'summary_large_image', title: 'مدار - كل وظائف الخارج في مكان واحد', images: ['/og.png'] },
  verification: {
    google: "_s_tR8i3t3zsGl551vWxwlCuzI4hSNzGUOIjL9p217w",
  },
  icons: {
    icon: [
      // { url: '/Orbit.png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar">
      <body
        className={`${plexSansArabic.variable} ${plexSans.variable} antialiased bg-slate-50 flex flex-col`} dir="rtl"
      >
        <AuthProvider>
          <SavedJobsProvider>
          <ToastProvider>
            <PushRegistrar />
            <Navbar />
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </ToastProvider>
          </SavedJobsProvider>
        </AuthProvider>
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "مدار",
                "url": "https://madar-jobs.vercel.app",
                "logo": "https://madar-jobs.vercel.app/icon-192.png",
                "description": "المنصة الأولى لتجميع وظائف مكاتب إلحاق العمالة المصرية بالخارج.",
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "مدار",
                "url": "https://madar-jobs.vercel.app",
                "inLanguage": "ar",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": "https://madar-jobs.vercel.app/jobs?q={search_term_string}",
                  },
                  "query-input": "required name=search_term_string",
                },
              },
            ]).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
