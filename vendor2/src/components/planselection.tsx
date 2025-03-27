"use client";

import { useState } from "react";
import { Check, Zap, Sparkles } from "lucide-react";
import VendorForm from "./vendorForm/vendor-form";
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
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary p-4">
      <div className="container mx-auto relative z-10 py-8">
        <h2 className="text-4xl font-bold text-center text-base-100 mb-12">
          Choose Your Plan
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {plans?.map((plan) => (
            <div 
              key={plan.id} 
              className="card bg-base-100/10 backdrop-blur-md border border-base-100/20 hover:border-base-100/40 transition-all hover:scale-105"
            >
              <div className="card-body flex flex-col h-full">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-base-100">{plan.name}</h3>
                  <div className="mt-2 text-4xl font-bold text-base-100">
                    $ {plan.price}
                  </div>
                  <p className="text-sm text-base-100/70 mt-2">per month</p>
                </div>
                <ul className="space-y-3 mb-8 grow">
                  {plan?.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-3 text-base-100"
                    >
                      <Check className="h-5 w-5 text-success" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="card-actions">
                  <button
                    onClick={() =>
                      setSelectedPlan({
                        name: plan.name,
                        id: plan.id
                      })
                    }
                    className={`btn w-full ${
                      plan.name === "Professional" ? "btn-primary" : 
                      plan.name === "Enterprise" ? "btn-secondary" : "btn-accent"
                    }`}
                  >
                    {plan.name === "Professional" && <Zap className="mr-2 h-5 w-5" />}
                    {plan.name === "Enterprise" && (
                      <Sparkles className="mr-2 h-5 w-5" />
                    )}
                    Select Plan
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