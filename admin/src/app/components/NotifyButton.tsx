// src/app/components/NotifyButton.tsx (with optional vendorId)
"use client";
import { useState } from "react";
import { FaDollarSign, FaCheckCircle } from "react-icons/fa";
import { notifyVendor } from "@/app/api/billingServices/route";

export default function NotifyButton({ vendorId }: { vendorId?: string }) {
  const [isNotifying, setIsNotifying] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleNotify = async () => {
    if (!vendorId) return; 

    setIsNotifying(true);
    try {
      await notifyVendor(vendorId);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 3000);
    } catch (err) {
      console.error('Notification error:', err);
      setErrorMessage(`Error: ${err instanceof Error ? err.message : "Unknown"}`);
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setIsNotifying(false);
    }
  };

  if (!vendorId) return null; 

  return (
    <>
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
        {isNotifying ? "Notifying..." : "Notify Vendor"}
      </button>

      {showSuccessModal && (
        <div className="modal modal-open">
          <div className="modal-box bg-gradient-to-r from-green-400 to-teal-500 text-white shadow-xl rounded-xl p-6 max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <FaCheckCircle className="w-8 h-8 animate-pulse" />
              <div>
                <h3 className="text-2xl font-bold">Message Sent!</h3>
                <p className="text-lg">Vendor notified successfully.</p>
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