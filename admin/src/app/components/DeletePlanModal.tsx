// components/DeletePlanModal.tsx
"use client";

import { useState } from "react";
import { deletePlan, getAllPlans, Plan } from "@/app/api/plan/route";

type DeletePlanModalProps = {
  isOpen: boolean;
  onClose: () => void;
  planId: string | null;
  planName: string;
  onPlanDeleted: (updatedPlans: Plan[]) => void; // Updated type to match refreshPlans
  cookieHeader: string;
};

export default function DeletePlanModal({ isOpen, onClose, planId, planName, onPlanDeleted, cookieHeader }: DeletePlanModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!planId) return;
    setIsLoading(true);
    try {
      await deletePlan(planId, cookieHeader);
      const updatedPlans = await getAllPlans(cookieHeader);
      onPlanDeleted(updatedPlans);
      onClose();
    } catch (err) {
      console.error("Delete plan error:", err);
      alert("Failed to delete plan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <dialog open={isOpen} className="modal modal-bottom sm:modal-middle animate-fade-in-up">
      <div className="modal-box bg-base-100 shadow-2xl border border-base-300 rounded-xl">
        <h3 className="font-bold text-xl text-error">Delete Plan</h3>
        <p className="py-4">
          Are you sure you want to delete <span className="font-semibold">{planName}</span>? This action cannot be undone.
        </p>
        <div className="modal-action">
          <button
            onClick={handleDelete}
            className="btn btn-error hover:scale-105 transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={onClose}
            className="btn btn-outline hover:scale-105 transition-all duration-300"
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </dialog>
  );
}