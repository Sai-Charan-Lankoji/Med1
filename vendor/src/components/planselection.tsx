"use client";

import { useState } from "react";
import { Check, Bolt, Sparkles } from "@medusajs/icons";
import { Button } from "@medusajs/ui";
import { Card } from "./ui/card";
import VendorForm from "./vendorForm/vendor-form";
import { ServicePlan } from "@/app/@types/services";
import { useGetPlans } from "@/app/hooks/plan/useGetPlans";

export function PlanSelection() {
  const [selectedPlan, setSelectedPlan] = useState<{
    name: string;
    id: string;
  } | null>(null);

  const { data: plans } = useGetPlans();

  if (selectedPlan) {
    return <VendorForm plan={selectedPlan} />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-500">
      {/* Animated Wave Background */}
      <div className="absolute inset-0 z-0">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>

      {/* Subtle Animated Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-gradient-to-r from-indigo-300 to-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-bold text-center text-white mb-12">
          Choose Your Plan
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {plans?.map((plan) => (
            <Card
              key={plan.id}
              className="p-6 max-w-sm bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all hover:scale-105 rounded-xl"
            >
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                  <div className="mt-2 text-4xl font-bold text-white">
                    $ {plan.price}
                  </div>
                  <p className="text-sm text-white/70 mt-2">per month</p>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan?.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-3 text-white"
                    >
                      <Check className="h-5 w-5 text-green-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() =>
                    setSelectedPlan({
                      name: plan.name,
                      id: plan.id
                    })
                  }
                  className="text-lg py-2 px-4 transition-all hover:scale-105 rounded-2xl text-purple-600"
                  variant="secondary"
                >
                  {plan.name === "Professional" && <Bolt className="mr-2 h-5 w-5" />}
                  {plan.name === "Enterprise" && (
                    <Sparkles className="mr-2 h-5 w-5" />
                  )}
                  Select Plan
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}