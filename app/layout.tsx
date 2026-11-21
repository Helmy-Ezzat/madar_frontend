import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { SavedJobsProvider } from "@/contexts/SavedJobsContext";
import { ToastProvider } from "@/components/Toast";

export const vazirMatn = Vazirmatn({
  subsets: ['arabic', 'latin', 'latin-ext'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "مدار",
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
        className={`${vazirMatn.className} antialiased bg-slate-50 flex flex-col`} dir="rtl"
      >
        <AuthProvider>
          <SavedJobsProvider>
          <ToastProvider>
            <Navbar />
            <div className="flex-1 mb-4 mt-4 md:mt-0">
              {children}
            </div>
            <Footer />
          </ToastProvider>
          </SavedJobsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
