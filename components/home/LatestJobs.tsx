import Link from "next/link";
import { getJobs } from "@/services/jobService";
import { fromNow } from "@/lib/date-utils";
import { BadgeCheck, Building2, MapPin, Wallet } from "lucide-react";
import type { Job } from "@/types";

function jobTitle(job: Job): string {
    const first = job.job_info?.job_titles?.[0];
    if (!first) return "وظيفة";
    return typeof first === "object" ? (first as any).text : first;
}

export default async function LatestJobs() {
    const { jobs } = await getJobs({ limit: 6 });
    if (!jobs.length) return null;

    return (
        <section className="py-16 px-4 bg-surface" aria-labelledby="latest-jobs-heading">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 id="latest-jobs-heading" className="text-2xl md:text-4xl font-bold text-text-main mb-4">
                        أحدث الوظائف على <span className="text-primary">مدار</span>
                    </h2>
                    <p className="text-text-body text-lg max-w-2xl mx-auto">
                        وظائف جديدة بتتضاف كل يوم من مكاتب الإلحاق المرخصة
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                    {jobs.map((job) => (
                        <Link
                            key={job._id}
                            href={`/jobs?jobId=${job._id}`}
                            className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md hover:border-primary transition-all duration-200"
                        >
                            <h3 className="font-bold text-text-main text-base line-clamp-2 leading-snug">
                                {jobTitle(job)}
                            </h3>

                            <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-text-light shrink-0" />
                                <span className="text-sm font-semibold text-text-main truncate">
                                    {job.company_name}
                                </span>
                                <BadgeCheck className="w-4 h-4 text-primary shrink-0" strokeWidth={3} />
                            </div>

                            <div className="flex flex-col gap-1.5 text-sm text-text-muted">
                                {job.job_info?.location && (
                                    <span className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-text-light shrink-0" />
                                        <span className="truncate">{job.job_info.location}</span>
                                    </span>
                                )}
                                {job.job_info?.salary && (
                                    <span className="flex items-center gap-2">
                                        <Wallet className="w-4 h-4 text-text-light shrink-0" />
                                        <span className="truncate">{job.job_info.salary}</span>
                                    </span>
                                )}
                            </div>

                            <time dateTime={job.published_at} className="text-xs text-[#27AA40] font-bold mt-auto">
                                {fromNow(job.published_at)}
                            </time>
                        </Link>
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        href="/jobs"
                        className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all hover:shadow-xl"
                    >
                        تصفح كل الوظائف
                        <span aria-hidden="true">←</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
