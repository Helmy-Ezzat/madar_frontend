import { MetadataRoute } from 'next'
import { getJobs } from '@/services/jobService'

const baseUrl = 'https://madar-jobs.vercel.app';
const PAGE_SIZE = 50; // API caps limit at 50 per page

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // First page tells us the total, then fetch the rest (page 1 is reused).
  const first = await getJobs({ page: 1, limit: PAGE_SIZE });
  const totalPages = first.metadata.total_pages || 1;
  const rest = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, i) => getJobs({ page: i + 2, limit: PAGE_SIZE }))
  );
  const jobs = [first, ...rest]
    .flatMap((p) => p.jobs)
    .filter((j) => j.approval_status !== 'closed');

  return [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/jobs`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/terms`, changeFrequency: 'yearly', priority: 0.2 },
    ...jobs.map((j) => ({
      url: `${baseUrl}/jobs/${j._id}`,
      lastModified: new Date(j.published_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
