"use client";

import { Job } from "@/types";
import { formatJobText } from "@/utils/textFormatter";
import JobDetailsHeader from "./JobDetailsHeader";

/**
 * Instant details content rendered from the clicked card's data while the
 * server-rendered JobDetails streams in. Renders inside JobDetailsFrame,
 * which stays mounted through the swap, so the panel opens with real
 * content and never flashes or re-animates.
 */
export default function JobDetailsOptimistic({ job }: { job: Job }) {
    return (
        <>
            <JobDetailsHeader job={job} />
            {job.raw_text ? (
                <article className="overflow-y-auto min-h-0 py-6">
                    <div className="whitespace-pre-wrap text-sm leading-8 text-gray-700 font-medium px-5">
                        {formatJobText(job.raw_text)}
                    </div>
                </article>
            ) : (
                <div className="flex flex-col gap-3 p-5 animate-pulse" aria-hidden>
                    <div className="h-4 bg-gray-100 rounded-md w-full" />
                    <div className="h-4 bg-gray-100 rounded-md w-11/12" />
                    <div className="h-4 bg-gray-100 rounded-md w-full" />
                    <div className="h-4 bg-gray-100 rounded-md w-3/4" />
                </div>
            )}
        </>
    );
}
