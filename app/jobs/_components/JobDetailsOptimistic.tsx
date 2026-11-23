"use client";

import { Job } from "@/types";
import { formatJobText } from "@/utils/textFormatter";
import JobDetailsHeader from "./JobDetailsHeader";

/**
 * Instant details panel rendered from the clicked card's data while the
 * server-rendered JobDetails streams in. The header (and the description,
 * when the list payload already carries it) shows real content immediately,
 * so opening a job never flashes a gray skeleton. A small pulse placeholder
 * covers only the part still loading.
 */
export default function JobDetailsOptimistic({ job }: { job: Job }) {
    return (
        <aside
            data-modal="job-details"
            className="details-enter fixed inset-0 z-50 bg-white lg:border-t-4 lg:border-primary lg:sticky lg:top-24 lg:h-205 lg:rounded-xl lg:shadow-xl lg:inset-auto lg:z-0 flex flex-col overflow-y-hidden"
            aria-label="Job Details"
        >
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
        </aside>
    );
}
