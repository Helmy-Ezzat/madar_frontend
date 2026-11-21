import { MetadataRoute } from 'next'
import { getJobs } from '@/services/jobService'

const baseUrl = 'https://madar-jobs.vercel.app';
const JOB_PAGES = 10; // API caps at 50 per page: newest 500 jobs

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await Promise.all(
    Array.from({ length: JOB_PAGES }, (_, i) => getJobs({ page: i + 1, limit: 50 }))
  );
  const jobs = pages
    .flatMap((p) => p.jobs)
    .filter((j) => j.approval_status !== 'closed');

  return [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/jobs`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.4 },
    ...jobs.map((j) => ({
      url: `${baseUrl}/jobs?jobId=${j._id}`,
      lastModified: new Date(j.published_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
