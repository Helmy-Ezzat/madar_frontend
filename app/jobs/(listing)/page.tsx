import { Metadata } from "next";

const CITY_NAMES = ["الدمام", "الخبر", "جبيل", "الرياض", "جدة"];

type Props = {
  searchParams: Promise<{ location?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { location } = await searchParams;

  const loc = location?.trim();
  const region = loc && /الشرقية/.test(loc);
  const city = loc && !region ? CITY_NAMES.find((c) => loc.includes(c)) : undefined;
  if (region) {
    return {
      title: { absolute: "وظائف المنطقة الشرقية | مدار" },
      description: "وظائف جديدة في الدمام والخبر وجبيل وباقي المنطقة الشرقية من مكاتب موثوقة، محدثة يوميا.",
      alternates: { canonical: "https://madar-jobs.vercel.app/jobs?location=" + encodeURIComponent(loc) },
    };
  }
  if (city) {
    return {
      title: { absolute: `وظائف ${city} | مدار` },
      description: `وظائف جديدة في ${city} من مكاتب موثوقة، محدثة يوميا.`,
      alternates: { canonical: "https://madar-jobs.vercel.app/jobs?location=" + encodeURIComponent(city) },
    };
  }
  return {
    title: { absolute: "وظائف السعودية اليوم | مدار" },
    description: "أحدث وظائف السعودية من مكاتب إلحاق العمالة المصرية الموثوقة. تصفح وقدّم بسهولة.",
    alternates: { canonical: "https://madar-jobs.vercel.app/jobs" },
  };
}

/** The visible content lives in the @list and @details parallel route slots. */
export default function Page() {
  return null;
}
