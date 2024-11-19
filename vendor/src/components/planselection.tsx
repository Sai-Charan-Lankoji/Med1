"use client";

import { useState } from "react";
import { Check, Bolt, Sparkles } from "@medusajs/icons";
import { Button } from "@medusajs/ui"
import { Card } from "./ui/card";
import VendorForm from "./vendor-form";

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: "$29",
    features: [
      "Single store",
      "Basic analytics",
      "Standard support",
      "1 template included",
    ],
  },
  {
    id: "pro",
    name: "Professional",
    price: "$79",
    features: [
      "Multiple stores",
      "Advanced analytics",
      "Priority support",
      "All templates included",
      "Custom domain",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    features: [
      "Unlimited stores",
      "Enterprise analytics",
      "24/7 dedicated support",
      "Custom templates",
      "API access",
      "White labeling",
    ],
  },
];

export function PlanSelection() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  if (selectedPlan) {
    return <VendorForm plan={selectedPlan} />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px] pointer-events-none" />
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
      <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-gradient-to-r from-purple-400 to-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-bold text-center text-white mb-12">Choose Your Plan</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className="p-6 bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all hover:scale-105 rounded-lg">
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                  <div className="mt-2 text-4xl font-bold text-white">{plan.price}</div>
                  <p className="text-sm text-white/70 mt-2">per month</p>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center space-x-3 text-white">
                      <Check className="h-5 w-5 text-green-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
  onClick={() => setSelectedPlan(plan.id)}
  className="text-lg py-2 px-4 transition-all hover:scale-105 rounded-2xl text-purple-600"
  variant="secondary"
>
  {plan.id === "pro" && <Bolt className="mr-2 h-5 w-5" />}
  {plan.id === "enterprise" && <Sparkles className="mr-2 h-5 w-5" />}
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