import { useState, useEffect } from "react"
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
import { useToast } from "@/hooks/use-toast"
import { useUpdatePlan } from "@/app/hooks/plan/useUpdatePlan"
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
  no_stores : string | null
}

interface EditPlanDialogProps {
  isOpen: boolean
  onClose: () => void
  plan: Plan | null
  onUpdate: (id: string, data: UpdatePlanData) => void
}

export function EditPlanDialog({ isOpen, onClose, plan, onUpdate }: EditPlanDialogProps) {
  const updatePlanMutation = useUpdatePlan();
  const { toast } = useToast()

  const [editedPlan, setEditedPlan] = useState<Plan | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof Plan, string>>>({})

  useEffect(() => {
    if (plan) {
      setEditedPlan(plan)
    }
  }, [plan])

  const validateForm = () => {
    const newErrors: Partial<Record<keyof Plan, string>> = {}

    if (!editedPlan?.name?.trim()) {
      newErrors.name = "Name is required"
    }
    if (parseFloat(editedPlan?.price || "0") <= 0) {
      newErrors.price = "Price must be greater than 0"
    }
    if (!editedPlan?.features || editedPlan.features.length === 0 || 
        (editedPlan.features.length === 1 && !editedPlan.features[0].trim())) {
      newErrors.features = "At least one feature is required"
    }
    if (!editedPlan?.description?.trim()) {
      newErrors.description = "Description is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm() && editedPlan) {
      try {
        const updateData: UpdatePlanData = {
          name: editedPlan.name,
          description: editedPlan.description,
          price: parseFloat(editedPlan.price),
          features: editedPlan.features,
          isActive: editedPlan.isActive
        }
        await updatePlanMutation.mutateAsync({ id: editedPlan.id, ...updateData });
        toast({
          title: "Plan Updated",
          description: "Your plan has been successfully updated.",
          variant: "default"
        });
        onUpdate(editedPlan.id, updateData)
        onClose();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update plan. Please try again.",
          variant: "destructive"
        });
        console.error("Failed to update plan", error);
      }
    }
  }

  const updateFeature = (index: number, value: string) => {
    if (editedPlan) {
      const updatedFeatures = [...editedPlan.features];
      updatedFeatures[index] = value;
      setEditedPlan({ ...editedPlan, features: updatedFeatures });
    }
  }

  const addFeature = () => {
    if (editedPlan) {
      setEditedPlan({ 
        ...editedPlan, 
        features: [...editedPlan.features, ""] 
      });
    }
  }

  const removeFeature = (index: number) => {
    if (editedPlan) {
      const updatedFeatures = editedPlan.features.filter((_, i) => i !== index);
      setEditedPlan({ ...editedPlan, features: updatedFeatures });
    }
  }

  if (!editedPlan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle className="text-xl font-semibold">Edit Plan</DialogTitle>
      <DialogDescription>
        Update the details of your subscription plan.
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
            value={editedPlan.name}
            onChange={(e) => setEditedPlan({ ...editedPlan, name: e.target.value })}
            className={cn(errors.name && "border-destructive")}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Input
            id="description"
            value={editedPlan.description}
            onChange={(e) => setEditedPlan({ ...editedPlan, description: e.target.value })}
            className={cn(errors.description && "border-destructive")}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price" className="text-sm font-medium">
            Price ($)
          </Label>
          <Input
            id="price"
            type="number"
            value={editedPlan.price}
            onChange={(e) =>
              setEditedPlan({
                ...editedPlan,
                price: Math.max(0, parseFloat(e.target.value)).toString(),
              })
            }
            className={cn(errors.price && "border-destructive")}
            step="0.01"
            min="0"
          />
          {errors.price && (
            <p className="text-sm text-destructive">{errors.price}</p>
          )}
        </div> 




        <div className="space-y-2">
          <Label htmlFor="NoOfStores" className="text-sm font-medium">
           no of stores
          </Label>
          <Input
            id="stores"
            type="string"
            value={editedPlan.no_stores}
            onChange={(e) =>
              setEditedPlan({
                ...editedPlan,
                no_stores: e.target.value,
              })
            }
            className={cn(errors.no_stores && "border-destructive")}
            step="0.01"
            min="0"
          />
          {errors.price && (
            <p className="text-sm text-destructive">{errors.no_stores}</p>
          )}
        </div>




        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium">Features</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addFeature}
            >
              + Add Feature
            </Button>
          </div>
          <div className="max-h-[200px] overflow-y-auto border rounded-md p-2 space-y-2">
            {editedPlan.features.map((feature, index) => (
              <div key={index} className="flex space-x-2">
                <Input
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  placeholder={`Feature ${index + 1}`}
                  className={cn(errors.features && "border-destructive", "flex-grow")}
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
          </div>
          {errors.features && (
            <p className="text-sm text-destructive">{errors.features}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Plan Status</Label>
          <div className="flex items-center space-x-4">
            <Label className="flex items-center space-x-2">
              <Input
                type="radio"
                name="isActive"
                className="mr-2"
                checked={editedPlan.isActive === true}
                onChange={() => setEditedPlan({ ...editedPlan, isActive: true })}
              />
              Active
            </Label>
            <Label className="flex items-center space-x-2">
              <Input
                type="radio"
                name="isActive"
                className="mr-2"
                checked={editedPlan.isActive === false}
                onChange={() => setEditedPlan({ ...editedPlan, isActive: false })}
              />
              Inactive
            </Label>
          </div>
        </div>
      </div>

      <DialogFooter className="mt-6 gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          <X className="mr-2 h-4 w-4" /> Cancel
        </Button>
        <Button type="submit">
          <Check className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>

  )
}

