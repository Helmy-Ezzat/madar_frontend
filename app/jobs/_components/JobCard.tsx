"use client";
import { memo, useMemo } from "react";
import Link from "next/link";
import { fromNow } from "@/lib/date-utils";
import { Job } from "@/types";
import { useSearchParams } from "next/navigation";
import { Building2, MapPin, Wallet } from "lucide-react";
import { useJobContext } from "../_context/JobContext";
import { JobCardTitle } from "./JobCardTitle";
import SaveJobButton from "@/components/SaveJobButton";
import VerifiedTick from "@/components/VerifiedTick";
import JobSourceChip from "@/components/JobSourceChip";

function JobCard({ job }: { job: Job }) {
  const searchParams = useSearchParams();
  const { activeJobId, setActiveJob } = useJobContext();

  // Real crawlable link to the job's URL; active filters are carried
  // along so the close button can restore them.
  const href = useMemo(() => {
    const query = searchParams.toString();
    return query ? `/jobs/${job._id}?${query}` : `/jobs/${job._id}`;
  }, [job._id, searchParams]);

  const isActive = activeJobId === job._id;
  return (
    <Link
      href={href}
      scroll={false}
      onClick={() => setActiveJob(job)}
      className="block"
    >
      <article
        className={`
        relative group px-5 py-2.5 flex flex-col gap-2.5 bg-white 
        shadow-sm rounded-2xl transition-all duration-200 cursor-pointer
        hover:shadow-md hover:bg-[#F5F6F7]
        ${isActive ? "lg:border-r-4 lg:border-r-primary bg-[#F5F6F7] shadow-md" : ""}
      `}
      >
        <div className="absolute top-3 end-3 z-20">
          <SaveJobButton jobId={job._id} />
        </div>
        <div className="flex flex-col gap-2.5 relative z-10 pointer-events-none">
          {/* Reserve the inline-end gutter so a long title never runs
              under the floating save button. */}
          <div className="pe-12">
            <JobCardTitle titles={job.job_info.job_titles?.map((title: string | { text: string }) =>
              typeof title === 'object' ? title.text : title
            )} />
          </div>
          <div className="flex items-center gap-1">
            <div className="w-14 aspect-square shrink-0 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
              <Building2 size={24} strokeWidth={1.5} />
            </div>
            <div className="flex flex-col">
              <div className="flex flex-row items-center gap-1 sm:flex-row">
                <strong className="text-base font-bold truncate max-w-[240px] sm:max-w-none">
                  {job.company_name}
                </strong>
                {job.office_verified && <VerifiedTick className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />}
              </div>
              {job.license_number && (
                <span className="text-[#828A93] text-xs">(ترخيص رقم {job.license_number})</span>
              )}
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                <JobSourceChip postedBy={job.posted_by} />
              </div>
            </div>
          </div>
          {job.job_info.summary && (
            <p className="text-sm text-slate-600 line-clamp-3">
              {typeof job.job_info.summary === 'object'
                ? (job.job_info.summary as unknown as { text: string }).text
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
            <span
              className="inline-flex items-center gap-2 py-2 px-3.5 bg-primary text-white rounded-lg text-xs font-semibold transition-all shadow-sm pointer-events-auto group-hover:bg-primary/90"
            >
              <span>عرض التفاصيل</span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default memo(JobCard);
