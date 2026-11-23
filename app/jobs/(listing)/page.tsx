import { Metadata } from "next";

const CITY_NAMES = ["الدمام", "الخبر", "جبيل", "الرياض", "جدة"];

type Props = {
  searchParams: Promise<{
    page?: string;
    q?: string;
    location?: string;
    company?: string;
    specialization?: string;
    date_posted?: string;
  }>;
};

const BASE = "https://madar-jobs.vercel.app";

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { page, q, location, company, specialization, date_posted } = await searchParams;
  const pageNum = Math.max(1, Number(page) || 1);
  const pageSuffix = pageNum > 1 ? ` - صفحة ${pageNum}` : "";

  const loc = location?.trim();
  const region = loc && /الشرقية/.test(loc);
  const city = loc && !region ? CITY_NAMES.find((c) => loc.includes(c)) : undefined;
  if (region || city) {
    const place = region ? "المنطقة الشرقية" : city!;
    const canonical = `${BASE}/jobs?location=${encodeURIComponent(region ? loc : city!)}` +
      (pageNum > 1 ? `&page=${pageNum}` : "");
    return {
      title: {
        absolute: region
          ? `وظائف المنطقة الشرقية${pageSuffix} | مدار`
          : `وظائف ${city}${pageSuffix} | مدار`,
      },
      description: region
        ? "وظائف جديدة في الدمام والخبر وجبيل وباقي المنطقة الشرقية من مكاتب موثوقة، محدثة يوميا."
        : `وظائف جديدة في ${place} من مكاتب موثوقة، محدثة يوميا.`,
      alternates: { canonical },
    };
  }

  // Free-text search and facet filters are unbounded user states: keep them
  // crawlable for discovery but out of the index to avoid duplicate/thin pages.
  if (q || company || specialization || date_posted) {
    return {
      title: { absolute: `نتائج البحث في الوظائف${pageSuffix} | مدار` },
      robots: { index: false, follow: true },
      alternates: { canonical: `${BASE}/jobs` },
    };
  }

  return {
    title: { absolute: `وظائف السعودية اليوم${pageSuffix} | مدار` },
    description: "أحدث وظائف السعودية من مكاتب إلحاق العمالة المصرية الموثوقة. تصفح وقدّم بسهولة.",
    // Each page of results is its own canonical URL so deep pages can be indexed.
    alternates: { canonical: pageNum > 1 ? `${BASE}/jobs?page=${pageNum}` : `${BASE}/jobs` },
  };
}

/** The visible content lives in the @list and @details parallel route slots. */
export default function Page() {
  return null;
}
