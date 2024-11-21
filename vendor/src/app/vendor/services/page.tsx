"use client";

import React from "react";
import {
  Building2,
  Store,
  Crown,
  Activity,
  ShoppingBag,
  Zap,
  Shield,
  Users,
  Globe,
  Database,
  HeadphonesIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@medusajs/ui";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetStores } from "@/app/hooks/store/useGetStores";
import { cn } from "@/lib/utils";

interface Feature {
  title: string;
  description: string;
  icon: React.ElementType;
}

interface ServicePlan {
  name: string;
  isActive: boolean;
  maxStores: number;
  price: string;
  features: Feature[];
  icon: React.ElementType;
}

const SERVICES: ServicePlan[] = [
  {
    name: "Basic",
    isActive: true,
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
];

export default function ServicesDashboard() {
  const { data: stores } = useGetStores();
  const activePlan = SERVICES.find((plan) => plan.isActive);
  const currentStores = stores?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Service Plans
          </h1>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">
            Choose the perfect plan for your business needs
          </p>
        </div>

        {activePlan && (
          <Card className="mb-6 rounded-xl overflow-hidden border-0 bg-white shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl shadow-md bg-gradient-to-br from-blue-500 to-blue-600">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-800">
                    Current Plan Status
                  </CardTitle>
                  <p className="text-xs text-gray-600">
                    {activePlan.name} Plan Overview
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 shadow-md border border-gray-200">
                    <h3 className="text-base font-semibold text-gray-800 mb-3">
                      Store Usage
                    </h3>
                    <div className="flex items-end gap-2 mb-3">
                      <span className="text-2xl font-bold text-gray-800">
                        {currentStores}
                      </span>
                      <span className="text-sm text-gray-600 mb-0.5">
                        of {activePlan.maxStores} stores
                      </span>
                    </div>
                    <Progress
                      value={(currentStores / activePlan.maxStores) * 100}
                      className="h-2 rounded-full bg-gray-200"
                    />
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
                    <h3 className="text-base font-semibold text-gray-800 mb-2">
                      Available Capacity
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-800">
                        {Math.max(0, activePlan.maxStores - currentStores)}
                      </span>
                      <span className="text-sm text-gray-600">stores remaining</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
                  <h3 className="text-base font-semibold text-gray-800 mb-3">
                    Active Stores
                  </h3>
                  <ScrollArea className="h-[180px] pr-4">
                    <div className="space-y-2">
                      {stores?.map((store, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 shadow-sm border border-gray-200 transition-all hover:shadow-md"
                        >
                          <div className="p-1.5 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                            <ShoppingBag className="w-3.5 h-3.5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {store.name}
                            </p>
                            <p className="text-xs text-gray-600">Active</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SERVICES.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "relative overflow-hidden border-0 transition-all duration-300",
                plan.isActive
                  ? "shadow-lg border border-blue-200 rounded-xl bg-white"
                  : "shadow-md hover:shadow-lg bg-white"
              )}
            >
              {plan.isActive && (
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    Current Plan
                  </span>
                </div>
              )}

              <CardHeader className="p-4 pb-3">
                <div className="mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600">
                    <plan.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  {plan.name}
                </CardTitle>
                <div className="mt-1">
                  <span className="text-2xl font-bold text-gray-800">
                    {plan.price}
                  </span>
                  <span className="text-sm text-gray-600">/month</span>
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-0">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="mt-0.5 p-1 rounded-xl bg-blue-100">
                        <feature.icon className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {feature.title}
                        </p>
                        <p className="text-xs text-gray-600">
                          {feature.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="p-4">
                <Button
                  variant={plan.isActive ? "secondary" : "primary"}
                  disabled={plan.isActive}
                  className={cn(
                    "w-full py-5 text-xs font-medium rounded-xl transition-all",
                    plan.isActive
                      ? "text-gray-700 bg-gray-100 border border-gray-200"
                      : "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg"
                  )}
                >
                  {plan.isActive ? "Current Plan" : "Upgrade to " + plan.name}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

