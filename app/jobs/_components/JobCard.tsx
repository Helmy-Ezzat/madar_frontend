"use client";
import { memo, useCallback } from "react";
import { fromNow } from "@/lib/date-utils";
import { Job } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { BadgeCheck, Building2, MapPin, ShieldCheck, Wallet } from "lucide-react";
import { useJobContext } from "../_context/JobContext";
import { JobCardTitle } from "./JobCardTitle";

function JobCard({ job }: { job: Job }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setActiveJobId } = useJobContext();
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();

    // Immediate optimistic update
    setActiveJobId(job._id);

    const params = new URLSearchParams(searchParams.toString());
    params.set('jobId', job._id);
    router.push(`/jobs/?${params.toString()}`, { scroll: false });
  }, [job._id, searchParams, router, setActiveJobId]);

  const isActive = searchParams.get('jobId') === job._id;
  return (
    <article
      className={`
      relative group px-5 py-2.5 flex flex-col gap-2.5 bg-white 
      shadow-sm rounded-2xl transition-all duration-200 cursor-pointer
      hover:shadow-md hover:bg-[#F5F6F7]
      ${isActive ? "lg:border-r-4 lg:border-r-primary2 bg-[#F5F6F7] shadow-md" : ""}
    `}
      onClick={handleClick}
    >
      <div className="flex flex-col gap-2.5 relative z-10 pointer-events-none">
        <JobCardTitle titles={job.job_info.job_titles?.map((title: any) =>
          typeof title === 'object' ? title.text : title
        )} />
        <div className="flex items-center gap-1">
          <div className="w-14 aspect-square shrink-0 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
            <Building2 size={24} strokeWidth={1.5} />
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row items-center gap-1 sm:flex-row">
              <strong className="text-base font-bold truncate max-w-[240px] sm:max-w-none">
                {job.company_name}
              </strong>
              <BadgeCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary2" strokeWidth={3} />
            </div>
            <span className="text-[#828A93] text-xs">(ترخيص رقم {job.license_number})</span>
          </div>
        </div>
        {job.job_info.summary && (
          <p className="text-sm text-slate-600 line-clamp-3">
            {typeof job.job_info.summary === 'object'
              ? (job.job_info.summary as any).text
              : job.job_info.summary}
          </p>
        )}
        <div className="flex items-center gap-1">
          <Wallet className="w-4 h-4 text-slate-400" />
          <p className="text-sm text-slate-600 font-bold">الراتب: </p>
          <span className="text-[#828A93] text-xs">{job.job_info.salary}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4 text-slate-400" />
          <p className="text-sm text-slate-600 font-bold">الموقع: </p>
          <span className="text-[#828A93] text-xs">{job.job_info.location}</span>
        </div>
        <div className="flex items-center justify-between">
          <time
            dateTime={job.published_at}
            className="text-sm text-[#27AA40] font-bold"
          >
            {fromNow(job.published_at)}
          </time>
          <a
            onClick={(e) => e.stopPropagation()}
            href={job.source_link}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto inline-flex items-center gap-2 py-2 px-3.5 bg-primary2 hover:bg-primary2/90 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
            </svg>
            <span className="hidden sm:inline">عرض في</span> تليجرام
          </a>
        </div>
      </div>
    </article>
  );
};

export default memo(JobCard);
