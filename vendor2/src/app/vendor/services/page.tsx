"use client";

import React, { useEffect, useState } from "react";
import {  CheckCircle } from "lucide-react";
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-6xl mx-auto space-y-8 min-h-screen"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-primary mb-2">Service Plans</h1>
        <p className="text-lg text-base-content/70">
          Your current plan: <span className="font-semibold">{activePlan?.name || "N/A"}</span>
        </p>
      </motion.div>

      {/* Active Plan Overview */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="card bg-base-100 shadow-lg rounded-xl">
          <div className="card-body bg-primary text-primary-content rounded-t-xl">
            <h2 className="card-title text-2xl">Current Plan Overview</h2>
            <p className="text-sm opacity-80">{activePlan?.description || "No description available"}</p>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <h3 className="font-semibold text-lg text-base-content mb-2">Store Usage</h3>
                <p className="text-3xl font-bold text-primary">
                  {currentStores}/
                  {activePlan?.maxStores === "unlimited" ? "∞" : activePlan?.no_stores || 0}
                </p>
                <p className="text-sm text-base-content/70">Stores used</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg text-base-content mb-2">Remaining Capacity</h3>
                <p className="text-3xl font-bold text-primary">
                  {activePlan?.no_stores === "unlimited"
                    ? "Unlimited"
                    : Math.max(0, (activePlan?.no_stores || 0) - currentStores)}
                </p>
                <p className="text-sm text-base-content/70">Stores remaining</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Plans Grid */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="hover:-translate-y-2 transition-transform duration-300"
            >
              <div
                className={`card shadow-lg rounded-xl overflow-hidden ${
                  plan.id === activePlan?.id ? "ring-2 ring-primary" : "bg-base-100"
                }`}
              >
                <div
                  className={`card-body p-6 ${
                    plan.id === activePlan?.id ? "bg-primary text-primary-content" : "bg-base-200"
                  } rounded-t-xl`}
                >
                  <h2 className="card-title text-xl">{plan.name}</h2>
                  <p className="text-2xl font-bold">
                    ${plan.price}/month
                  </p>
                </div>
                <div className="card-body p-6">
                  <ul className="space-y-2 max-h-48 overflow-y-auto">
                    {plan?.features?.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-base-content">
                        <CheckCircle className="w-5 h-5 text-success" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="card-actions p-4">
                  <button
                    className={`btn btn-block ${
                      plan.id === activePlan?.id ? "btn-disabled" : "btn-primary"
                    }`}
                    onClick={() => handleUpgradePlan(plan)}
                    disabled={plan.id === activePlan?.id || updateLoading}
                  >
                    {plan.id === activePlan?.id ? "Current Plan" : `Upgrade to ${plan.name}`}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}