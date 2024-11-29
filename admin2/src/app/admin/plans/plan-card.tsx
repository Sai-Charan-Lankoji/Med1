import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Check, Power } from 'lucide-react'
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
  onUpdate: (plan: Plan) => void
  onDelete: (planId: string) => void
}

export function PlanCard({ plan, onUpdate, onDelete }: PlanCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Function to handle plan activation/deactivation
  const handleUpdatePlan = () => {
    onUpdate({ ...plan, isActive: !plan.isActive })
  }

  // Function to handle plan deletion
  const handleDeletePlan = () => {
    onDelete(plan.id)
    setIsDeleteDialogOpen(false)
  }

  return (
    <Card className="flex flex-col h-full transition-all hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold mb-1">{plan.name}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">{plan.description}</CardDescription>
          </div>
          <Badge 
            variant={plan.isActive ? "default" : "secondary"} 
            className={`text-xs font-semibold px-2 py-1 ${plan.isActive ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
          >
            {plan.isActive ? "Active" : "Draft"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pt-4 pb-6">
        <div className="flex items-baseline mb-4">
          <span className="text-4xl font-extrabold">${plan.price}</span>
          <span className="text-muted-foreground ml-1">/month</span>
        </div>
        {plan.discount > 0 && (
          <Badge variant="secondary" className="mb-4">
            Save {plan.discount}%
          </Badge>
        )}
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex justify-between pt-6 border-t">
        <Button 
          variant="outline" 
          onClick={handleUpdatePlan} 
          className={`w-[48%] ${plan.isActive ? 'text-yellow-600 hover:text-yellow-700' : 'text-green-600 hover:text-green-700'}`}
        >
          <Power className="w-4 h-4 mr-2" />
          {plan.isActive ? "Deactivate" : "Activate"}
        </Button>
        <Button 
          variant="destructive" 
          onClick={() => setIsDeleteDialogOpen(true)} 
          className="w-[48%]"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </CardFooter>

      {/* Confirmation Dialog for Delete Action */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this plan?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the plan
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePlan}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

