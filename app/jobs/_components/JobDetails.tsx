import { getJobById } from "@/services/jobService";
import { formatJobText } from "@/utils/textFormatter";
import JobDetailsHeader from "./JobDetailsHeader";
import JobDetailsCloseButton from "./JobDetailsCloseButton";
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
        "url": `https://madar-jobs.vercel.app/jobs/${job._id}`,
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
            className="details-enter fixed inset-0 z-50 bg-white lg:border-t-4 lg:border-primary lg:sticky lg:top-24 lg:h-205 lg:rounded-xl lg:shadow-xl lg:inset-auto lg:z-0 flex flex-col overflow-y-hidden"
            aria-label="Job Details"
        >
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
                />
            )}
            {/* Header */}
            <JobDetailsHeader job={job} />
            {/* Job Description */}
            <article className="overflow-y-auto min-h-0 py-6">
                <div className="whitespace-pre-wrap text-sm leading-8 text-gray-700 font-medium px-5">
                    {formatJobText(job.raw_text)}
                </div>
            </article>
        </aside>
    );
}
