import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Check, X } from 'lucide-react'

interface Plan {
  name: string
  price: number
  features: string[]
  discount: number
}

interface AddPlanDialogProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (plan: Plan) => void
}

export function AddPlanDialog({ isOpen, onClose, onAdd }: AddPlanDialogProps) {
  const [newPlan, setNewPlan] = useState<Plan>({
    name: "",
    price: 0,
    features: [],
    discount: 0,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof Plan, string>>>({})

  const validateForm = () => {
    const newErrors: Partial<Record<keyof Plan, string>> = {}

    if (!newPlan.name.trim()) {
      newErrors.name = "Name is required"
    }
    if (newPlan.price <= 0) {
      newErrors.price = "Price must be greater than 0"
    }
    if (newPlan.discount < 0 || newPlan.discount > 100) {
      newErrors.discount = "Discount must be between 0 and 100"
    }
    if (newPlan.features.length === 0 || (newPlan.features.length === 1 && !newPlan.features[0])) {
      newErrors.features = "At least one feature is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onAdd(newPlan)
      setNewPlan({ name: "", price: 0, features: [], discount: 0 })
      onClose()
    }
  }

  const handleClose = () => {
    setErrors({})
    setNewPlan({ name: "", price: 0, features: [], discount: 0 })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Plan</DialogTitle>
          <DialogDescription>
            Create a new subscription plan with details and features.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Plan Name
              </Label>
              <Input
                id="name"
                value={newPlan.name}
                onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                className={cn(errors.name && "border-destructive")}
                placeholder="Enter plan name"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium">
                Price ($)
              </Label>
              <Input
                id="price"
                type="number"
                value={newPlan.price}
                onChange={(e) => setNewPlan({ ...newPlan, price: Math.max(0, parseFloat(e.target.value)) })}
                className={cn(errors.price && "border-destructive")}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount" className="text-sm font-medium">
                Discount (%)
              </Label>
              <Input
                id="discount"
                type="number"
                value={newPlan.discount}
                onChange={(e) => setNewPlan({ ...newPlan, discount: Math.min(100, Math.max(0, parseFloat(e.target.value))) })}
                className={cn(errors.discount && "border-destructive")}
                placeholder="0"
                min="0"
                max="100"
              />
              {errors.discount && (
                <p className="text-sm text-destructive">{errors.discount}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="features" className="text-sm font-medium">
                Features
              </Label>
              <Input
                id="features"
                value={newPlan.features.join(", ")}
                onChange={(e) => setNewPlan({ ...newPlan, features: e.target.value.split(",").map(f => f.trim()).filter(Boolean) })}
                className={cn(errors.features && "border-destructive")}
                placeholder="Feature 1, Feature 2, Feature 3"
              />
              {errors.features && (
                <p className="text-sm text-destructive">{errors.features}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Separate features with commas
              </p>
            </div>
          </div>
          <DialogFooter className="mt-6 gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button type="submit">
              <Check className="mr-2 h-4 w-4" /> Add Plan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

