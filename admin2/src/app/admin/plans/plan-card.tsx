import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { UpdatePlanData } from "../../hooks/plan/useUpdatePlan"

interface Plan {
  id: string
  name: string
  price: string
  features: string[]
  discount: number
  isActive: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
  description?: string
}

interface PlanCardProps {
  plan: Plan
  onUpdate: (id: string, data: UpdatePlanData) => void
  onDelete: (planId: string) => void
  onEdit: (plan: Plan) => void
}

export function PlanCard({ plan, onUpdate, onDelete, onEdit }: PlanCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleStatusChange = () => {
    setIsDialogOpen(true)
  }

  const handleConfirmStatusChange = () => {
    onUpdate(plan.id, { isActive: !plan.isActive })
    setIsDialogOpen(false)
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </div>
          <Badge 
            variant={plan.isActive ? "default" : "secondary"}
            className={`text-xs font-semibold px-2 py-1  cursor-pointer  ${plan.isActive ? 'bg-green-100 text-green-800 hover:bg-green-300' : 'bg-yellow-100 hover:bg-yellow-300 text-yellow-800'}`}
            onClick={handleStatusChange}
          >
            {plan.isActive ? "Active" : "Draft"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-2xl font-bold">${plan.price}</p>
        <ul className="mt-4 space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-green-500"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => onEdit(plan)}>
          <Pencil className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button variant="destructive" onClick={() => onDelete(plan.id)}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </CardFooter>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {plan.isActive ? "deactivate" : "activate"} this plan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmStatusChange}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

