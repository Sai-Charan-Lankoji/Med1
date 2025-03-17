import React, { useMemo } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";

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

  const currentData = useMemo(() => {
    const offset = currentPage * pageSize;
    return data.slice(offset, offset + pageSize);
  }, [currentPage, pageSize, data]);

  const start = totalItems > 0 ? currentPage * pageSize + 1 : 0;
  const end =
    totalItems > 0 ? Math.min((currentPage + 1) * pageSize, totalItems) : 0;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center">
        <span className="text-sm">
          Showing {start} - {end} of {totalItems} items
        </span>
        <span className="text-sm">
          Page {currentPage + 1} of {pageCount}
        </span>
      </div>

      <div className="flex justify-center">
        <div className="join">
          {/* Previous button */}
          <button
            className="join-item btn btn-md"
            onClick={previousPage}
            disabled={!canPreviousPage}
          >
            <ArrowLeft size={16} />
          </button>

          {/* First page button */}
          {pageCount > 5 && currentPage > 2 && (
            <>
              <button
                className={`join-item btn btn-md ${currentPage === 0 ? "btn-active" : ""}`}
                onClick={() => setCurrentPage(0)}
              >
                1
              </button>
              {currentPage > 3 && (
                <button className="join-item btn btn-md btn-disabled">...</button>
              )}
            </>
          )}

          {/* Page buttons */}
          {[...Array(pageCount)].map((_, i) => {
            // Show pages around current page
            if (
              i === 0 || // Always show first page
              i === pageCount - 1 || // Always show last page
              (i >= currentPage - 1 && i <= currentPage + 1) || // Show pages around current
              (currentPage < 2 && i < 4) || // Show first few pages when at start
              (currentPage > pageCount - 3 && i > pageCount - 5) // Show last few pages when at end
            ) {
              return (
                <button
                  key={i}
                  className={`join-item btn btn-md ${
                    currentPage === i ? "btn-active" : ""
                  }`}
                  onClick={() => setCurrentPage(i)}
                >
                  {i + 1}
                </button>
              );
            }
            return null;
          }).filter(Boolean)}

          {/* Last page button with ellipsis */}
          {pageCount > 5 && currentPage < pageCount - 3 && (
            <>
              {currentPage < pageCount - 4 && (
                <button className="join-item btn btn-md btn-disabled">...</button>
              )}
              <button
                className={`join-item btn btn-md ${
                  currentPage === pageCount - 1 ? "btn-active" : ""
                }`}
                onClick={() => setCurrentPage(pageCount - 1)}
              >
                {pageCount}
              </button>
            </>
          )}

          {/* Next button */}
          <button
            className="join-item btn btn-md"
            onClick={nextPage}
            disabled={!canNextPage}
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;