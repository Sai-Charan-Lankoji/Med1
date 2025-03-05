"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { cn } from "@/app/lib/utils";
import { Check, X } from "lucide-react";
import { useToast } from "@/app/hooks/use-toast";
import { useCreatePlan } from "@/app/hooks/plan/useCreatePlan";
import { CreatePlanData } from "@/app/@types/plan";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { LoadingDots } from "@/app/components/ui/Loding";

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
    no_stores: "",
    features: [""],
    commission_rate: 0,
    isActive: true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreatePlanData, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CreatePlanData, string>> = {};

    if (!newPlan.name?.trim()) newErrors.name = "Name is required";
    if ((newPlan.price || 0) <= 0) newErrors.price = "Price must be greater than 0";
    if (!newPlan.features || newPlan.features.length === 0 || (newPlan.features.length === 1 && !newPlan.features[0].trim()))
      newErrors.features = "At least one feature is required";
    if (!newPlan.description?.trim()) newErrors.description = "Description is required";
    if (newPlan.commission_rate < 0 || newPlan.commission_rate > 100)
      newErrors.commission_rate = "Commission rate must be between 0 and 100";

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

        setNewPlan({
          name: "",
          description: "A enterprise plan with additional features",
          price: 0,
          no_stores: "",
          features: [""],
          commission_rate: 0,
          isActive: true,
        });
        onClose();
      } catch (error) {
        if (error instanceof Error && error.message === "No authentication token found") {
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
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 shadow-2xl rounded-xl border-none">
          <DialogHeader className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 p-6">
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">Add New Plan</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300 mt-2">
              Create a new subscription plan with detailed information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
            <div className="flex-1 space-y-6">
              {/* Plan Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Plan Name
                </Label>
                <select
                  id="name"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  className={cn(
                    "w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200",
                    errors.name && "border-red-500"
                  )}
                >
                  <option value="">Select a Plan</option>
                  <option value="Basic">Basic</option>
                  <option value="Pro">Professional</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Description
                </Label>
                <Input
                  id="description"
                  value={newPlan.description}
                  onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                  className={cn(
                    "w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200",
                    errors.description && "border-red-500"
                  )}
                  placeholder="Enter plan description"
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Price ($)
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={newPlan.price}
                  onChange={(e) => setNewPlan({ ...newPlan, price: Math.max(0, parseFloat(e.target.value)) })}
                  className={cn(
                    "w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200",
                    errors.price && "border-red-500"
                  )}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
                {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
              </div>

              {/* Commission Rate */}
              <div className="space-y-2">
                <Label htmlFor="commission_rate" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Commission Rate (%)
                </Label>
                <Input
                  id="commission_rate"
                  type="number"
                  value={newPlan.commission_rate}
                  onChange={(e) =>
                    setNewPlan({
                      ...newPlan,
                      commission_rate: Math.min(100, Math.max(0, parseFloat(e.target.value))),
                    })
                  }
                  className={cn(
                    "w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200",
                    errors.commission_rate && "border-red-500"
                  )}
                  placeholder="0"
                  step="0.01"
                  min="0"
                  max="100"
                />
                {errors.commission_rate && <p className="text-sm text-red-500">{errors.commission_rate}</p>}
              </div>

              {/* Number of Stores */}
              <div className="space-y-2">
                <Label htmlFor="stores" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Number of Stores
                </Label>
                <Input
                  id="stores"
                  value={newPlan.no_stores}
                  onChange={(e) => setNewPlan({ ...newPlan, no_stores: e.target.value })}
                  className={cn(
                    "w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200",
                    errors.no_stores && "border-red-500"
                  )}
                  placeholder="e.g., 5"
                />
                {errors.no_stores && <p className="text-sm text-red-500">{errors.no_stores}</p>}
              </div>

              {/* Features */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Features</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addFeature}
                    className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 transition-all duration-200"
                  >
                    + Add Feature
                  </Button>
                </div>
                <div className="max-h-[200px] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-3 bg-gray-50 dark:bg-gray-900">
                  {newPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder={`Feature ${index + 1}`}
                        className={cn(
                          "flex-grow px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200",
                          errors.features && "border-red-500"
                        )}
                      />
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFeature(index)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 transition-all duration-200"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                {errors.features && <p className="text-sm text-red-500">{errors.features}</p>}
              </div>

              {/* Plan Status */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Plan Status</Label>
                <div className="flex items-center space-x-6">
                  <Label className="flex items-center space-x-2">
                    <Input
                      type="radio"
                      name="isActive"
                      className="mr-2 accent-indigo-600"
                      checked={newPlan.isActive === true}
                      onChange={() => setNewPlan({ ...newPlan, isActive: true })}
                    />
                    <span className="text-gray-700 dark:text-gray-200">Active</span>
                  </Label>
                  <Label className="flex items-center space-x-2">
                    <Input
                      type="radio"
                      name="isActive"
                      className="mr-2 accent-indigo-600"
                      checked={newPlan.isActive === false}
                      onChange={() => setNewPlan({ ...newPlan, isActive: false })}
                    />
                    <span className="text-gray-700 dark:text-gray-200">Inactive</span>
                  </Label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <DialogFooter className="mt-6 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex items-center gap-2 text-gray-600 border-gray-300 hover:bg-gray-100 transition-all duration-200 rounded-lg"
              >
                <X className="h-4 w-4" /> Cancel
              </Button>
              <Button
                type="submit"
                disabled={createPlanMutation.isLoading}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 rounded-lg relative"
              >
                {createPlanMutation.isLoading ? (
                  <LoadingDots message="Creating plan..." />
                ) : (
                  <>
                    <Check className="h-4 w-4" /> Add Plan
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
}