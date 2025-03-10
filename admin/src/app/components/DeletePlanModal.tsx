// components/DeletePlanModal.tsx
"use client";

import { NEXT_URL } from "../constants";

type DeletePlanModalProps = {
  isOpen: boolean;
  onClose: () => void;
  planId: string | null;
  planName: string;
  onPlanDeleted: () => void;
};

export default function DeletePlanModal({ isOpen, onClose, planId, planName, onPlanDeleted }: DeletePlanModalProps) {
  const handleDelete = async () => {
    try {
      const response = await fetch(`${NEXT_URL}/api/plan/${planId}`, {
        method: "DELETE",
        credentials: "include", 
      });

      if (!response.ok) throw new Error("Failed to delete plan");
      onPlanDeleted();
      onClose();
    } catch (err) {
      console.error("Delete plan error:", err);
      alert("Failed to delete plan");
    }
  };

  if (!planId) return null;

  return (
    <dialog open={isOpen} className="modal">
      <div className="modal-box bg-base-100">
        <h3 className="font-bold text-lg">Delete Plan: {planName}</h3>
        <p className="py-4">Are you sure you want to delete this plan? This action cannot be undone.</p>
        <div className="modal-action">
          <button onClick={handleDelete} className="btn btn-error">Delete</button>
          <button onClick={onClose} className="btn">Cancel</button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </dialog>
  );
}