import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreatePlan } from "@/app/hooks/plan/useCreatePlan";
import { CreatePlanData } from "@/app/@types/plan";
import { useQueryClient } from "@tanstack/react-query";
import { string } from "zod";

interface AddPlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddPlanDialog({ isOpen, onClose }: AddPlanDialogProps) {
  const queryClient = useQueryClient();
  const createPlanMutation = useCreatePlan();
  const { toast } = useToast();

  const [newPlan, setNewPlan] = useState<CreatePlanData>({
    name: "",
    description: "A enterprise plan with additional features",
    price: 0, 
    no_stores : "",
    features: [""],
    isActive: true,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreatePlanData, string>>
  >({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CreatePlanData, string>> = {};

    if (!newPlan.name?.trim()) {
      newErrors.name = "Name is required";
    }
    if ((newPlan.price || 0) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }
    if (
      !newPlan.features ||
      newPlan.features.length === 0 ||
      (newPlan.features.length === 1 && !newPlan.features[0].trim())
    ) {
      newErrors.features = "At least one feature is required";
    }
    if (!newPlan.description?.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await createPlanMutation.mutateAsync(newPlan);
        toast({
          title: "Plan Created",
          description: "Your new plan has been successfully added.",
          variant: "default",
        });

        // Reset form
        setNewPlan({
          name: "",
          description: "A enterprise plan with additional features",
          price: 0,
          no_stores : "",
          features: [""],
          isActive: true,
        });
        onClose();
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "No authentication token found"
        ) {
          toast({
            title: "Authentication Error",
            description: "Please log in to create a plan.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to create plan. Please try again.",
            variant: "destructive",
          });
        }
        console.error("Failed to create plan", error);
      }
    }
  };

  const updateFeature = (index: number, value: string) => {
    const updatedFeatures = [...newPlan.features];
    updatedFeatures[index] = value;
    setNewPlan({ ...newPlan, features: updatedFeatures });
  };

  const addFeature = () => {
    setNewPlan({
      ...newPlan,
      features: [...newPlan.features, ""],
    });
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = newPlan.features.filter((_, i) => i !== index);
    setNewPlan({ ...newPlan, features: updatedFeatures });
  };

  return (

    <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">Add New Plan</DialogTitle>
        <DialogDescription>
          Create a new subscription plan with detailed information.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Plan Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Plan Name
            </Label>
            <select
              id="name"
              value={newPlan.name}
              onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
              className={cn(
                "w-full px-3 py-2 border rounded-md",
                errors.name && "border-destructive"
              )}
            >
              <option value="">Select a Plan</option>
              <option value="Basic">Basic</option>
              <option value="Pro">Professional</option>
              <option value="Enterprise">Enterprise</option>
            </select>
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>
  
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Input
              id="description"
              value={newPlan.description}
              onChange={(e) =>
                setNewPlan({ ...newPlan, description: e.target.value })
              }
              className={cn(errors.description && "border-destructive")}
              placeholder="Enter plan description"
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>
  
          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium">
              Price ($)
            </Label>
            <Input
              id="price"
              type="number"
              value={newPlan.price}
              onChange={(e) =>
                setNewPlan({
                  ...newPlan,
                  price: Math.max(0, parseFloat(e.target.value)),
                })
              }
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
            <Label htmlFor="No of Stores" className="text-sm font-medium">
              No of Stores
            </Label>
            <Input
              id="stores"
              type="string"
              value={newPlan.no_stores}
              onChange={(e) =>
                setNewPlan({
                  ...newPlan,
                  no_stores: e.target.value,
                })
              }
              className={cn(errors.price && "border-destructive")}
              placeholder="0"
              step="0.01"
              min="0"
            />
            {errors.price && (
              <p className="text-sm text-destructive">{errors.price}</p>
            )}
          </div> 



       
  
          {/* Features */}
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
              {newPlan.features.map((feature, index) => (
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
            </div>
            {errors.features && (
              <p className="text-sm text-destructive">{errors.features}</p>
            )}
          </div>
  
          {/* Plan Status */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Plan Status</Label>
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
  
        {/* Footer */}
        <DialogFooter className="mt-6 gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button type="submit">
            <Check className="mr-2 h-4 w-4" /> Add Plan
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
  
  );
}
