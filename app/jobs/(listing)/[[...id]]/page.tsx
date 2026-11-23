import { Suspense } from "react";
import { Metadata } from "next";
import { getJobById } from "@/services/jobService";
import JobDetails from "@/app/jobs/_components/JobDetails";
import JobDetailsSkeleton from "@/app/jobs/_components/skeleton/JobDetailsSkeleton";
import JobsList from "@/app/jobs/_components/JobsList";
import JobsListSkeleton from "@/app/jobs/_components/skeleton/JobsListSkeleton";

const CITY_NAMES = ["الدمام", "الخبر", "جبيل", "الرياض", "جدة"];

type Props = {
  params: Promise<{ id?: string[] }>;
  searchParams: Promise<{
    page?: string;
    q?: string;
    location?: string;
    company?: string;
    specialization?: string;
    date_posted?: string;
  }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const [{ id }, { location }] = await Promise.all([params, searchParams]);
  const jobId = id?.[0];

  // List metadata
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

  // Job details metadata
  const job = await getJobById(jobId);

  if (!job) {
    return {
      title: "وظيفة غير متاحة",
    };
  }

  const jobTitle = job.job_info.job_titles[0] || "وظيفة شاغرة";
  const text = (job.raw_text || job.job_info.summary || "").replace(/\s+/g, " ").trim();
  const url = `https://madar-jobs.vercel.app/jobs/${job._id}`;

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

/**
 * Optional catch-all: /jobs and /jobs/[id] are the SAME page component.
 * Navigating between them (and between two jobs) only changes params, so
 * React reconciles instead of remounting: the jobs list keeps its DOM,
 * scroll position and client state, and never shows its skeleton again.
 * Only the details column suspends, showing its own skeleton.
 */
export default async function JobsPage({ params, searchParams }: Props) {
  const [{ id }, { page, q, location, company, specialization, date_posted }] =
    await Promise.all([params, searchParams]);
  const jobId = id?.[0];

  return (
    <>
      {/* Jobs List: same component across /jobs and /jobs/[id], stays mounted */}
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
      {/* Job Details side column: the only part that loads on card click */}
      {jobId && (
        <Suspense key={jobId} fallback={<JobDetailsSkeleton />}>
          <JobDetails jobId={jobId} />
        </Suspense>
      )}
    </>
  );
}
