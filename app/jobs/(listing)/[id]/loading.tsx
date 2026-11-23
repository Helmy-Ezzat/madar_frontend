import JobsListSkeleton from "@/app/jobs/_components/skeleton/JobsListSkeleton";
import JobDetailsSkeleton from "@/app/jobs/_components/skeleton/JobDetailsSkeleton";

export default function Loading() {
  return (
    <>
      <JobsListSkeleton />
      <JobDetailsSkeleton />
    </>
  );
}
