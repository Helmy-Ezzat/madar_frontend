import { getJobById } from "@/services/jobService";
import { formatJobText } from "@/utils/textFormatter";
import { fromNow } from "@/lib/date-utils";
import JobDetailsCloseButton from "./JobDetailsCloseButton";
import SaveJobButton from "@/components/SaveJobButton";
import { Building2 } from "lucide-react";
import VerifiedTick from "@/components/VerifiedTick";
import JobSourceChip from "@/components/JobSourceChip";
import ApplyButton from "./ApplyButton";
import Image from "next/image";

export default async function JobDetails({ jobId }: { jobId: string }) {
    const job = await getJobById(jobId);

    if (!job) {
        return (
            <aside data-modal="job-details" className="fixed inset-0 z-50 bg-white lg:border-t-4 lg:border-primary lg:sticky lg:top-24 lg:h-205 lg:rounded-xl lg:shadow-xl lg:inset-auto lg:z-0 flex flex-col items-center justify-center p-5">
                <div className="absolute top-5 left-5">
                    <JobDetailsCloseButton />
                </div>
                <Image
                    src="/undraw_server-down_lxs9.svg"
                    alt="لا توجد نتائج"
                    width={256}
                    height={192}
                    className="w-64 mb-6 opacity-80"
                />
                <h2 className="text-xl font-bold text-slate-800 mb-2">عذراً، الوظيفة غير متاحة</h2>
                <p className="text-slate-500">ربما تم حذفها أو انتهت صلاحيتها</p>
            </aside>
        );
    }

    const published = new Date(job.published_at);
    const validThrough = new Date(published);
    validThrough.setMonth(validThrough.getMonth() + 2);
    const jsonLd = job.approval_status === "closed" ? null : {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        "title": job.job_info.job_titles[0],
        "description": job.raw_text || job.job_info.summary,
        "identifier": {
            "@type": "PropertyValue",
            "name": job.company_name,
            "value": job._id
        },
        "datePosted": published.toISOString(),
        "validThrough": validThrough.toISOString(),
        "directApply": !job.source_link,
        "url": `https://madar-jobs.vercel.app/jobs?jobId=${job._id}`,
        "hiringOrganization": {
            "@type": "Organization",
            "name": job.company_name,
            ...(job.source_link ? { "sameAs": job.source_link } : {})
        },
        "jobLocation": {
            "@type": "Place",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": job.job_info.location || "السعودية",
                "addressCountry": "SA"
            }
        }
    };

    return (
        <aside
            data-modal="job-details"
            className="fixed inset-0 z-50 bg-white lg:border-t-4 lg:border-primary lg:sticky lg:top-24 lg:h-205 lg:rounded-xl lg:shadow-xl lg:inset-auto lg:z-0 flex flex-col overflow-y-hidden"
            aria-label="Job Details"
        >
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
                />
            )}
            {/* Header */}
            <header className="flex flex-col gap-5 border-b border-icon-bg pb-5 p-5">
                <div className="flex justify-between">
                    {/* Job Title */}
                    <h2 className="text-lg font-bold line-clamp-1">
                        {job.job_info.job_titles.join(" - ")}
                    </h2>
                    {/* Close Button */}
                    <JobDetailsCloseButton />
                </div>
                {/* Channel Info */}

                <div className="flex items-center gap-2.5">
                    <div className="w-14 aspect-square shrink-0 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                        <Building2 size={24} strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex flex-row items-center gap-1 sm:flex-row">
                            <strong className="text-base font-bold truncate max-w-[240px] sm:max-w-none">
                                {job.company_name}
                            </strong>
                            {job.office_verified && <VerifiedTick className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />}
                        </div>
                        {job.license_number && (
                            <span className="text-[#828A93] text-xs">(ترخيص رقم {job.license_number})</span>
                        )}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            <JobSourceChip postedBy={job.posted_by} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2.5">
                    <time
                        dateTime={job.published_at}
                        className="text-sm text-[#27AA40] font-bold"
                    >
                        {fromNow(job.published_at)}
                    </time>
                    <div className="flex items-center gap-2 flex-wrap">
                        {job.posted_by && (job.approval_status && job.approval_status !== "approved" ? (
                            <span className="inline-flex items-center gap-2 py-2 px-3.5 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold">
                                انتهى التقديم على الوظيفة دي
                            </span>
                        ) : (
                            <ApplyButton jobId={job._id} />
                        ))}
                        {job.source_link && (
                        <a
                            href={job.source_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pointer-events-auto inline-flex items-center justify-center gap-2 py-2 px-3.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
                        >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                        </svg>
                            التقديم من المصدر
                        </a>
                        )}
                        <SaveJobButton jobId={job._id} variant="labeled" />
                    </div>
                </div>
            </header>
            {/* Job Description */}
            <article className="overflow-y-auto min-h-0 py-6">
                <div className="whitespace-pre-wrap text-sm leading-8 text-gray-700 font-medium px-5">
                    {formatJobText(job.raw_text)}
                </div>
            </article>
        </aside>
    );
}
