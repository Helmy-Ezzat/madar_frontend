import JobDetails from "./_components/JobDetails";
import SearchInput from "@/components/SearchInput";
import Filters from "@/app/jobs/_components/Filters";
import { Suspense } from "react";
import { JobProvider } from "./_context/JobContext";
import JobsPageLayout from "./_components/JobsPageLayout";
import SearchInputSkeleton from "./_components/skeleton/SearchInputSkeleton";
import JobDetailsSkeleton from "./_components/skeleton/JobDetailsSkeleton";
import JobsListSkeleton from "./_components/skeleton/JobsListSkeleton";
import FilterSkeleton from "./_components/skeleton/FilterSkeleton";
import JobsList from "./_components/JobsList";
import { Metadata, ResolvingMetadata } from "next";
import { getJobById } from "@/services/jobService";

const CITY_NAMES = ["الدمام", "الخبر", "جبيل", "الرياض", "جدة"];

type Props = {
  searchParams: Promise<{
    page?: string;
    jobId?: string;
    q?: string;
    location?: string;
    company?: string;
    specialization?: string;
    date_posted?: string;
  }>;
};

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { jobId, location } = await searchParams;

  if (!jobId) {
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

  const job = await getJobById(jobId);

  if (!job) {
    return {
      title: "وظيفة غير متاحة",
    };
  }

  const jobTitle = job.job_info.job_titles[0] || "وظيفة شاغرة";
  const text = (job.raw_text || job.job_info.summary || "").replace(/\s+/g, " ").trim();
  const url = `https://madar-jobs.vercel.app/jobs?jobId=${job._id}`;

  return {
    title: `${jobTitle}`,
    description: text.substring(0, 160),
    alternates: { canonical: url },
    robots: job.approval_status === "closed" ? { index: false, follow: true } : undefined,
    openGraph: {
      title: jobTitle,
      description: text.substring(0, 100),
      url,
      type: "article",
      locale: "ar_EG",
    },
    twitter: {
      card: "summary_large_image",
      title: jobTitle,
      description: text.substring(0, 100),
    },
  };
}

export default async function JobsPage({
  searchParams,
}: Props) {
  const { page, q, jobId, location, company, specialization, date_posted } = await searchParams;

  return (
    <JobProvider>
      <div className="flex flex-col lg:gap-4 divide-y divide-icon-bg">
        {/* Search Input */}
        <Suspense fallback={<SearchInputSkeleton />}>
          <div className="bg-white px-3.5 py-5 flex justify-center shadow-sm md:shadow-none">
            <div className="w-full max-w-2xl">
              <SearchInput type="text" />
            </div>
          </div>
        </Suspense>
        {/* 
    <div className="w-full"></div>
    This wrapper stabilizes the layout width during Suspense loading.
    It prevents the JobDetails skeleton from shrinking or jumping
    while grid columns are transitioning.
  */}
        <div className="w-full pb-8 lg:pb-12">
          <JobsPageLayout
            serverJobId={jobId}
            details={
              jobId ? (
                <Suspense key={jobId} fallback={<JobDetailsSkeleton />}>
                  <JobDetails jobId={jobId} />
                </Suspense>
              ) : null
            }
          >
            {/* Filters Sidebar */}
            <Suspense fallback={<FilterSkeleton />}>
              <Filters />
            </Suspense>
            {/* Jobs List */}
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
          </JobsPageLayout>
        </div>
      </div>
    </JobProvider>
  );
}
