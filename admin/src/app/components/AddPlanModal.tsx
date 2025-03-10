// components/AddPlanModal.tsx
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { NEXT_URL } from "../constants";

type AddPlanModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onPlanAdded: () => void; // Trigger page refresh
};

export default function AddPlanModal({ isOpen, onClose, onPlanAdded }: AddPlanModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    features: "",
    no_stores: "",
    commission_rate: "",
    discount: "0",
    isActive: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${NEXT_URL}/api/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          features: formData.features.split(",").map((f) => f.trim()),
          no_stores: formData.no_stores,
          commission_rate: parseFloat(formData.commission_rate),
          discount: parseFloat(formData.discount),
          isActive: formData.isActive,
        }),
      });

      if (!response.ok) throw new Error("Failed to create plan");
      onPlanAdded(); // Refresh plans
      onClose();
    } catch (err) {
      console.error("Create plan error:", err);
      alert("Failed to create plan");
    }
  };

  return (
    <dialog open={isOpen} className="modal">
      <div className="modal-box bg-base-100">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Plus className="h-5 w-5" /> Add New Plan
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="label">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label className="label">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="label">Price</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label className="label">Features (comma-separated)</label>
            <input
              type="text"
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="label">Number of Stores</label>
            <input
              type="text"
              value={formData.no_stores}
              onChange={(e) => setFormData({ ...formData, no_stores: e.target.value })}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label className="label">Commission Rate (%)</label>
            <input
              type="number"
              value={formData.commission_rate}
              onChange={(e) => setFormData({ ...formData, commission_rate: e.target.value })}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label className="label">Discount (%)</label>
            <input
              type="number"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Active</span>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="checkbox checkbox-primary"
              />
            </label>
          </div>
          <div className="modal-action">
            <button type="submit" className="btn btn-primary">Save</button>
            <button type="button" onClick={onClose} className="btn">Cancel</button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </dialog>
  );
}