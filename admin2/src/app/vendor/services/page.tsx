"use client"

import React, { useEffect, useState } from "react"
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
} from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@medusajs/ui"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useGetStores } from "@/app/hooks/store/useGetStores"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

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
]

export default function ServicesDashboard() {
  const { data: stores } = useGetStores()
  const [activePlan, setActivePlan] = useState<ServicePlan | null>(null)
  const currentStores = stores?.length || 0

  useEffect(() => {
    const storedPlan = sessionStorage.getItem("plan")
    const foundPlan = SERVICES.find(plan => plan.name.toLowerCase() === storedPlan?.toLowerCase())
    if (foundPlan) {
      foundPlan.isActive = true
      setActivePlan(foundPlan)
    } else {
      // Default to Basic plan if no plan is found
      const defaultPlan = SERVICES.find(plan => plan.name === "Basic")
      if (defaultPlan) {
        defaultPlan.isActive = true
        setActivePlan(defaultPlan)
      }
    }
  }, [])

  if (!activePlan) {
    return <div>Loading...</div>
  }

  return (
    <div className="relative min-h-screen overflow-hidden ">
      <div className="relative z-10 min-h-screen p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-2 mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-blue-500">
              Service Plans
            </h1>
            <p className="text-sm text-black/80 max-w-xl mx-auto">
              Your current plan: {activePlan.name}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="mb-6 rounded-xl overflow-hidden border-0 bg-white/10 backdrop-blur-md shadow-2xl">
              <CardHeader className="border-b border-white/20 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl shadow-md bg-white/20">
                    <Activity className="w-5 h-5 text-blue-700" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-black">
                      Current Plan Status
                    </CardTitle>
                    <p className="text-xs text-black/80">
                      {activePlan.name} Plan Overview
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-xl p-4 shadow-md border border-white/20">
                      <h3 className="text-base font-semibold text-black mb-3">
                        Store Usage
                      </h3>
                      <div className="flex items-end gap-2 mb-3">
                        <span className="text-2xl font-bold text-black">
                          {currentStores}
                        </span>
                        <span className="text-sm text-black/80 mb-0.5">
                          of {activePlan.maxStores} stores
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${Math.min((currentStores / activePlan.maxStores) * 100, 100)}%`
                          }}
                        />
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-xl p-4 shadow-md border border-white/20">
                      <h3 className="text-base font-semibold text-black mb-2">
                        Available Capacity
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-black">
                          {Math.max(0, activePlan.maxStores - currentStores)}
                        </span>
                        <span className="text-sm text-black/80">stores remaining</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4 shadow-md border border-white/20">
                    <h3 className="text-base font-semibold text-black mb-3">
                      Active Stores
                    </h3>
                    <ScrollArea className="h-[180px] pr-4">
      {stores && stores.length > 0 ? (
        <div className="space-y-2">
          {stores.map((store, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-white/10 shadow-md border border-white/20 transition-all hover:bg-white/20"
            >
              <div className="p-1.5 rounded-xl bg-white/20">
                <ShoppingBag className="w-3.5 h-3.5 text-blue-700" />
              </div>
              <div className="flex items-center justify-between w-full">
                <p className="text-sm font-medium text-black">
                  {store.name}
                </p>
                <p className="px-2 py-0.5 bg-green-500/50 text-gray-700 rounded-full text-xs font-normal">
                  Active
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full absolute inset-0">
          <span className="text-black/60 text-sm">NO active stores</span>
        </div>
      )}
    </ScrollArea>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SERVICES.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              >
                <Card
                  className={cn(
                    "relative overflow-hidden border-0 transition-all duration-300 bg-white/10 backdrop-blur-md shadow-2xl flex flex-col h-full",
                    plan.name === activePlan.name
                      ? "border border-white/40 rounded-xl"
                      : "hover:bg-white/20"
                  )}
                >
                  {plan.name === activePlan.name && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 bg-green-500/50 text-gray-700 rounded-full text-xs font-medium">
                        Current Plan
                      </span>
                    </div>
                  )}

                  <CardHeader className="p-4 pb-3">
                    <div className="mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20">
                        <plan.icon className="w-5 h-5 text-blue-700" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-blue-700">
                      {plan.name}
                    </CardTitle>
                    <div className="mt-1">
                      <span className="text-2xl font-bold text-blue-700">
                        {plan.price}
                      </span>
                      <span className="text-sm text-black/80">/month</span>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 pt-0 flex-grow">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="mt-0.5 p-1 rounded-xl bg-white/20">
                            <feature.icon className="w-3.5 h-3.5 text-black" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-black">
                              {feature.title}
                            </p>
                            <p className="text-xs text-black/80">
                              {feature.description}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="p-4 mt-auto">
                    <Button
                      variant={plan.name === activePlan.name ? "secondary" : "primary"}
                      disabled={plan.name === activePlan.name}
                      className={cn(
                        "w-full py-3 text-xs font-medium rounded-xl transition-all",
                        plan.name === activePlan.name
                          ? "text-purple-100 bg-white/10 border border-white/20 hover:bg-white/20"
                          : "bg-white text-purple-600 shadow-md hover:shadow-lg hover:bg-white/90"
                      )}
                    >
                      {plan.name === activePlan.name ? "Current Plan" : "Upgrade to " + plan.name}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

