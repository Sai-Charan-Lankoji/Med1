// src/app/components/NotifyButton.tsx
"use client";
import { useState } from "react";
import { FaDollarSign, FaCheckCircle } from "react-icons/fa";
import { notifyVendor, notifyAllVendors } from "@/app/api/billingServices/route";

export default function NotifyButton({ vendorId }: { vendorId?: string }) {
  const [isNotifying, setIsNotifying] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleNotify = async () => {
    setIsNotifying(true);
    try {
      if (vendorId) {
        await notifyVendor(vendorId);
      } else {
        await notifyAllVendors();
      }
      setShowSuccessModal(true); // Show modern success modal
      setTimeout(() => setShowSuccessModal(false), 3000); // Auto-close after 3s
    } catch (err) {
      setErrorMessage(`Error: ${err instanceof Error ? err.message : "Unknown"}`);
      setTimeout(() => setErrorMessage(null), 3000); // Clear error after 3s
    } finally {
      setIsNotifying(false);
    }
  };

  return (
    <>
      {/* Notify Button */}
      <button
        onClick={handleNotify}
        disabled={isNotifying}
        className="btn btn-primary btn-sm text-primary-content hover:scale-105 transition-all duration-300 shadow-md flex items-center gap-2"
      >
        {isNotifying ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          <FaDollarSign className="w-5 h-5" />
        )}
        {isNotifying ? "Notifying..." : vendorId ? "Notify Vendor" : "Notify All"}
      </button>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal modal-open">
          <div className="modal-box bg-gradient-to-r from-green-400 to-teal-500 text-white shadow-xl rounded-xl p-6 max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <FaCheckCircle className="w-8 h-8 animate-pulse" />
              <div>
                <h3 className="text-2xl font-bold">Message Sent!</h3>
                <p className="text-lg">
                  {vendorId ? "Vendor notified successfully." : "All vendors notified successfully!"}
                </p>
              </div>
            </div>
            <div className="modal-action mt-4">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="btn btn-sm btn-outline btn-circle text-white hover:bg-white hover:text-teal-500 transition-all"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {errorMessage && (
        <div className="toast toast-end">
          <div className="alert alert-error shadow-lg">
            <span>{errorMessage}</span>
          </div>
        </div>
      )}
    </>
  );
}