import JobDetails from "@/app/jobs/_components/JobDetails";

type Props = {
  params: Promise<{ id: string }>;
};

// No Suspense here on purpose: JobsPageShell owns the boundary so its
// fallback can be the optimistic panel built from the clicked card's
// data (a skeleton is only shown on direct loads with no card data).
export default async function JobDetailsSlot({ params }: Props) {
  const { id } = await params;

  return <JobDetails jobId={id} />;
}
