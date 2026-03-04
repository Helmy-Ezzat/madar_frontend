"use client";

import { ReactNode, useEffect } from "react";
import { useJobContext } from "../_context/JobContext";
import JobDetailsSkeleton from "./skeleton/JobDetailsSkeleton";

interface JobsPageLayoutProps {
    children: ReactNode; // Filters + Jobs List
    details: ReactNode;  // Server Component for Job Details
    serverJobId?: string; // The jobId from server params
}

export default function JobsPageLayout({
    children,
    details,
    serverJobId,
}: JobsPageLayoutProps) {
    const { activeJobId, setActiveJobId } = useJobContext();

    // Sync server state with client state
    useEffect(() => {
        if (serverJobId) {
            // If the server has responded with the ID deeply matching our optimistic ID,
            // we can clear the optimistic state to let the server component take over fully.
            // However, keeping activeJobId might be useful for UI highlights.
            // For now, let's keep it simple: if server matches active, good.
            if (activeJobId !== serverJobId) {
                setActiveJobId(serverJobId);
            }
        } else {
            // If no serverJobId (e.g. user navigated back), clear active
            if (activeJobId && !serverJobId) {
                setActiveJobId(null);
            }
        }
    }, [serverJobId, setActiveJobId]); // removed activeJobId to avoid loops

    // Determine if we should show the details panel
    // Show if we have an optimistic click OR if the server has rendered it
    const showDetails = activeJobId || serverJobId;

    // Grid configuration based on whether details are shown
    const gridConfig = showDetails
        ? "lg:grid-cols-[350px_1fr_1fr]"
        : "lg:grid-cols-[350px_1fr]";

    const isOptimisticLoading = activeJobId && activeJobId !== serverJobId;

    return (
        <div className={`grid grid-cols-1 ${gridConfig} gap-4 max-w-screen-2xl mx-auto transition-[grid-template-columns] duration-500 ease-in-out`}>
            {children}

            {/* 
        This is the magic part:
        1. If we have activeJobId (client click) but NOT serverJobId (yet), show Loading.
        2. If we have serverJobId, show the real Details (rendered by server).
       */}

            {showDetails && (
                <div className="contents">
                    {/* If the server hasn't caught up to the client click yet, show skeleton */}
                    {isOptimisticLoading ? (
                        <JobDetailsSkeleton />
                    ) : (
                        details
                    )}
                </div>
            )}
        </div>
    );
}
