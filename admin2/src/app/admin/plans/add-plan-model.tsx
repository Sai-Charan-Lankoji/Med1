import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { useCreatePlan } from "@/app/hooks/plan/useCreatePlan"
import { useToast } from "@/hooks/use-toast"

interface AddPlanDialogProps {
  isOpen: boolean
  onClose: () => void
}

export interface Plan {
  id?: string;
  name: string;
  description?: string;
  price: number;
  features: string[];
  isActive: boolean;
  duration?: 'monthly' | 'yearly' | 'quarterly';
  discount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export function AddPlanDialog({ isOpen, onClose }: AddPlanDialogProps) {
  const createPlanMutation = useCreatePlan();

  const [newPlan, setNewPlan] = useState<Partial<Plan>>({
    name: "",
    price: 0,
    features: [""],
    isActive: true,
    discount: 0,
    duration: "monthly"
  })
  const { toast } = useToast()
  const [errors, setErrors] = useState<Partial<Record<keyof Plan, string>>>({})

  const validateForm = () => {
    const newErrors: Partial<Record<keyof Plan, string>> = {}

    if (!newPlan.name?.trim()) {
      newErrors.name = "Name is required"
    }
    if ((newPlan.price || 0) <= 0) {
      newErrors.price = "Price must be greater than 0"
    }
    if ((newPlan.discount || 0) < 0 || (newPlan.discount || 0) > 100) {
      newErrors.discount = "Discount must be between 0 and 100"
    }
    if (!newPlan.features || newPlan.features.length === 0 || 
        (newPlan.features.length === 1 && !newPlan.features[0].trim())) {
      newErrors.features = "At least one feature is required"
    }
    if (!newPlan.duration) {
      newErrors.duration = "Duration is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      createPlanMutation.mutate(newPlan, {
        onSuccess: () => {
          toast({
            title: "Plan Created",
            description: "Your new plan has been successfully added.",
            variant: "default"
          })
          
          // Reset form
          setNewPlan({ 
            name: "", 
            price: 0, 
            features: [""], 
            isActive: true, 
            discount: 0,
            duration: "monthly"
          })
          onClose()
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to create plan. Please try again.",
            variant: "destructive"
          })
          console.error("Failed to create plan", error)
        }
      })
    }
  }

  const handleClose = () => {
    setErrors({})
    setNewPlan({ 
      name: "", 
      price: 0, 
      features: [""], 
      isActive: true, 
      discount: 0,
      duration: "monthly"
    })
    onClose()
  }

  const updateFeature = (index: number, value: string) => {
    const updatedFeatures = [...(newPlan.features || [])];
    updatedFeatures[index] = value;
    setNewPlan({ ...newPlan, features: updatedFeatures });
  }

  const addFeature = () => {
    setNewPlan({ 
      ...newPlan, 
      features: [...(newPlan.features || []), ""] 
    });
  }

  const removeFeature = (index: number) => {
    const updatedFeatures = newPlan.features?.filter((_, i) => i !== index) || [];
    setNewPlan({ ...newPlan, features: updatedFeatures });
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Plan</DialogTitle>
          <DialogDescription>
            Create a new subscription plan with detailed information.
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium">
                  Price ($)
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={newPlan.price}
                  onChange={(e) => setNewPlan({ 
                    ...newPlan, 
                    price: Math.max(0, parseFloat(e.target.value)) 
                  })}
                  className={cn(errors.price && "border-destructive")}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">
                    Features
                  </Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={addFeature}
                  >
                    + Add Feature
                  </Button>
                </div>
                {(newPlan.features || []).map((feature, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
                      className={cn(
                        errors.features && "border-destructive",
                        "flex-grow"
                      )}
                    />
                    {index > 0 && (
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="icon"
                        onClick={() => removeFeature(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {errors.features && (
                  <p className="text-sm text-destructive">{errors.features}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Plan Status
              </Label>
              <div className="flex items-center space-x-4">
                <Label className="flex items-center space-x-2">
                  <Input 
                    type="radio" 
                    name="isActive" 
                    className="mr-2"
                    checked={newPlan.isActive === true}
                    onChange={() => setNewPlan({ ...newPlan, isActive: true })}
                  />
                  Active
                </Label>
                <Label className="flex items-center space-x-2">
                  <Input 
                    type="radio" 
                    name="isActive" 
                    className="mr-2"
                    checked={newPlan.isActive === false}
                    onChange={() => setNewPlan({ ...newPlan, isActive: false })}
                  />
                  Inactive
                </Label>
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-6 gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={createPlanMutation.isPending}
            >
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createPlanMutation.isPending}
            >
              {createPlanMutation.isPending ? (
                "Creating..."
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" /> Add Plan
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}