import { Suspense } from "react";
import { JobProvider } from "@/app/jobs/_context/JobContext";
import JobsPageShell from "@/app/jobs/_components/JobsPageShell";
import SearchInput from "@/components/SearchInput";
import Filters from "@/app/jobs/_components/Filters";
import SearchInputSkeleton from "@/app/jobs/_components/skeleton/SearchInputSkeleton";
import FilterSkeleton from "@/app/jobs/_components/skeleton/FilterSkeleton";

/**
 * Shared layout for the jobs listing routes (/jobs and /jobs/[id]).
 * The search bar, filters and the grid shell stay mounted while
 * navigating between the list and a job's details, so filter state
 * and list scroll are preserved. The apply page lives outside this
 * route group on purpose: it renders standalone.
 */
export default function JobsListingLayout({
  children,
}: {
  children: React.ReactNode;
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
          >
            {children}
          </JobsPageShell>
        </div>
      </div>
    </JobProvider>
  );
}
