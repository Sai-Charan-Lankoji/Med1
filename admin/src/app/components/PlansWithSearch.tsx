// components/PlansWithSearch.tsx
"use client";

import { useState, useEffect } from "react";
import SearchInput from "@/app/components/SearchInput";
import { Plus } from "lucide-react";
import PlanModal from "@/app/components/PlanModal";
import DeletePlanModal from "@/app/components/DeletePlanModal";
import { Plan } from "@/app/api/plan/route";

export default function PlansWithSearch({
  initialPlans,
  initialError,
  cookieHeader,
}: {
  initialPlans: Plan[];
  initialError: string | null;
  cookieHeader: string;
}) {
  const [plans, setPlans] = useState<Plan[]>(initialPlans || []);
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>(initialPlans || []);
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
    setPlans(initialPlans || []);
    setFilteredPlans(initialPlans || []);
  }, [initialPlans]);

  const refreshPlans = async () => {
    try {
      const response = await fetch('/api/plan', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieHeader || '',
        },
        credentials: 'include',
        cache: 'no-store',
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || `Failed to fetch plans: ${response.status}`);
      }

      // Ensure we set an array even if the response structure is unexpected
      const newPlans = Array.isArray(data.plans) ? data.plans : [];
      console.log('Fetched plans:', newPlans); // Debug log
      setPlans(newPlans);
      setFilteredPlans(newPlans);
    } catch (error) {
      console.error('Error refreshing plans:', error);
      setPlans([]);
      setFilteredPlans([]);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setCurrentPage(1);
    if (!value) {
      setFilteredPlans(plans);
      return;
    }
    const lowerQuery = value.toLowerCase();
    const filtered = Array.isArray(plans) ? plans.filter((plan) =>
      plan.name.toLowerCase().includes(lowerQuery)
    ) : [];
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

  // Ensure filteredPlans is an array before filtering
  const activePlans = Array.isArray(filteredPlans) ? filteredPlans.filter((plan) => plan.isActive) : [];
  const inactivePlans = Array.isArray(filteredPlans) ? filteredPlans.filter((plan) => !plan.isActive) : [];

  const activePaginated = paginatePlans(activePlans);
  const inactivePaginated = paginatePlans(inactivePlans);

  const handlePageChange = (page: number, section: "active" | "inactive") => {
    if (page >= 1 && page <= (section === "active" ? activePaginated.totalPages : inactivePaginated.totalPages)) {
      setCurrentPage(page);
    }
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
                className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up border border-base-200"
              >
                <div className="card-body p-6">
                  <div className="text-center mb-6">
                    <h3 className="card-title text-xl font-semibold text-base-content">{plan.name}</h3>
                    <p className="text-sm text-base-content/70 mt-1">{plan.description || "No description"}</p>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-primary">${plan.price}</span>
                      <span className="text-base-content/70"> / month</span>
                    </div>
                    {(plan.discount ?? 0) > 0 && (
                      <span className="badge badge-outline badge-md mt-3 text-accent border-accent">
                        {plan.discount}% Off
                      </span>
                    )}
                  </div>
                  <ul className="space-y-2 text-base-content/80">
                    <li className="flex items-center gap-2">
                      <span className="badge badge-sm bg-info text-info-content">✓</span>
                      {plan.no_stores} Stores
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="badge badge-sm bg-info text-info-content">✓</span>
                      {plan.commission_rate}% Commission
                    </li>
                    {plan.features?.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="badge badge-sm bg-info text-info-content">✓</span>
                        {feature}
                      </li>
                    ))}
                    <li className="flex items-center gap-2">
                      <span
                        className={`badge badge-sm ${
                          plan.isActive ? "bg-success text-success-content" : "bg-error text-error-content"
                        }`}
                      >
                        {plan.isActive ? "✓" : "✗"}
                      </span>
                      {plan.isActive ? "Active" : "Inactive"}
                    </li>
                  </ul>
                  <div className="card-actions justify-end mt-6 flex gap-2">
                    <button
                      onClick={() => {
                        setEditingPlan(plan);
                        setIsPlanModalOpen(true);
                      }}
                      className="btn btn-sm btn-primary text-primary-content hover:scale-105 transition-all duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setDeletingPlanId(plan.id);
                        setDeletingPlanName(plan.name);
                        setIsDeleteOpen(true);
                      }}
                      className="btn btn-sm btn-error text-error-content hover:scale-105 transition-all duration-300"
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
                  className="join-item btn btn-outline text-neutral-content border-neutral hover:scale-105 transition-all duration-300"
                  onClick={() => handlePageChange(currentPage - 1, section)}
                  disabled={currentPage === 1}
                >
                  «
                </button>
                {Array.from(
                  { length: section === "active" ? activePaginated.totalPages : inactivePaginated.totalPages },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    className={`join-item btn btn-outline text-neutral-content border-neutral hover:scale-105 transition-all duration-300 ${
                      currentPage === page ? "btn-active" : ""
                    }`}
                    onClick={() => handlePageChange(page, section)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="join-item btn btn-outline text-neutral-content border-neutral hover:scale-105 transition-all duration-300"
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
    <div className="p-6 min-h-screen bg-base-100 animate-fade-in">
      <div className="mb-6 flex justify-between items-center animate-slide-in-left">
        <h1 className="text-4xl font-bold text-primary">Subscription Plans</h1>
        <div className="flex gap-4">
          <div className="transform transition-all duration-300 hover:scale-105">
            <SearchInput value={query} onChange={handleSearch} placeholder="Search plans..." />
          </div>
          <button
            onClick={() => {
              setEditingPlan(null);
              setIsPlanModalOpen(true);
            }}
            className="btn btn-md btn-primary text-primary-content hover:scale-105 transition-all duration-300 shadow-md"
          >
            <Plus className="h-6 w-6" /> Add New Plan
          </button>
        </div>
      </div>

      {initialError ? (
        <div className="alert alert-error animate-shake shadow-md">
          <span className="text-error-content">{initialError}</span>
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <h3 className="text-2xl font-semibold text-base-content">No plans found</h3>
          <p className="mt-2 text-base-content/60">
            {plans.length === 0 ? "Start by adding a new plan." : "Try adjusting your search."}
          </p>
          {plans.length === 0 && (
            <button
              onClick={() => {
                setEditingPlan(null);
                setIsPlanModalOpen(true);
              }}
              className="mt-6 btn btn-outline text-primary border-primary hover:scale-105 transition-all duration-300 shadow-md rounded-full"
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
          <PlanModal
            isOpen={isPlanModalOpen}
            onClose={() => setIsPlanModalOpen(false)}
            plan={editingPlan}
            onPlanSaved={refreshPlans}
            cookieHeader={cookieHeader}
          />
          <DeletePlanModal
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            planId={deletingPlanId}
            planName={deletingPlanName}
            onPlanDeleted={refreshPlans}
            cookieHeader={cookieHeader}
          />
        </>
      )}
    </div>
  );
}