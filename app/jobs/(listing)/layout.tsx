import { Suspense } from "react";
import { JobProvider } from "@/app/jobs/_context/JobContext";
import JobsPageShell from "@/app/jobs/_components/JobsPageShell";
import SearchInput from "@/components/SearchInput";
import Filters from "@/app/jobs/_components/Filters";
import SearchInputSkeleton from "@/app/jobs/_components/skeleton/SearchInputSkeleton";
import FilterSkeleton from "@/app/jobs/_components/skeleton/FilterSkeleton";

/**
 * Shared layout for the jobs listing routes (/jobs and /jobs/[id]).
 *
 * Parallel routes: the @list slot only matches /jobs, so when the user
 * opens or closes a job, Next.js preserves the slot's already-rendered
 * list instead of re-rendering it - no skeleton flash, no refetch, no
 * lost scroll position or client state. The @details slot mounts only on
 * /jobs/[id] and is the only region that shows a skeleton on navigation.
 * The apply page lives outside this route group and stays standalone.
 */
export default function JobsListingLayout({
  children,
  list,
  details,
}: {
  children: React.ReactNode;
  list: React.ReactNode;
  details: React.ReactNode;
}) {
  return (
    <JobProvider>
      <div className="flex flex-col lg:gap-4 divide-y divide-icon-bg">
        {/* Search Input */}
        <Suspense fallback={<SearchInputSkeleton />}>
          <div className="bg-white px-3.5 py-5 flex justify-center shadow-sm md:shadow-none">
            <div className="w-full max-w-2xl">
              <SearchInput type="text" />
            </div>
          </div>
        </Suspense>
        {/*
          This wrapper stabilizes the layout width during Suspense loading.
          It prevents the JobDetails skeleton from shrinking or jumping
          while grid columns are transitioning.
        */}
        <div className="w-full pb-8 lg:pb-12">
          <JobsPageShell
            filters={
              <Suspense fallback={<FilterSkeleton />}>
                <Filters />
              </Suspense>
            }
            details={details}
          >
            {list}
            {children}
          </JobsPageShell>
        </div>
      </div>
    </JobProvider>
  );
}
