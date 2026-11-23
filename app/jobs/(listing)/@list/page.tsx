import { Suspense } from "react";
import JobsList from "@/app/jobs/_components/JobsList";
import JobsListSkeleton from "@/app/jobs/_components/skeleton/JobsListSkeleton";

type Props = {
  searchParams: Promise<{
    page?: string;
    q?: string;
    location?: string;
    company?: string;
    specialization?: string;
    date_posted?: string;
  }>;
};

export default async function JobsListSlot({ searchParams }: Props) {
  const { page, q, location, company, specialization, date_posted } = await searchParams;

  return (
    <Suspense fallback={<JobsListSkeleton />}>
      <JobsList
        page={Number(page) || 1}
        q={q}
        location={location}
        company={company}
        specialization={specialization}
        date_posted={date_posted}
      />
    </Suspense>
  );
}
