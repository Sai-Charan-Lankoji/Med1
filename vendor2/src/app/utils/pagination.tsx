import React, { useMemo } from "react";
import { ArrowRight, ArrowLeft, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps<T> {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalItems: number;
  data: T[];
}

const Pagination = <T,>({
  currentPage,
  setCurrentPage,
  totalItems,
  data,
}: PaginationProps<T>) => {
  const pageSize = 8;

  const pageCount = useMemo(() => {
    return Math.ceil(totalItems / pageSize);
  }, [totalItems, pageSize]);

  const canNextPage = useMemo(
    () => currentPage < pageCount - 1,
    [currentPage, pageCount]
  );

  const canPreviousPage = useMemo(() => currentPage > 0, [currentPage]);

  const nextPage = () => {
    if (canNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (canPreviousPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(0);
  };

  const goToLastPage = () => {
    setCurrentPage(pageCount - 1);
  };

  const start = totalItems > 0 ? currentPage * pageSize + 1 : 0;
  const end =
    totalItems > 0 ? Math.min((currentPage + 1) * pageSize, totalItems) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 w-full gap-4 items-center bg-base-100 h-auto p-4 rounded-b-2xl">
      {/* Left section */}
      <div className="text-sm text-base-content/70 text-center sm:text-left">
        Showing <span className="font-medium">{start}-{end}</span> of <span className="font-medium">{totalItems}</span> items
      </div>
      
      {/* Center section - Pagination buttons (moved from right) */}
      <div className="flex justify-center">
        <div className="join">
          {/* First page button */}
          <button
            className="join-item btn btn-sm hidden sm:flex"
            onClick={goToFirstPage}
            disabled={!canPreviousPage}
            aria-label="First page"
          >
            <ChevronsLeft size={16} />
          </button>

          {/* Previous button */}
          <button
            className="join-item btn btn-sm"
            onClick={previousPage}
            disabled={!canPreviousPage}
            aria-label="Previous page"
          >
            <ArrowLeft size={16} />
          </button>

          {/* Simplified page number buttons that work well on all screen sizes */}
          {pageCount <= 7 ? (
            // If we have 7 or fewer pages, show all page numbers
            [...Array(pageCount)].map((_, i) => (
              <button
                key={i}
                className={`join-item btn btn-sm ${
                  currentPage === i ? "btn-active" : ""
                }`}
                onClick={() => setCurrentPage(i)}
                aria-label={`Page ${i + 1}`}
                aria-current={currentPage === i ? "page" : undefined}
              >
                {i + 1}
              </button>
            ))
          ) : (
            // If we have more than 7 pages, show a condensed version
            <>
              {/* First page or current range */}
              {[...Array(Math.min(3, pageCount))].map((_, i) => {
                if (currentPage <= 2 || i === 0) {
                  return (
                    <button
                      key={i}
                      className={`join-item btn btn-sm ${
                        currentPage === i ? "btn-active" : ""
                      }`}
                      onClick={() => setCurrentPage(i)}
                      aria-current={currentPage === i ? "page" : undefined}
                    >
                      {i + 1}
                    </button>
                  );
                }
                return null;
              })}

              {/* Ellipsis for pages between visible groups */}
              {currentPage > 2 && currentPage < pageCount - 3 && (
                <>
                  {currentPage > 3 && <button className="join-item btn btn-sm btn-disabled">...</button>}
                  <button
                    className="join-item btn btn-sm btn-active"
                    aria-current="page"
                  >
                    {currentPage + 1}
                  </button>
                  {currentPage < pageCount - 4 && <button className="join-item btn btn-sm btn-disabled">...</button>}
                </>
              )}

              {/* Last few pages */}
              {[...Array(Math.min(3, pageCount))].map((_, i) => {
                const pageIndex = pageCount - 3 + i;
                if ((currentPage >= pageCount - 3) || pageIndex === pageCount - 1) {
                  if (pageIndex >= 3) {
                    return (
                      <button
                        key={pageIndex}
                        className={`join-item btn btn-sm ${
                          currentPage === pageIndex ? "btn-active" : ""
                        }`}
                        onClick={() => setCurrentPage(pageIndex)}
                        aria-current={currentPage === pageIndex ? "page" : undefined}
                      >
                        {pageIndex + 1}
                      </button>
                    );
                  }
                }
                return null;
              }).filter(Boolean)}
            </>
          )}

          {/* Next button */}
          <button
            className="join-item btn btn-sm"
            onClick={nextPage}
            disabled={!canNextPage}
            aria-label="Next page"
          >
            <ArrowRight size={16} />
          </button>

          {/* Last page button */}
          <button
            className="join-item btn btn-sm hidden sm:flex"
            onClick={goToLastPage}
            disabled={!canNextPage}
            aria-label="Last page"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
      
      {/* Right section - Page counter (moved from center) */}
      <div className="text-xs text-base-content/70 text-center sm:text-right hidden sm:block">
        Page {currentPage + 1} of {pageCount}
      </div>

      {/* Mobile-only page counter */}
      <div className="text-xs text-base-content/70 text-center sm:hidden col-span-1">
        Page {currentPage + 1} of {pageCount}
      </div>
    </div>
  );
};

export default Pagination;