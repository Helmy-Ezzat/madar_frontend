"use client";

import { ReactNode, Suspense, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useJobContext } from "../_context/JobContext";
import JobDetailsSkeleton from "./skeleton/JobDetailsSkeleton";
import JobDetailsOptimistic from "./JobDetailsOptimistic";
import JobDetailsFrame from "./JobDetailsFrame";

interface JobsPageShellProps {
  children: ReactNode; // @list slot (+ null children pages)
  filters: ReactNode;  // Filters sidebar (server component passed from the layout)
  details: ReactNode;  // @details slot (Job Details on /jobs/[id])
}

/**
 * Client grid shell shared by /jobs and /jobs/[id].
 *
 * The details panel renders inside JobDetailsFrame, one stable container
 * keyed by job id that owns the enter animation. Its content starts as
 * JobDetailsOptimistic (real data from the clicked card) and the @details
 * slot's streamed JobDetails replaces it through a Suspense boundary whose
 * fallback is that same optimistic content, so the swap never remounts the
 * frame, re-runs the animation, or shifts the layout. A skeleton only
 * appears on direct loads, where no card data exists.
 */
export default function JobsPageShell({ children, filters, details }: JobsPageShellProps) {
  const pathname = usePathname();
  const { activeJob, activeJobId, setActiveJob } = useJobContext();

  const match = pathname.match(/^\/jobs\/([^/]+)\/?$/);
  const routeJobId = match ? match[1] : null;

  // The URL is the source of truth for "details open": when it no longer
  // names a job (close button, back/forward), drop the optimistic job.
  useEffect(() => {
    if (!routeJobId) setActiveJob(null);
  }, [routeJobId, setActiveJob]);

  const showDetails = Boolean(routeJobId || activeJobId);
  const gridConfig = showDetails
    ? "lg:grid-cols-[350px_1fr_1fr]"
    : "lg:grid-cols-[350px_1fr]";

  // Card clicked for a job the URL has not caught up with yet.
  const showOptimistic = Boolean(activeJob) && activeJob!._id !== routeJobId;

  // While the real details for the clicked job stream in, keep showing
  // the same optimistic content so the swap is invisible.
  const detailsFallback =
    activeJob && activeJob._id === routeJobId ? (
      <JobDetailsOptimistic job={activeJob} />
    ) : (
      <JobDetailsSkeleton />
    );

  return (
    <div className={`grid grid-cols-1 ${gridConfig} gap-4 max-w-screen-2xl mx-auto transition-[grid-template-columns] duration-500 ease-in-out`}>
      {filters}
      {children}
      {/* The router preserves unmatched slots, so on /jobs the details
          slot would linger in the DOM; only render it on /jobs/[id]. */}
      {showOptimistic ? (
        <JobDetailsFrame key={activeJob!._id}>
          <JobDetailsOptimistic job={activeJob!} />
        </JobDetailsFrame>
      ) : (
        routeJobId && (
          <JobDetailsFrame key={routeJobId}>
            <Suspense fallback={detailsFallback}>{details}</Suspense>
          </JobDetailsFrame>
        )
      )}
    </div>
  );
}
