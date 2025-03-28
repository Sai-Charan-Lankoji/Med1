// components/PlanModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Plan, PlanData } from "@/app/api/plan/route";

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
  onPlanSaved: () => void;
  cookieHeader: string;
}

export default function PlanModal({
  isOpen,
  onClose,
  plan,
  onPlanSaved,
  cookieHeader,
}: PlanModalProps) {
  const [formData, setFormData] = useState<PlanData>({
    name: "",
    price: "",
    description: "",
    features: [],
    discount: 0,
    isActive: false,
    no_stores: "",
    commission_rate: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        price: plan.price,
        description: plan.description || "",
        features: plan.features || [],
        discount: plan.discount || 0,
        isActive: plan.isActive || false,
        no_stores: plan.no_stores || "",
        commission_rate: plan.commission_rate || 0,
      });
    } else {
      setFormData({
        name: "",
        price: "",
        description: "",
        features: [],
        discount: 0,
        isActive: false,
        no_stores: "",
        commission_rate: 0,
      });
    }
  }, [plan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const url = plan?.id ? `/api/plan?id=${plan.id}` : '/api/plan';
      const method = plan?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieHeader,
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || `Failed to ${plan?.id ? 'update' : 'create'} plan`);
      }

      onPlanSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{plan ? 'Edit Plan' : 'Add New Plan'}</h3>
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
            <label className="label">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="textarea textarea-bordered w-full"
            />
          </div>
          <div>
            <label className="label">Features (comma-separated)</label>
            <input
              type="text"
              value={formData.features?.join(',')}
              onChange={(e) => setFormData({ ...formData, features: e.target.value.split(',') })}
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="label">Discount (%)</label>
            <input
              type="number"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
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
            />
          </div>
          <div>
            <label className="label">Commission Rate (%)</label>
            <input
              type="number"
              value={formData.commission_rate}
              onChange={(e) => setFormData({ ...formData, commission_rate: Number(e.target.value) })}
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
                className="checkbox"
              />
            </label>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="modal-action">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="btn" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}