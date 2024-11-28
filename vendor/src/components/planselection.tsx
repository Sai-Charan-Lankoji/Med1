"use client";

import { useState } from "react";
import { Check, Bolt, Sparkles, Users } from "@medusajs/icons";
import { Button } from "@medusajs/ui";
import { Card } from "./ui/card";
import VendorForm from "./vendorForm/vendor-form";
import { ServicePlan } from "@/app/@types/services";
import { Store, Activity, HeadphonesIcon, Zap, Building2, Database, Shield, Globe, Crown } from "lucide-react";

const SERVICES: ServicePlan[] = [
  {
    id: 1,
    name: "Basic",
    isActive: false,
    maxStores: 3,
    price: "$29",
    features: [
      {
        title: "Store Management",
        description: "Manage up to 3 stores",
        icon: Store,
      },
      {
        title: "Basic Analytics",
        description: "Essential metrics and insights",
        icon: Activity,
      },
      {
        title: "Standard Support",
        description: "Email support within 24 hours",
        icon: HeadphonesIcon,
      },
    ],
    icon: Zap,
  },
  {
    id:2,
    name: "Professional",
    isActive: false,
    maxStores: 10,
    price: "$99",
    features: [
      {
        title: "Enhanced Management",
        description: "Manage up to 10 stores",
        icon: Building2,
      },
      {
        title: "Advanced Analytics",
        description: "Detailed reports and forecasting",
        icon: Database,
      },
      {
        title: "Priority Support",
        description: "Priority email & chat support",
        icon: Shield,
      },
      {
        title: "API Access",
        description: "Full API integration capabilities",
        icon: Globe,
      },
    ],
    icon: Shield,
  },
  {
    id: 3,
    name: "Enterprise",
    isActive: false,
    maxStores: 50,
    price: "$299",
    features: [
      {
        title: "Unlimited Potential",
        description: "Unlimited store management",
        icon: Crown,
      },
      {
        title: "Custom Analytics",
        description: "Tailored reporting solutions",
        icon: Activity,
      },
      {
        title: "Dedicated Support",
        description: "24/7 dedicated support team",
        icon: Users,
      },
    ],
    icon: Crown,
  },
]
export function PlanSelection() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

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
        {SERVICES.map((plan) => (
          <Card
            key={plan.id}
            className="p-6 max-w-sm bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all hover:scale-105 rounded-xl"
          >
            <div className="flex flex-col h-full">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                <div className="mt-2 text-4xl font-bold text-white">
                  {plan.price}
                </div>
                <p className="text-sm text-white/70 mt-2">per month</p>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature) => (
                  <li
                    key={feature.title}
                    className="flex items-center space-x-3 text-white"
                  >
                    <Check className="h-5 w-5 text-green-400" />
                    <span>{feature.description}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => setSelectedPlan(plan.name)}
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
