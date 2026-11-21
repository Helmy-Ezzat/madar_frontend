"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getAppliedState } from "@/services/officeDashboardService";

export default function ApplyButton({ jobId }: { jobId: string }) {
    const { user } = useAuth();
    const [applied, setApplied] = useState(false);

    useEffect(() => {
        if (!user) return;
        getAppliedState(jobId)
            .then((res) => setApplied(!!res.data?.applied))
            .catch(() => {});
    }, [user, jobId]);

    if (applied) {
        return (
            <span className="inline-flex items-center gap-2 py-2 px-3.5 bg-primary-tint text-primary rounded-lg text-xs font-bold">
                قدّمت على الوظيفة دي ✅
            </span>
        );
    }

    return (
        <Link
            href={`/jobs/${jobId}/apply`}
            className="pointer-events-auto inline-flex items-center justify-center gap-2 py-2 px-3.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
        >
            قدّم على الوظيفة
        </Link>
    );
}
