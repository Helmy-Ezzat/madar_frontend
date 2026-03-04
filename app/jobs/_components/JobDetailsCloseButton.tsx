"use client";

import { memo, useMemo, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useJobContext } from "../_context/JobContext";

function JobDetailsCloseButtonComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setActiveJobId } = useJobContext();

  // Memoize the href calculation
  const href = useMemo(() => {
    const queryParams = new URLSearchParams(searchParams.toString());
    queryParams.delete("jobId");

    return queryParams.toString() ? `/jobs?${queryParams.toString()}` : "/jobs";
  }, [searchParams]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();

    // Clear optimistic state immediately
    setActiveJobId(null);

    // Save scroll position
    const scrollY = window.scrollY;
    sessionStorage.setItem('jobs-scroll-position', scrollY.toString());

    // Navigate
    router.push(href);
  }, [href, router, setActiveJobId]);
  return (
    <Link
      href={href}
      onClick={handleClick}
      scroll={false}
      replace
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
