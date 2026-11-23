"use client";

import { ReactNode } from "react";

/**
 * The stable outer container of the job details panel. It mounts once per
 * job and owns the enter animation; the content inside (optimistic panel,
 * skeleton, or the streamed server JobDetails) swaps without remounting
 * this element, so the animation never re-runs mid-open and the container
 * never changes size or position.
 */
export default function JobDetailsFrame({ children }: { children: ReactNode }) {
    return (
        <aside
            data-modal="job-details"
            className="details-enter overscroll-contain fixed inset-0 z-50 bg-white lg:border-t-4 lg:border-primary lg:sticky lg:top-24 lg:h-205 lg:rounded-xl lg:shadow-xl lg:inset-auto lg:z-0 flex flex-col overflow-y-hidden"
            aria-label="Job Details"
        >
            {children}
        </aside>
    );
}
