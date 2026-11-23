"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useJobContext } from "../_context/JobContext";
import JobDetailsSkeleton from "./skeleton/JobDetailsSkeleton";

interface JobsPageShellProps {
  children: ReactNode; // @list slot (+ null children pages)
  filters: ReactNode;  // Filters sidebar (server component passed from the layout)
  details: ReactNode;  // @details slot (Job Details on /jobs/[id])
}

/**
 * Client grid shell shared by /jobs and /jobs/[id].
 * It reads the job id from the pathname, syncs it with the optimistic
 * JobContext, and expands the grid instantly on card click, showing a
 * skeleton in the details column until the server-rendered details arrive.
 */
export default function JobsPageShell({ children, filters, details }: JobsPageShellProps) {
  const pathname = usePathname();
  const { activeJobId, setActiveJobId } = useJobContext();

  const match = pathname.match(/^\/jobs\/([^/]+)\/?$/);
  const routeJobId = match ? match[1] : null;

  // Sync the URL state with the optimistic client state.
  useEffect(() => {
    setActiveJobId(routeJobId);
  }, [routeJobId, setActiveJobId]);

  const showDetails = Boolean(routeJobId || activeJobId);
  const gridConfig = showDetails
    ? "lg:grid-cols-[350px_1fr_1fr]"
    : "lg:grid-cols-[350px_1fr]";

  // The card was clicked but the /jobs/[id] details slot has not rendered yet.
  const isOptimisticLoading = Boolean(activeJobId) && !routeJobId;

  return (
    <div className={`grid grid-cols-1 ${gridConfig} gap-4 max-w-screen-2xl mx-auto transition-[grid-template-columns] duration-500 ease-in-out`}>
      {filters}
      {children}
      {/* The router preserves unmatched slots, so on /jobs the details
          slot would linger in the DOM; only render it on /jobs/[id]. */}
      {routeJobId && details}
      {isOptimisticLoading && <JobDetailsSkeleton />}
    </div>
  );
}
