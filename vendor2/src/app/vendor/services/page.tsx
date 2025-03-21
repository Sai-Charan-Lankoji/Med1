"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle,  Store, ShieldCheck, BadgeCheck } from "lucide-react";
import { useGetStores } from "@/app/hooks/store/useGetStores";
import { useGetPlans } from "@/app/hooks/plan/useGetPlans";
import { useGetPlan } from "@/app/hooks/plan/useGetPlan";
import { useUpdateVendorPlan } from "@/app/hooks/vendor/useUpdateVendorPlan";
import { useGetVendor } from "@/app/hooks/vendor/useGetVendor";
import { useToast } from "@/hooks/use-toast";


export default function ServicesDashboard() {
  const { toast } = useToast();
  const { data: stores, isLoading: storesLoading } = useGetStores();
  const { data: plans, isLoading: plansLoading } = useGetPlans();
  const { data: vendor, isLoading: vendorLoading, refetch: refetchVendor } = useGetVendor();
  
  // Only fetch plan data if vendor_id exists
  const vendorPlanId = vendor?.plan_id || "";
  const skipPlanFetch = !vendorPlanId;
  const { data: currentPlan, isLoading: planLoading, refetch: refetchPlan } = useGetPlan(vendorPlanId);

  const { mutateAsync: updatePlanMutation, isLoading: updateLoading } = useUpdateVendorPlan();
  const [activePlan, setActivePlan] = useState(null);
  const currentStores = stores?.length || 0;

  useEffect(() => {
    // Set active plan based on available data
    if (currentPlan) {
      setActivePlan(currentPlan);
    } else if (vendor?.plan_id && plans?.length) {
      const vendorPlan = plans.find((plan) => plan.id === vendor.plan_id);
      setActivePlan(vendorPlan || plans[0]); // Fallback to first plan if not found
    } else if (plans?.length) {
      // If no vendor plan is set but plans are available, default to the first one
      setActivePlan(plans[0]);
    }
  }, [currentPlan, vendor, plans]);

  const handleUpgradePlan = async (plan) => {
    try {
      await updatePlanMutation({
        plan_id: plan.id,
        plan: plan.name,
      });

      // First refresh vendor data to get updated plan_id
      await refetchVendor();
      // Then refresh plan data based on new plan_id
      await refetchPlan();

      // Explicitly set the active plan to avoid UI delay
      setActivePlan(plan);

      toast({
        title: "Success",
        description: `Your plan has been upgraded to ${plan.name}`,
        variant: "default",
      });
    } catch (error) {
      console.error("Plan upgrade error:", error);
      toast({
        title: "Error",
        description: "Failed to update plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Show loading state while waiting for data
  if (storesLoading || plansLoading || vendorLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Modify the condition to check if we have plans available
  if (!plans?.length) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="alert alert-warning max-w-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <span>No subscription plans are currently available. Please try again later.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 min-h-screen">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl md:text-4xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
          <ShieldCheck className="h-6 w-6 md:h-8 md:w-8" /> Service Plans
        </h1>
        <p className="text-base md:text-lg text-base-content/70">
          Your current plan: <span className="font-semibold">{activePlan?.name || "None Selected"}</span>
        </p>
      </div>

      {/* Current Plan Usage */}
      {activePlan && (
        <div className="card card-border bg-base-100">
          <div className="card-body bg-primary text-primary-content p-6">
            <h2 className="card-title text-xl md:text-2xl flex items-center gap-2">
              <BadgeCheck className="h-5 w-5" /> Current Plan Overview
            </h2>
            <p className="text-sm opacity-80">{activePlan?.description || "No description available"}</p>
          </div>
          <div className="card-body p-6">
            <div className="stats stats-vertical sm:stats-horizontal shadow-none w-full">
              <div className="stat bg-base-100 px-4">
                <div className="stat-title text-base-content/70">Current Plan</div>
                <div className="stat-value text-primary text-2xl">{activePlan?.name}</div>
                <div className="stat-desc mt-1">
                  <div className="badge badge-primary badge-soft">
                    ${activePlan?.price}/month
                  </div>
                </div>
              </div>
              <div className="stat bg-base-100 px-4">
                <div className="stat-title text-base-content/70">Store Usage</div>
                <div className="stat-value text-2xl">
                  <span className="text-primary">{currentStores}</span>
                  <span className="text-base-content/70 text-xl">/</span>
                  <span>{activePlan?.no_stores === "unlimited" ? "∞" : activePlan?.no_stores || 0}</span>
                </div>
                <div className="stat-desc mt-1">Stores used</div>
              </div>
              <div className="stat bg-base-100 px-4">
                <div className="stat-figure text-primary">
                  <Store className="w-8 h-8 opacity-80" />
                </div>
                <div className="stat-title text-base-content/70">Remaining Capacity</div>
                <div className="stat-value text-2xl">
                  {activePlan?.no_stores === "unlimited" ? (
                    <span>∞</span>
                  ) : (
                    <span className="text-primary">
                      {Math.max(0, (activePlan?.no_stores || 0) - currentStores)}
                    </span>
                  )}
                </div>
                <div className="stat-desc mt-1">Stores available</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
  <div key={plan.id} className="group h-full">
    <div className={`card card-border h-full bg-base-100 overflow-hidden ${
      plan.id === activePlan?.id 
        ? "ring-2 ring-primary" 
        : "hover:shadow-md"
    }`}>
      {/* Use proper card structure to fix border radius issues */}
      <div className={`p-6 rounded-t-box ${
        plan.id === activePlan?.id 
          ? "bg-primary text-primary-content" 
          : "bg-base-200/50"
      }`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">{plan.name}</h3>
            {plan.id === activePlan?.id && (
              <div className="badge  badge-neutral mt-1">
                 <svg className="size-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="currentColor" strokeLinejoin="miter" strokeLinecap="butt"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeLinecap="square" stroke-miterlimit="10" strokeWidth="2"></circle><polyline points="7 13 10 16 17 8" fill="none" stroke="currentColor" strokeLinecap="square" stroke-miterlimit="10" strokeWidth="2"></polyline></g></svg>
                 
                Active</div>
            )}
          </div>
          <div className="text-end">
            <div className="text-2xl font-bold">${plan.price}</div>
            <div className="text-xs opacity-80">per month</div>
          </div>
        </div>
      </div>
      
      <div className="card-body p-6 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="text-sm text-base-content/70 mb-3">
            {plan.no_stores === "unlimited" 
              ? "Unlimited stores" 
              : `Up to ${plan.no_stores} stores`}
          </div>
          
          <div className="divider my-1"></div>
          
          <ul className="space-y-3 min-h-44">
            {plan?.features?.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-success mt-0.5 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <button
          className={`btn w-full mt-6 ${
            plan.id === activePlan?.id 
              ? "btn-disabled" 
              : "btn-primary btn-soft"
          }`}
          onClick={() => handleUpgradePlan(plan)}
          disabled={plan.id === activePlan?.id || updateLoading}
        >
          {updateLoading && plan.id !== activePlan?.id ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : null}
          {plan.id === activePlan?.id ? "Current Plan" : `Upgrade to ${plan.name}`}
        </button>
      </div>
    </div>
  </div>
))}
        </div>
      </div>
    </div>
  );
}