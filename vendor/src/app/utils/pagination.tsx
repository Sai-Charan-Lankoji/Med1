import React, { useMemo } from "react";

interface PaginationProps<T> {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalItems: number;
  data: T[];
}

const Pagination = <T extends { [key: string]: any }>({
  currentPage,
  setCurrentPage,
  totalItems,
  data,
}: PaginationProps<T>) => {
  const pageSize = 6;

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
    <div className="flex justify-between items-center mt-4 text-gray-500 text-xs">
      <div className="mr-4">
        Showing {start} - {end} of {totalItems} items
      </div>
      <div className="flex space-x-2">
        <button 
          onClick={previousPage} 
          disabled={!canPreviousPage} 
          className="cursor-pointer disabled:opacity-50"
        >
          prev
        </button>
        <span className="tex-gray-00">
          page {currentPage + 1} of {pageCount}
        </span>
        <button 
          onClick={nextPage} 
          disabled={!canNextPage} 
          className="cursor-pointer disabled:opacity-50"
        >
          next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
