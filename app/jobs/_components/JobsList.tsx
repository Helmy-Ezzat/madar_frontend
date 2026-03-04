import { getJobs } from "@/services/jobService";
import Image from "next/image";
import Link from "next/link";
import JobCard from "./JobCard";
import Pagination from "./Pagination";
import JobsHeader from "./JobsHeader";

export default async function JobsList({ page, q, location, company, specialization, date_posted }: {
  page: number;
  q?: string;
  location?: string;
  company?: string;
  specialization?: string;
  date_posted?: string;
}) {
  const { jobs, metadata } = await getJobs({ page, search: q, location, company, specialization, date_posted });
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 lg:h-186 text-center">
        <Image
          src="/undraw_server-down_lxs9.svg"
          alt="لا توجد نتائج"
          width={256}
          height={192}
          className="w-64 mb-6 opacity-80"
        />
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          {q ? `لا توجد نتائج لـ "${q}"` : 'لا توجد وظائف حالياً'}
        </h2>
        <p className="text-slate-500 mb-6">
          {q ? 'جرب البحث بكلمات مختلفة' : 'سيتم إضافة وظائف جديدة قريباً'}
        </p>
        <Link href="/jobs" className="px-6 py-3 bg-primary2 text-white rounded-lg">
          عرض جميع الوظائف
        </Link>
      </div>
    );
  }

  return (
    <main className="flex flex-col gap-3 h-fit px-3 md:px-0  overflow-hidden">
      <JobsHeader total={metadata.total_count} />
      {jobs.map(job => (
        <JobCard key={job._id} job={job} />
      ))}
      <Pagination metadata={metadata} />
    </main>
  );
}