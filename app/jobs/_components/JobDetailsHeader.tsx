"use client";

import { Building2 } from "lucide-react";
import { Job } from "@/types";
import { fromNow } from "@/lib/date-utils";
import JobDetailsCloseButton from "./JobDetailsCloseButton";
import SaveJobButton from "@/components/SaveJobButton";
import VerifiedTick from "@/components/VerifiedTick";
import JobSourceChip from "@/components/JobSourceChip";
import ApplyButton from "./ApplyButton";

/**
 * Presentational header of the job details panel. Shared by the
 * server-rendered JobDetails and the instant JobDetailsOptimistic so
 * the swap between them is visually seamless.
 */
export default function JobDetailsHeader({ job }: { job: Job }) {
    // Many source posts bundle several roles in one ad; the primary role
    // leads (wrapped, never under the close button) and the rest read as
    // chips instead of one chopped line.
    const [primaryTitle, ...otherTitles] = job.job_info.job_titles;

    return (
        <header className="flex flex-col gap-5 border-b border-icon-bg pb-5 p-5">
            <div className="flex justify-between items-start gap-3">
                {/* Job Title */}
                <h2 className="text-lg font-bold line-clamp-2 min-w-0">
                    {primaryTitle || "وظيفة شاغرة"}
                </h2>
                {/* Close Button */}
                <div className="shrink-0">
                    <JobDetailsCloseButton />
                </div>
            </div>
            {otherTitles.length > 0 && (
                <ul
                    aria-label="وظائف أخرى ضمن نفس الإعلان"
                    className="flex flex-wrap items-center gap-1.5 -mt-2"
                >
                    <li className="text-xs text-[#828A93]">يشمل الإعلان أيضًا:</li>
                    {otherTitles.map((title) => (
                        <li
                            key={title}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                        >
                            {title}
                        </li>
                    ))}
                </ul>
            )}
            {/* Channel Info */}

            <div className="flex items-center gap-2.5">
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
            <div className="flex flex-col gap-2.5">
                <time
                    dateTime={job.published_at}
                    className="text-sm text-[#27AA40] font-bold"
                >
                    {fromNow(job.published_at)}
                </time>
                <div className="flex items-center gap-2 flex-wrap">
                    {job.posted_by && (job.approval_status && job.approval_status !== "approved" ? (
                        <span className="inline-flex items-center gap-2 py-2 px-3.5 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold">
                            انتهى التقديم على الوظيفة دي
                        </span>
                    ) : (
                        <ApplyButton jobId={job._id} />
                    ))}
                    {job.source_link && (
                    <a
                        href={job.source_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pointer-events-auto inline-flex items-center justify-center gap-2 py-2 px-3.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
                    >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                    </svg>
                        التقديم من المصدر
                    </a>
                    )}
                    <SaveJobButton jobId={job._id} variant="labeled" />
                </div>
            </div>
        </header>
    );
}
