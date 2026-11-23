import { Suspense } from "react";
import { Metadata } from "next";
import { getJobById } from "@/services/jobService";
import JobDetails from "@/app/jobs/_components/JobDetails";
import JobDetailsSkeleton from "@/app/jobs/_components/skeleton/JobDetailsSkeleton";
import JobsList from "@/app/jobs/_components/JobsList";
import JobsListSkeleton from "@/app/jobs/_components/skeleton/JobsListSkeleton";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    page?: string;
    q?: string;
    location?: string;
    company?: string;
    specialization?: string;
    date_posted?: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const job = await getJobById(id);

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

export default async function JobDetailsPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { page, q, location, company, specialization, date_posted } = await searchParams;

  return (
    <>
      {/* Jobs List (stays visible next to the details) */}
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
      {/* Job Details side column */}
      <Suspense key={id} fallback={<JobDetailsSkeleton />}>
        <JobDetails jobId={id} />
      </Suspense>
    </>
  );
}
