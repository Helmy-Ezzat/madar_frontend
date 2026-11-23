import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getJobById } from "@/services/jobService";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const job = await getJobById(id);

  // Fallback metadata for a missing job; the page component below is what
  // turns it into a real 404 response.
  if (!job) {
    return { title: "وظيفة غير متاحة" };
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
 * The job details themselves render in the @details slot of the listing layout.
 * The job is fetched here (deduped with the slot's fetch) purely so a missing
 * job becomes a real 404 response, not a soft-404 panel: with parallel routes
 * the layout shell starts streaming before slot content resolves, so a
 * notFound() thrown inside a slot still goes out with a 200 status.
 */
export default async function Page({ params }: Props) {
  const { id } = await params;
  const job = await getJobById(id);
  if (!job) {
    notFound();
  }
  return null;
}
