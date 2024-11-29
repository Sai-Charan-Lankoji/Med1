"use client"

import { useState } from "react"
import { PackageSearch, Plus, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AddPlanDialog } from "./add-plan-model"
import { PlanCard } from "./plan-card"
import { useGetPlans } from "../../hooks/plan/useGetPlans"

interface Plan {
  id: string
  name: string
  price: number
  features: string[]
  discount: number
}

const initialPlans: Plan[] = [
  {
    id: "1",
    name: "Basic",
    price: 9.99,
    features: ["1 Store", "Basic Support", "Basic Analytics"],
    discount: 0,
  },
  {
    id: "2",
    name: "Pro",
    price: 19.99,
    features: ["5 Stores", "Priority Support", "Advanced Analytics", "Custom Reports"],
    discount: 10,
  },
  {
    id: "3",
    name: "Enterprise",
    price: 49.99,
    features: ["Unlimited Stores", "24/7 Support", "Advanced Analytics", "Custom Reports", "API Access", "Custom Integration"],
    discount: 20,
  },
]

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>(initialPlans)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { data: Plans } = useGetPlans()
  console.log("PLANS ", Plans) 
  const filteredPlans = Plans?.filter((plan) =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddPlan = (newPlan: Omit<Plan, "id">) => {
    const planWithId = { ...newPlan, id: Date.now().toString() }
    setPlans([...plans, planWithId])
    setIsAddDialogOpen(false)
  }

  const handleUpdatePlan = (updatedPlan: Plan) => {
    setPlans(plans.map((plan) => (plan.id === updatedPlan.id ? updatedPlan : plan)))
  }

  const handleDeletePlan = (planId: string) => {
    setPlans(plans.filter((plan) => plan.id !== planId))
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 py-8">
      <div className="container mx-auto px-4">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Subscription Plans</CardTitle>
            <CardDescription>Manage your subscription plans and pricing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search plans..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Add New Plan
              </Button>
            </div>

            {filteredPlans?.length === 0 ? (
              <div className="text-center py-12">
                <PackageSearch className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No plans found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {plans.length === 0
                    ? "Start by adding a new subscription plan."
                    : "Try adjusting your search term."}
                </p>
                {plans.length === 0 && (
                  <Button
                    onClick={() => setIsAddDialogOpen(true)}
                    variant="outline"
                    className="mt-4"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Your First Plan
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlans?.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    onUpdate={handleUpdatePlan}
                    onDelete={handleDeletePlan}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <AddPlanDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
      />
    </div>
  )
}

