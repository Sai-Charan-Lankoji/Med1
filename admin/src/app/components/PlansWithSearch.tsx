// components/PlansWithSearch.tsx
"use client";

import { useState, useEffect } from "react";
import SearchInput from "@/app/components/SearchInput";
import { Plus } from "lucide-react";
import PlanModal from "@/app/components/PlanModal";
import DeletePlanModal from "@/app/components/DeletePlanModal";

type Plan = {
  id: string;
  name: string;
  price: string;
  features: string[];
  discount: number;
  isActive: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  description?: string;
  no_stores: string;
  commission_rate: number;
};

export default function PlansWithSearch({
  initialPlans,
  initialError,
}: {
  initialPlans: Plan[];
  initialError: string | null;
}) {
  const [filteredPlans, setFilteredPlans] = useState(initialPlans);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);
  const [deletingPlanName, setDeletingPlanName] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);
  const plansPerPage = 5;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const activePlans = filteredPlans.filter((plan) => plan.isActive);
  const inactivePlans = filteredPlans.filter((plan) => !plan.isActive);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setCurrentPage(1);
    if (!value) {
      setFilteredPlans(initialPlans);
      return;
    }
    const lowerQuery = value.toLowerCase();
    const filtered = initialPlans.filter((plan) =>
      plan.name.toLowerCase().includes(lowerQuery)
    );
    setFilteredPlans(filtered);
  };

  const paginatePlans = (plans: Plan[]) => {
    const totalPlans = plans.length;
    const totalPages = Math.ceil(totalPlans / plansPerPage);
    const startIndex = (currentPage - 1) * plansPerPage;
    const endIndex = startIndex + plansPerPage;
    return {
      paginated: plans.slice(startIndex, endIndex),
      totalPages,
      totalPlans,
    };
  };

  const activePaginated = paginatePlans(activePlans);
  const inactivePaginated = paginatePlans(inactivePlans);

  const handlePageChange = (page: number, section: "active" | "inactive") => {
    if (page >= 1 && page <= (section === "active" ? activePaginated.totalPages : inactivePaginated.totalPages)) {
      setCurrentPage(page);
    }
  };

  const handlePlanChanged = () => {
    window.location.reload();
  };

  const renderPlanSection = (title: string, plans: Plan[], section: "active" | "inactive") => (
    <div className="mb-10 animate-slide-in-up">
      <h2 className="text-2xl font-semibold text-base-content mb-6 border-b border-base-300 pb-2">{title}</h2>
      {plans.length > 0 ? (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="card bg-gradient-to-br from-base-200 to-base-300 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 animate-fade-in-up"
              >
                <div className="card-body">
                  <h3 className="card-title text-primary font-bold">{plan.name}</h3>
                  <p className="text-sm text-base-content/80 italic">{plan.description || "No description"}</p>
                  <p><strong>Price:</strong> <span className="text-success">${plan.price}</span></p>
                  <p><strong>Commission:</strong> <span className="text-warning">{plan.commission_rate}%</span></p>
                  <p><strong>Stores:</strong> {plan.no_stores}</p>
                  <p><strong>Discount:</strong> <span className="text-accent">{plan.discount}%</span></p>
                  <p><strong>Features:</strong> {plan.features.join(", ")}</p>
                  <p><strong>Status:</strong> <span className={`badge badge-lg ${plan.isActive ? "badge-success" : "badge-error"}`}>{plan.isActive ? "Active" : "Inactive"}</span></p>
                  <div className="card-actions justify-end mt-4">
                    <button
                      onClick={() => {
                        setEditingPlan(plan);
                        setIsPlanModalOpen(true);
                      }}
                      className="btn btn-sm btn-info text-white hover:scale-110 hover:bg-info/90 transition-all duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setDeletingPlanId(plan.id);
                        setDeletingPlanName(plan.name);
                        setIsDeleteOpen(true);
                      }}
                      className="btn btn-sm btn-error text-white hover:scale-110 hover:bg-error/90 transition-all duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {plans.length > plansPerPage && (
            <div className="mt-6 flex justify-center animate-fade-in-up">
              <div className="join">
                <button
                  className="join-item btn btn-outline hover:scale-105 transition-all duration-300"
                  onClick={() => handlePageChange(currentPage - 1, section)}
                  disabled={currentPage === 1}
                >
                  «
                </button>
                {Array.from({ length: section === "active" ? activePaginated.totalPages : inactivePaginated.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`join-item btn btn-outline ${currentPage === page ? "btn-active scale-110" : ""} hover:scale-105 transition-all duration-300`}
                    onClick={() => handlePageChange(page, section)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="join-item btn btn-outline hover:scale-105 transition-all duration-300"
                  onClick={() => handlePageChange(currentPage + 1, section)}
                  disabled={currentPage === (section === "active" ? activePaginated.totalPages : inactivePaginated.totalPages)}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-base-content/60 text-sm animate-fade-in">No plans in this section.</p>
      )}
    </div>
  );

  if (!isMounted) return null;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-base-100 to-base-200 animate-fade-in">
      <div className="mb-6 flex justify-between items-center animate-slide-in-left">
        <h1 className="text-4xl font-extrabold text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Subscription Plans</h1>
        <div className="flex gap-4">
          <div className="transform transition-all duration-300 hover:scale-105">
            <SearchInput value={query} onChange={handleSearch} placeholder="Search plans..." />
          </div>
          <button
            onClick={() => {
              setEditingPlan(null);
              setIsPlanModalOpen(true);
            }}
            className="btn btn-primary btn-md flex items-center gap-2 hover:scale-110 transition-all duration-300 shadow-lg"
          >
            <Plus className="h-6 w-6" /> Add New Plan
          </button>
        </div>
      </div>

      {initialError ? (
        <div className="alert alert-error animate-shake shadow-lg">
          <span>{initialError}</span>
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <h3 className="text-2xl font-semibold text-base-content">No plans found</h3>
          <p className="mt-2 text-base-content/60">
            {initialPlans.length === 0 ? "Start by adding a new plan." : "Try adjusting your search."}
          </p>
          {initialPlans.length === 0 && (
            <button
              onClick={() => {
                setEditingPlan(null);
                setIsPlanModalOpen(true);
              }}
              className="mt-6 btn btn-outline btn-primary rounded-full hover:scale-110 transition-all duration-300 shadow-md"
            >
              <Plus className="mr-2 h-6 w-6" /> Add Your First Plan
            </button>
          )}
        </div>
      ) : (
        <>
          {renderPlanSection("Active Plans", activePaginated.paginated, "active")}
          {renderPlanSection("Drafts", inactivePaginated.paginated, "inactive")}
        </>
      )}

      {isMounted && (
        <>
          <PlanModal isOpen={isPlanModalOpen} onClose={() => setIsPlanModalOpen(false)} plan={editingPlan} onPlanSaved={handlePlanChanged} />
          <DeletePlanModal
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            planId={deletingPlanId}
            planName={deletingPlanName}
            onPlanDeleted={handlePlanChanged}
          />
        </>
      )}
    </div>
  );
}