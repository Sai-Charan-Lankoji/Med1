// components/VendorsWithSearch.tsx
"use client";

import { useState } from "react";
import VendorsList from "@/app/components/VendorsList";
import SearchInput from "@/app/components/SearchInput";

type Vendor = {
  id: string;
  company_name: string;
  contact_name: string;
  registered_number: string;
  status: string;
  contact_email: string;
  contact_phone_number: string;
  tax_number: string;
  plan: string;
  plan_id: string;
  next_billing_date: string;
  business_type: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  address: {
    id: string;
    company: string;
    first_name: string;
    last_name: string;
    address_1: string;
    address_2: string;
    city: string;
    province: string;
    postal_code: string;
    phone: string;
    vendor_address_id: string;
  }[];
};

export default function VendorsWithSearch({
  initialVendors,
  initialError,
}: {
  initialVendors: Vendor[];
  initialError: string | null;
}) {
  const [filteredVendors, setFilteredVendors] = useState(initialVendors);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const vendorsPerPage = 5;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setCurrentPage(1);

    if (!value) {
      setFilteredVendors(initialVendors);
      return;
    }

    const lowerQuery = value.toLowerCase();
    const filtered = initialVendors.filter(
      (vendor) =>
        vendor.company_name.toLowerCase().includes(lowerQuery) ||
        vendor.contact_name.toLowerCase().includes(lowerQuery) ||
        vendor.contact_email.toLowerCase().includes(lowerQuery)
    );
    setFilteredVendors(filtered);
  };
  

  const totalVendors = filteredVendors.length;
  const totalPages = Math.ceil(totalVendors / vendorsPerPage);
  const startIndex = (currentPage - 1) * vendorsPerPage;
  const endIndex = startIndex + vendorsPerPage;
  const paginatedVendors = filteredVendors.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
    <div className="p-6 min-h-screen bg-base-100 animate-fade-in">
      <div className="mb-6 flex justify-between items-center animate-slide-in-left">
        <h1 className="text-2xl font-bold text-primary">Vendors</h1>
        <div className="transform transition-all duration-300 hover:scale-105">
          <SearchInput value={query} onChange={handleSearch} placeholder="Search vendors..." />
        </div>
      </div>

      <div className="animate-slide-in-up">
        <VendorsList vendors={paginatedVendors} error={initialError} />
      </div>

      {totalVendors > vendorsPerPage && (
        <div className="mt-6 flex justify-center animate-fade-in-up">
          <div className="join">
            <button
              className="join-item btn btn-outline text-neutral-content border-neutral hover:scale-105 transition-all duration-300 disabled:opacity-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              «
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`join-item btn btn-outline text-neutral-content border-neutral hover:scale-105 transition-all duration-300 ${
                  currentPage === page ? "btn-active" : ""
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="join-item btn btn-outline text-neutral-content border-neutral hover:scale-105 transition-all duration-300 disabled:opacity-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        </div>

      )}
      
  </div>
  </>
  );
}