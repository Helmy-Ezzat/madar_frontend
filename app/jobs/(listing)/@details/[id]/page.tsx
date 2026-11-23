import { Suspense } from "react";
import JobDetails from "@/app/jobs/_components/JobDetails";
import JobDetailsSkeleton from "@/app/jobs/_components/skeleton/JobDetailsSkeleton";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function JobDetailsSlot({ params }: Props) {
  const { id } = await params;

  return (
    <Suspense key={id} fallback={<JobDetailsSkeleton />}>
      <JobDetails jobId={id} />
    </Suspense>
  );
}
