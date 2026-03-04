"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useTransition } from "react";

interface PaginationProps {
  metadata: {
    page: number;
    limit: number;
    total_count: number;
    total_pages: number;
  };
}

export default function Pagination({ metadata }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // to handle the delay between pages 
  const [isPending, startTransition] = useTransition();

  const currentPage = metadata.page;
  const totalPages = metadata.total_pages;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // to handle the navigation programmatically
  const handleNavigate = (pageNumber: number) => {
    if (pageNumber === currentPage) return; // if the same page, do nothing
    
    startTransition(() => {
      // push the new URL, and scroll to top
      router.push(createPageURL(pageNumber), { scroll: true });
    });
  };

  const startPage = currentPage - Math.min(currentPage - 1, 2);

  if (totalPages <= 1) return null;

  return (
    <nav
      data-pending={isPending ? "" : undefined}
      // if there is a loading (Pending), reduce the opacity to make the user feel that there is an action happening
      className={`flex flex-col items-center gap-3 py-6 px-4 transition-opacity duration-300 data-[pending=true]:opacity-50 data-[pending=true]:pointer-events-none data-[pending=false]:opacity-100`}
      aria-label="التنقل بين صفحات الوظائف"
    >
      {/* Page Info (Mobile) */}
      <p className="text-xs text-gray-600 font-medium lg:hidden">
        صفحة {currentPage} من {totalPages}
      </p>

      {/* Pagination Controls */}
      <ul className="flex items-center justify-center gap-1 lg:gap-2" dir="ltr">
        
        {/* Previous Button (Desktop Only) */}
        {currentPage === 1 ? (
          <li className="">
            <span
              className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed"
              aria-disabled="true"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </span>
          </li>
        ) : (
          <li className="">
            <button
              onClick={() => handleNavigate(currentPage - 1)}
              className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-white hover:bg-gray-100 active:bg-gray-200 transition-colors shadow-sm border border-gray-200"
              aria-label={`الذهاب إلى الصفحة ${currentPage - 1}`}
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>
          </li>
        )}

        {/* First Page + Ellipsis */}
        {metadata.page >= 4 && totalPages > 5 && (
          <>
            <li>
              <button
                onClick={() => handleNavigate(1)}
                className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-white hover:bg-gray-100 text-gray-700 text-xs lg:text-sm font-medium transition-colors shadow-sm border border-gray-200"
              >
                1
              </button>
            </li>
            {metadata.page - 2 > 2 && (
              <li className="flex items-center justify-center w-6 h-8 lg:w-8 lg:h-10 text-gray-400 text-xs">
                <span aria-hidden="true">...</span>
              </li>
            )}
          </>
        )}

        {/* Page Numbers */}
        {[...Array(Math.min(5, totalPages))].map((_, index) => {
          const pageNumber = startPage + index;
          if (pageNumber > totalPages) return null;

          const isActive = pageNumber === currentPage;

          return (
            <li key={pageNumber}>
              {isActive ? (
                <span
                  className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-primary2 cursor-default text-white text-xs lg:text-sm font-bold shadow-md"
                  aria-current="page"
                >
                  {pageNumber}
                </span>
              ) : (
                <button
                  onClick={() => handleNavigate(pageNumber)}
                  className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-white hover:bg-gray-100 active:bg-gray-200 text-gray-700 text-xs lg:text-sm font-medium transition-colors shadow-sm border border-gray-200"
                >
                  {pageNumber}
                </button>
              )}
            </li>
          );
        })}

        {/* Last Page + Ellipsis */}
        {totalPages > 5 && currentPage <= totalPages / 2 && (
          <>
            {totalPages > 6 && (
              <li className="flex items-center justify-center w-6 h-8 lg:w-8 lg:h-10 text-gray-400 text-xs">
                <span aria-hidden="true">...</span>
              </li>
            )}
            <li>
              <button
                onClick={() => handleNavigate(totalPages)}
                className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-white hover:bg-gray-100 text-gray-700 text-xs lg:text-sm font-medium transition-colors shadow-sm border border-gray-200"
              >
                {totalPages}
              </button>
            </li>
          </>
        )}

        {/* Next Button (Desktop Only) */}
        {currentPage === totalPages ? (
          <li className="hidden lg:block">
            <span
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed"
              aria-disabled="true"
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </span>
          </li>
        ) : (
          <li className="">
            <button
              onClick={() => handleNavigate(currentPage + 1)}
              className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-white hover:bg-gray-100 active:bg-gray-200 transition-colors shadow-sm border border-gray-200"
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </li>
        )}
      </ul>

      {/* Page Info (Desktop) */}
      <p className="hidden lg:block text-sm text-gray-500">
        عرض <span className="font-semibold text-gray-700">{Math.min(metadata.limit * (currentPage - 1) + 1, metadata.total_count)}</span>
        {' '}-{' '}
        <span className="font-semibold text-gray-700">{Math.min(metadata.limit * currentPage, metadata.total_count)}</span>
        {' '}من أصل{' '}
        <span className="font-semibold text-gray-700">{metadata.total_count}</span>
        {' '}وظيفة
      </p>
    </nav>
  );
}