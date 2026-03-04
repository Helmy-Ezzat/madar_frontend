/**
 * JobContext: Optimistic UI Bridge
 * * PURPOSE:
 * This context acts as a client-side state bridge to solve navigation latency in Next.js App Router.
 * * WHY THIS PATTERN?
 * 1. Instant Feedback: Triggers the UI transition immediately when a user clicks a JobCard.
 * 2. Bypass Server Latency: Allows showing a Loading Skeleton in the details panel (client-side) 
 * before the server even acknowledges the route change or starts fetching data.
 * 3. Layout Synchronization: Ensures the 3-column grid layout expands instantly without waiting 
 * for the Server Component (JobDetails) to load.
 */

"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface JobContextType {
    activeJobId: string | null;
    setActiveJobId: (id: string | null) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export function JobProvider({ children }: { children: ReactNode }) {
    const [activeJobId, setActiveJobId] = useState<string | null>(null);

    return (
        <JobContext.Provider value={{ activeJobId, setActiveJobId }}>
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
