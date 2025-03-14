"use client";

import React, { useEffect, useState } from "react";
import { Activity, ShoppingBag, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useGetStores } from "@/app/hooks/store/useGetStores";
import { useGetPlans } from "@/app/hooks/plan/useGetPlans";
import { useGetPlan } from "@/app/hooks/plan/useGetPlan";
import { useUpdateVendorPlan } from "@/app/hooks/vendor/useUpdateVendorPlan"; 
import { useGetVendor } from "@/app/hooks/vendor/useGetVendor";
import { useToast } from "@/hooks/use-toast"
import { plan_id } from "@/app/utils/constant";
 
export default function ServicesDashboard() {
  const { toast } = useToast();
  const { data: stores, isLoading: storesLoading } = useGetStores();
  const { data: plans, isLoading: plansLoading } = useGetPlans();
  const { data: vendor, isLoading: vendorLoading } = useGetVendor();
  const { data: currentPlan, isLoading: planLoading, refetch: refetchPlan } = useGetPlan(plan_id);

  const updatePlanMutation = useUpdateVendorPlan();
  const [activePlan, setActivePlan] = useState(null);
  const currentStores = stores?.length || 0;
  useEffect(() => {
     
        setActivePlan(currentPlan);
     
  }, [currentPlan, plans]);

  const handleUpgradePlan = async (plan) => {
    try {
      await updatePlanMutation.mutateAsync({
        plan_id: plan.id,
        plan: plan.name,
      });
      
      // Immediately update the active plan
      setActivePlan(plan);
      
      // Refetch the current plan data
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

  if (planLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-indigo-600"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto space-y-8 bg-linear-to-br from-indigo-50 to-purple-50 min-h-screen">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold text-indigo-700 mb-2">
            Service Plans
          </h1>
          <p className="text-xl text-purple-600">
            Your current plan:{" "}
            <span className="font-semibold">{activePlan?.name}</span>
          </p>
        </motion.div>

        {/* Active Plan */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-lg rounded-lg bg-white border-2 border-indigo-200">
            <CardHeader className="bg-linear-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
              <CardTitle className="text-3xl">Current Plan Overview</CardTitle>
              <p className="text-indigo-100">{activePlan?.description}</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <h3 className="font-semibold text-xl text-indigo-700 mb-2">
                    Store Usage
                  </h3>
                  <p className="text-3xl font-bold text-purple-600">
                    {currentStores}/
                    {activePlan?.maxStores === "unlimited"
                      ? "∞"
                      : activePlan?.no_stores}
                  </p>
                  <p className="text-sm text-gray-600">stores used</p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-xl text-indigo-700 mb-2">
                    Remaining Capacity
                  </h3>
                  <p className="text-3xl font-bold text-purple-600">
                    {activePlan?.no_stores === "unlimited"
                      ? "Unlimited"
                      : Math.max(0, activePlan?.no_stores - currentStores)}
                  </p>
                  <p className="text-sm text-gray-600">stores remaining</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans?.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
            >
              <Card
                className={cn(
                  "shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2",
                  plan.id === activePlan?.id
                    ? "bg-linear-to-br from-indigo-100 to-purple-100 border-2 border-indigo-400"
                    : "bg-white"
                )}
              >
                <CardHeader
                  className={cn(
                    "rounded-t-lg",
                    plan?.id === activePlan?.id
                      ? "bg-linear-to-r from-indigo-500 to-purple-500 text-white"
                      : "bg-gray-100"
                  )}
                >
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <p
                    className={cn(
                      "text-2xl font-bold",
                      plan?.id === activePlan?.id
                        ? "text-indigo-100"
                        : "text-indigo-600"
                    )}
                  >
                    ${plan?.price}/month
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                  <ScrollArea className="h-48">
                    <ul className="space-y-3">
                      {plan?.features?.map((feature, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 * index }}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="text-green-500" />
                          <span className="text-gray-700">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </ScrollArea>
                </CardContent>
                <CardFooter>
                  <button
                    className={cn(
                      "w-full text-lg py-2 transition-colors duration-300",
                      plan?.id === activePlan?.id
                        ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    )}
                    onClick={() => handleUpgradePlan(plan)}
                    disabled={plan?.id === activePlan?.id || updatePlanMutation.isLoading}
                  >
                    {plan?.id === activePlan?.id
                      ? "Current Plan"
                      : `Upgrade to ${plan?.name}`}
                  </button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    
    </>
  );
}