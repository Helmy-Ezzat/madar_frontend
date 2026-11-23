import { Suspense } from "react";
import { Metadata } from "next";
import JobsList from "@/app/jobs/_components/JobsList";
import JobsListSkeleton from "@/app/jobs/_components/skeleton/JobsListSkeleton";

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

export default async function JobsPage({ searchParams }: Props) {
  const { page, q, location, company, specialization, date_posted } = await searchParams;

  return (
    <Suspense fallback={<JobsListSkeleton />}>
      <JobsList
        page={Number(page) || 1}
        q={q}
        location={location}
        company={company}
        specialization={specialization}
        date_posted={date_posted}
      />
    </Suspense>
  );
}
