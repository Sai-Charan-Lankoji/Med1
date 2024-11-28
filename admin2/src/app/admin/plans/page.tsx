"use client"

import { useState } from "react"
import { Plus } from 'lucide-react'
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
    features: ["Feature 1", "Feature 2"],
    discount: 0,
  },
  {
    id: "2",
    name: "Pro",
    price: 19.99,
    features: ["Feature 1", "Feature 2", "Feature 3"],
    discount: 0,
  },
  {
    id: "3",
    name: "Enterprise",
    price: 49.99,
    features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
    discount: 0,
  },
]

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>(initialPlans)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredPlans = plans.filter((plan) =>
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
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Manage Plans</CardTitle>
          <CardDescription>View, add, edit, and delete subscription plans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <Input
              type="text"
              placeholder="Search plans..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add New Plan
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onUpdate={handleUpdatePlan}
                onDelete={handleDeletePlan}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      <AddPlanDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddPlan}
      />
    </div>
  )
}

