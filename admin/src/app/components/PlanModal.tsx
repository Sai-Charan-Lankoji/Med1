// components/PlanModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { NEXT_URL } from "@/app/constants";

type Plan = {
  id: string;
  name: string;
  price: string;
  features: string[];
  discount: number;
  isActive: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  description?: string;
  no_stores: string;
  commission_rate: number;
};

type PlanModalProps = {
  isOpen: boolean;
  onClose: () => void;
  plan?: Plan | null;
  onPlanSaved: () => void;
};

export default function PlanModal({ isOpen, onClose, plan, onPlanSaved }: PlanModalProps) {
  const [formData, setFormData] = useState<Plan>(() => {
    // Always return a fully defined object
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
    // Reset formData when plan changes (edit mode) or clears (create mode)
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
      const url = plan ? `${NEXT_URL}/api/plan/${plan.id}` : `${NEXT_URL}/api/plan`;
      const method = plan ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          features: formData.features,
          commission_rate: parseFloat(formData.commission_rate.toString()),
          discount: parseFloat(formData.discount.toString()),
        }),
      });

      if (!response.ok) throw new Error(`Failed to ${plan ? "update" : "create"} plan`);
      onPlanSaved();
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
              value={formData.description}
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
              value={formData.features.join(", ")}
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
              onChange={(e) => setFormData({ ...formData, commission_rate: parseFloat(e.target.value) })}
              className="input input-bordered w-full focus:ring-2 focus:ring-primary transition-all duration-300"
              required
            />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Discount (%)</span></label>
            <input
              type="number"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) })}
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