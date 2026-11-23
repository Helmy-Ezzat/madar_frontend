import { notFound } from "next/navigation";
import { getJobById } from "@/services/jobService";
import { formatJobText } from "@/utils/textFormatter";
import JobDetailsHeader from "./JobDetailsHeader";

export default async function JobDetails({ jobId }: { jobId: string }) {
    const job = await getJobById(jobId);

    // A missing job must be a real 404 so search engines drop the URL
    // instead of indexing a soft-404 panel.
    if (!job) {
        notFound();
    }

    const published = new Date(job.published_at);
    const validThrough = new Date(published);
    validThrough.setMonth(validThrough.getMonth() + 2);
    const jobUrl = `https://madar-jobs.vercel.app/jobs/${job._id}`;
    const breadcrumbLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://madar-jobs.vercel.app" },
            { "@type": "ListItem", "position": 2, "name": "الوظائف", "item": "https://madar-jobs.vercel.app/jobs" },
            { "@type": "ListItem", "position": 3, "name": job.job_info.job_titles[0], "item": jobUrl }
        ]
    };
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
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
                />
            )}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/</g, "\\u003c") }}
            />
            {/* Header */}
            <JobDetailsHeader job={job} />
            {/* Job Description */}
            <article className="overflow-y-auto min-h-0 py-6">
                <div className="whitespace-pre-wrap text-sm leading-8 text-gray-700 font-medium px-5">
                    {formatJobText(job.raw_text)}
                </div>
            </article>
        </>
    );
}
