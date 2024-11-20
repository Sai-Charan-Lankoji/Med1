"use client";
import React from "react";
import {
  Building2,
  Store,
  Crown,
  Gauge,
  CheckCircle2,
  XCircle,
  ShoppingBag,
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

interface ServicePlan {
  name: string;
  isActive: boolean;
  maxStores: number;
  features: string[];
  icon: React.ElementType;
}

const SERVICES: ServicePlan[] = [
  {
    name: "Basic",
    isActive: true,
    maxStores: 3,
    features: [
      "Up to 3 stores",
      "Basic analytics",
      "Standard support",
      "Core features",
    ],
    icon: Store,
  },
  {
    name: "Professional",
    isActive: false,
    maxStores: 10,
    features: [
      "Up to 10 stores",
      "Advanced analytics",
      "Priority support",
      "API access",
      "Custom domain",
    ],
    icon: Building2,
  },
  {
    name: "Enterprise",
    isActive: false,
    maxStores: 50,
    features: [
      "Unlimited stores",
      "Custom analytics",
      "24/7 support",
      "White labeling",
      "Custom integration",
    ],
    icon: Crown,
  },
];

export default function ServicesDashboard() {
  const { data: stores } = useGetStores();
  const activePlan = SERVICES.find((plan) => plan.isActive);
  const currentStores = stores?.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Service Dashboard
          </h1>
          <p className="text-sm text-gray-600 font-medium">
            Manage your subscription and store allocation
          </p>
        </div>

        {activePlan && (
          <Card className="mb-6 overflow-hidden bg-white/80 backdrop-blur-sm shadow-md ring-1 ring-gray-100">
            <CardHeader className="border-b border-gray-100 bg-white py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-md">
                    <Gauge className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                      {activePlan.name} Plan
                    </CardTitle>
                    <p className="text-xs text-gray-500 font-medium">
                      Current plan utilization
                    </p>
                  </div>
                </div>
                <span className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-xs font-medium shadow-sm">
                  Active Plan
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 shadow-sm ring-1 ring-purple-100">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Store Usage
                  </h3>
                  <div className="flex items-end gap-2 mb-3">
                    <span className="text-2xl font-bold text-blue-600">
                      {currentStores}
                    </span>
                    <span className="text-sm text-gray-500 font-medium">
                      of {activePlan.maxStores} stores
                    </span>
                  </div>
                  <Progress
                    value={(currentStores / activePlan.maxStores) * 100}
                    className="h-2 rounded-full bg-gradient-to-r from-blue-200 to-purple-200"
                  />
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 shadow-sm ring-1 ring-pink-100">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Available Capacity
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-purple-600">
                      {Math.max(0, activePlan.maxStores - currentStores)}
                    </span>
                    <span className="text-sm text-gray-500 font-medium">
                      stores remaining
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-bold text-gray-800 mb-3">
                  Your Active Stores
                </h3>
                <ScrollArea className="h-[160px] rounded-xl border border-gray-100 bg-gradient-to-br from-white to-blue-50 p-3">
                  {stores?.map((store, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 mb-2 p-2 rounded-lg transition-all duration-200 hover:bg-white hover:shadow-sm group"
                    >
                      <div className="p-1.5 bg-gradient-to-r from-blue-100 to-purple-100 rounded-md group-hover:from-blue-200 group-hover:to-purple-200 transition-colors duration-200">
                        <ShoppingBag className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-700 font-medium">
                        {store.name}
                      </span>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SERVICES.map((plan) => (
            <Card
              key={plan.name}
              className={`transform transition-all duration-300 hover:scale-[1.01] ${
                plan.isActive
                  ? "bg-gradient-to-br from-white to-blue-50 shadow-md ring-1 ring-blue-100"
                  : "bg-white/80 backdrop-blur-sm"
              }`}
            >
              <CardHeader className="space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`p-2.5 rounded-lg ${
                      plan.isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-500"
                        : "bg-gradient-to-r from-gray-100 to-gray-200"
                    }`}
                  >
                    <plan.icon
                      className={`w-4 h-4 ${
                        plan.isActive ? "text-white" : "text-gray-600"
                      }`}
                    />
                  </div>
                  {plan.isActive && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      Current
                    </span>
                  )}
                </div>
                <CardTitle
                  className={`text-lg font-bold ${
                    plan.isActive
                      ? "bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
                      : "text-gray-700"
                  }`}
                >
                  {plan.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="px-4 pb-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-gray-600"
                    >
                      {plan.isActive ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="p-4">
                <Button
                  variant={plan.isActive ? "secondary" : "primary"}
                  disabled={plan.isActive}
                  className={`w-full py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    plan.isActive
                      ? "bg-gray-100 text-gray-500"
                      : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg"
                  }`}
                >
                  {plan.isActive ? "Current Plan" : "Upgrade Now"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}