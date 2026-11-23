import type { Metadata } from "next";
import { getJobById } from "@/services/jobService";

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const job = await getJobById(id).catch(() => null);
  const jobTitle = job?.job_info.job_titles[0];

  return {
    // Application forms are private utility pages: keep them out of the index.
    title: jobTitle ? `التقديم على وظيفة ${jobTitle}` : "التقديم على وظيفة",
    robots: { index: false, follow: false },
  };
}

export default function ApplyLayout({ children }: Props) {
  return children;
}
