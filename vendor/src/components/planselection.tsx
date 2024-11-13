"use client";

import { useState } from "react";
import { Check, Bolt } from "@medusajs/icons";
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
    <div className="grid gap-8 md:grid-cols-3">
      {plans.map((plan) => (
        <Card key={plan.id} className="p-6">
          <div className="flex flex-col h-full">
            <div className="mb-4">
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <div className="mt-2 text-3xl font-bold">{plan.price}</div>
              <p className="text-sm text-muted-foreground mt-2">per month</p>
            </div>
            <ul className="space-y-2 mb-6 flex-grow">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              onClick={() => setSelectedPlan(plan.id)}
              className="w-full"
              variant={plan.id === "pro" ? "primary" : "secondary"}
            >
              {plan.id === "pro" && <Bolt className="mr-2 h-4 w-4" />}
              Select Plan
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}