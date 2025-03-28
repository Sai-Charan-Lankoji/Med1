// components/DeletePlanModal.tsx
"use client";

import { useState } from "react";

interface DeletePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string | null;
  planName: string;
  onPlanDeleted: () => void;
  cookieHeader: string;
}

export default function DeletePlanModal({
  isOpen,
  onClose,
  planId,
  planName,
  onPlanDeleted,
  cookieHeader,
}: DeletePlanModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!planId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/plan?id=${planId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieHeader,
        },
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete plan');
      }

      onPlanDeleted(); // Trigger refreshPlans
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !planId) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Delete Plan</h3>
        <p className="py-4">
          Are you sure you want to delete the plan &quot;<strong>{planName}</strong>&quot;? This action cannot be undone.
        </p>
        {error && <div className="alert alert-error mb-4">{error}</div>}
        <div className="modal-action">
          <button
            className="btn btn-error"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
          <button
            className="btn"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}