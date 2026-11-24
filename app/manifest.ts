import type { MetadataRoute } from "next";

// Web app manifest: lets mobile browsers offer "تثبيت التطبيق" (install to home
// screen) and gives the installed shell its Arabic name, direction and colors.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "مدار | كل وظائف مكاتب إلحاق العمالة في مكان واحد",
    short_name: "مدار",
    description:
      "المنصة الأولى لتجميع وظائف مكاتب إلحاق العمالة المصرية بالخارج. ابحث عن فرصتك في دول الخليج وأوروبا بكل سهولة.",
    lang: "ar",
    dir: "rtl",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#2563eb",
    icons: [
      { src: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
