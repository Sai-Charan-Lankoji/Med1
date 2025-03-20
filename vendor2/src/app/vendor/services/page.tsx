"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, Package, Store, ShieldCheck, BadgeCheck } from "lucide-react";
import { useGetStores } from "@/app/hooks/store/useGetStores";
import { useGetPlans } from "@/app/hooks/plan/useGetPlans";
import { useGetPlan } from "@/app/hooks/plan/useGetPlan";
import { useUpdateVendorPlan } from "@/app/hooks/vendor/useUpdateVendorPlan";
import { useGetVendor } from "@/app/hooks/vendor/useGetVendor";
import { useToast } from "@/hooks/use-toast";
import { plan_id } from "@/app/utils/constant";
import { motion } from "framer-motion";

export default function ServicesDashboard() {
  const { toast } = useToast();
  const { data: stores, isLoading: storesLoading } = useGetStores();
  const { data: plans, isLoading: plansLoading } = useGetPlans();
  const { data: vendor, isLoading: vendorLoading } = useGetVendor();
  const { data: currentPlan, isLoading: planLoading, refetch: refetchPlan } = useGetPlan(
    plan_id || vendor?.plan_id || ""
  );

  const { mutateAsync: updatePlanMutation, isLoading: updateLoading } = useUpdateVendorPlan();
  const [activePlan, setActivePlan] = useState(null);
  const currentStores = stores?.length || 0;

  useEffect(() => {
    if (currentPlan) {
      setActivePlan(currentPlan);
    } else if (vendor?.plan_id && plans) {
      const vendorPlan = plans.find((plan) => plan.id === vendor.plan_id);
      setActivePlan(vendorPlan || null);
    }
  }, [currentPlan, vendor, plans]);

  const handleUpgradePlan = async (plan) => {
    try {
      await updatePlanMutation({
        plan_id: plan.id,
        plan: plan.name,
      });

      setActivePlan(plan);
      await refetchPlan();

      toast({
        title: "Success",
        description: `Your plan has been upgraded to ${plan.name}`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (storesLoading || plansLoading || vendorLoading || planLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!activePlan || !plans) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-base-content">No plans available</p>
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
          Your current plan: <span className="font-semibold">{activePlan?.name || "N/A"}</span>
        </p>
      </div>

      {/* Current Plan Usage */}
      <div className="card card-border bg-base-100 overflow-hidden">
        <div className="card-body bg-primary text-primary-content  p-6">
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
                  <span className="text-success">
                    {Math.max(0, (activePlan?.no_stores || 0) - currentStores)}
                  </span>
                )}
              </div>
              <div className="stat-desc mt-1">Stores available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div key={plan.id} className="group h-full">
              <div className={`card card-border h-full bg-base-100 overflow-hidden transition-all duration-300 ${
                plan.id === activePlan?.id 
                  ? "ring-2 ring-primary" 
                  : "hover:shadow-md"
              }`}>
                <div className={`p-6 ${
                  plan.id === activePlan?.id 
                    ? "bg-primary text-primary-content" 
                    : "bg-base-200/50"
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      {plan.id === activePlan?.id && (
                        <div className="badge badge-sm badge-outline mt-1">CURRENT</div>
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
                        <li key={idx} className="flex items-start gap-2 text-base-content">
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