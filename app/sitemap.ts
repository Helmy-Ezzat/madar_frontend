import { MetadataRoute } from 'next'
import { getJobs } from '@/services/jobService'

const baseUrl = 'https://madar-jobs.vercel.app';
const PAGE_SIZE = 50; // API caps limit at 50 per page

export const revalidate = 3600;
// Generate on first request, never at build time: a deploy must not bake in a
// sitemap built while the backend is rate-limiting.
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // First page tells us the total, then fetch the rest (page 1 is reused).
  // The backend rate-limits, so pages are fetched in small sequential batches
  // instead of one big fan-out.
  const first = await getJobs({ page: 1, limit: PAGE_SIZE });
  const totalPages = Math.min(first.metadata.total_pages || 1, 200);
  const pages = [first];
  const BATCH = 4;
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  // getJobs swallows errors into an empty page; an empty page beyond the
  // first while jobs exist means the fetch failed (rate limit / cold start),
  // so those pages get one retry pass before we accept a partial sitemap.
  const failed: number[] = [];
  for (let start = 2; start <= totalPages; start += BATCH) {
    const batch = await Promise.all(
      Array.from(
        { length: Math.min(BATCH, totalPages - start + 1) },
        (_, i) => getJobs({ page: start + i, limit: PAGE_SIZE })
      )
    );
    batch.forEach((p, i) => {
      pages[start - 1 + i] = p;
      if (p.jobs.length === 0) failed.push(start + i);
    });
    await sleep(500);
  }
  for (const pageNum of failed) {
    await sleep(1500);
    pages[pageNum - 1] = await getJobs({ page: pageNum, limit: PAGE_SIZE });
  }
  const jobs = pages
    .flatMap((p) => p.jobs)
    .filter((j) => j.approval_status !== 'closed');

  // Degrade gracefully: a partial sitemap (some pages rate-limited) is fine,
  // but never serve or cache a sitemap with zero jobs. Throwing makes ISR
  // keep the last good copy, or answer 500 instead of a wrong empty sitemap.
  if (jobs.length === 0) {
    throw new Error('sitemap: no jobs fetched (backend rate limit or outage)');
  }

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
