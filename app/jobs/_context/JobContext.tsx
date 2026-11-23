/**
 * JobContext: Optimistic UI Bridge
 *
 * PURPOSE:
 * Client-side state bridge to solve navigation latency in Next.js App Router.
 *
 * WHY THIS PATTERN?
 * 1. Instant Feedback: triggers the UI transition immediately when a user
 *    clicks a JobCard.
 * 2. Real content, not a spinner: the card already holds the job's data, so
 *    the details panel opens instantly with the real header (and description
 *    when the list payload includes it) while the server-rendered details
 *    stream in. A skeleton is only used when no job data is available
 *    (e.g. a direct load of /jobs/[id]).
 * 3. Layout Synchronization: ensures the 3-column grid layout expands
 *    instantly without waiting for the Server Component (JobDetails) to load.
 */

"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Job } from "@/types";

interface JobContextType {
    /** The job whose card was clicked, or null when no details are open. */
    activeJob: Job | null;
    /** Convenience derived value: activeJob?._id ?? null */
    activeJobId: string | null;
    setActiveJob: (job: Job | null) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export function JobProvider({ children }: { children: ReactNode }) {
    const [activeJob, setActiveJob] = useState<Job | null>(null);

    return (
        <JobContext.Provider value={{ activeJob, activeJobId: activeJob?._id ?? null, setActiveJob }}>
            {children}
        </JobContext.Provider>
    );
}

export function useJobContext() {
    const context = useContext(JobContext);
    if (context === undefined) {
        throw new Error("useJobContext must be used within a JobProvider");
    }
    return context;
}
