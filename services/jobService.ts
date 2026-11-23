// @/services/jobService.ts
import { Job, JobsResponse, GetJobsArgs } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getJobs = async (args: GetJobsArgs): Promise<JobsResponse> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout (HF cold start)

    try {
        const params = new URLSearchParams();
        if (args.page) params.set("page", args.page.toString());
        if (args.limit) params.set("limit", args.limit.toString());
        if (args.search) params.set("search", args.search);
        if (args.location) params.set("location", args.location);
        if (args.company) params.set("company", args.company);
        if (args.specialization) params.set("specialization", args.specialization);
        if (args.date_posted) params.set("date_posted", args.date_posted);

        const res = await fetch(`${API_BASE_URL}/jobs?${params.toString()}`, {
            next: { revalidate: 15 }, // Revalidate every 15 seconds
            signal: controller.signal,
            headers: {
                "Accept": "application/json",
            }
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
            throw new Error(`Failed to fetch jobs: ${res.statusText}`);
        }

        const json = await res.json();
        return json.data;
    } catch (error) {
        clearTimeout(timeoutId);
        console.error("Fetch Error (getJobs):", error);
        return {
            jobs: [],
            metadata: {
                page: 1,
                limit: 10,
                total_count: 0,
                total_pages: 0,
                has_next_page: false,
                has_previous_page: false,
            }
        };
    }
};

export const getJobById = async (jobId: string): Promise<Job | null> => {
    try {
        const res = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
            next: { revalidate: 3600 },
            headers: {
                "Accept": "application/json",
            }
        });

        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error(`Failed to fetch job ${jobId}: ${res.statusText}`);
        }

        const json = await res.json();
        return json.data;
    } catch (error) {
        // Network/backend failures are not 404s: rethrow so the route's
        // error boundary handles them instead of rendering not-found.
        console.error("Fetch Error (getJobById):", error);
        throw error;
    }
};