"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useJobContext } from "../_context/JobContext";

function JobDetailsCloseButtonComponent() {
  const searchParams = useSearchParams();
  const { setActiveJobId } = useJobContext();

  // Back to the list with the active filters preserved.
  const href = useMemo(() => {
    const query = searchParams.toString();
    return query ? `/jobs?${query}` : "/jobs";
  }, [searchParams]);

  return (
    <Link
      href={href}
      scroll={false}
      replace
      onClick={() => setActiveJobId(null)}
      className="text-[#828A93] hover:bg-gray-100 rounded-full transition-colors"
      aria-label="إغلاق"
    >
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </Link>
  );
}

export default memo(JobDetailsCloseButtonComponent);
