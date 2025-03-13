// components/PlanModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { createPlan, updatePlan, getAllPlans, Plan, PlanData } from "@/app/api/plan/route"; // Added getAllPlans to imports

type PlanModalProps = {
  isOpen: boolean;
  onClose: () => void;
  plan?: Plan | null;
  onPlanSaved: (updatedPlans: Plan[]) => void;
  cookieHeader: string;
};

export default function PlanModal({ isOpen, onClose, plan, onPlanSaved, cookieHeader }: PlanModalProps) {
  const [formData, setFormData] = useState<Plan>(() => {
    const defaultPlan: Plan = {
      id: "",
      name: "",
      price: "",
      features: [],
      discount: 0,
      isActive: false,
      created_at: "",
      updated_at: "",
      deleted_at: null,
      description: "",
      no_stores: "",
      commission_rate: 0,
    };
    return plan ? { ...defaultPlan, ...plan, features: plan.features || [] } : defaultPlan;
  });

  useEffect(() => {
    const defaultPlan: Plan = {
      id: "",
      name: "",
      price: "",
      features: [],
      discount: 0,
      isActive: false,
      created_at: "",
      updated_at: "",
      deleted_at: null,
      description: "",
      no_stores: "",
      commission_rate: 0,
    };
    setFormData(plan ? { ...defaultPlan, ...plan, features: plan.features || [] } : defaultPlan);
  }, [plan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const planData: PlanData = {
        name: formData.name,
        price: formData.price,
        description: formData.description,
        features: formData.features,
        discount: formData.discount,
        isActive: formData.isActive,
        no_stores: formData.no_stores,
        commission_rate: formData.commission_rate,
      };

      if (plan) {
        await updatePlan(plan.id, planData, cookieHeader);
      } else {
        await createPlan(planData, cookieHeader);
      }
      const updatedPlans = await getAllPlans(cookieHeader); // Now recognized with the import
      onPlanSaved(updatedPlans);
      onClose();
    } catch (err) {
      console.error(`${plan ? "Update" : "Create"} plan error:`, err);
      alert(`Failed to ${plan ? "update" : "create"} plan`);
    }
  };

  return (
    <dialog open={isOpen} className="modal modal-bottom sm:modal-middle animate-fade-in-up">
      <div className="modal-box bg-base-100 shadow-2xl border border-base-300 rounded-xl">
        <h3 className="font-bold text-xl flex items-center gap-2 text-primary">
          {plan ? "Edit Plan" : <><Plus className="h-6 w-6" /> Add New Plan</>}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Name</span></label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input input-bordered w-full focus:ring-2 focus:ring-primary transition-all duration-300"
              required
            />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Description</span></label>
            <input
              type="text"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input input-bordered w-full focus:ring-2 focus:ring-primary transition-all duration-300"
            />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Price</span></label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="input input-bordered w-full focus:ring-2 focus:ring-primary transition-all duration-300"
              required
            />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Features (comma-separated)</span></label>
            <input
              type="text"
              value={formData.features?.join(", ") || ""}
              onChange={(e) => setFormData({ ...formData, features: e.target.value.split(",").map((f) => f.trim()) })}
              className="input input-bordered w-full focus:ring-2 focus:ring-primary transition-all duration-300"
            />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Number of Stores</span></label>
            <input
              type="text"
              value={formData.no_stores}
              onChange={(e) => setFormData({ ...formData, no_stores: e.target.value })}
              className="input input-bordered w-full focus:ring-2 focus:ring-primary transition-all duration-300"
              required
            />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Commission Rate (%)</span></label>
            <input
              type="number"
              value={formData.commission_rate}
              onChange={(e) => setFormData({ ...formData, commission_rate: parseFloat(e.target.value) || 0 })}
              className="input input-bordered w-full focus:ring-2 focus:ring-primary transition-all duration-300"
              required
            />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Discount (%)</span></label>
            <input
              type="number"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
              className="input input-bordered w-full focus:ring-2 focus:ring-primary transition-all duration-300"
            />
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text font-semibold">Active</span>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="checkbox checkbox-primary"
              />
            </label>
          </div>
          <div className="modal-action">
            <button type="submit" className="btn btn-primary hover:scale-105 transition-all duration-300">
              {plan ? "Update" : "Create"}
            </button>
            <button type="button" onClick={onClose} className="btn btn-outline hover:scale-105 transition-all duration-300">
              Cancel
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </dialog>
  );
}