"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Plus, X } from "lucide-react";
import withAuth from "@/lib/withAuth";
import DashboardComponent from "../../../../components/dashboard/page";

const ReturnReasons = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <DashboardComponent
      title="Return Reasons"
      description="Manage reasons for returned items"
    >
      <div className="card bg-white/10 backdrop-blur-md shadow-lg rounded-xl border border-gray-200 overflow-hidden">
        <div className="card-header flex flex-row items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-white">Return Reasons</h2>
          <button
            onClick={openModal}
            className="btn btn-secondary bg-white/10 text-white hover:bg-white/20 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add reason
          </button>
        </div>
        <div className="card-body p-6">
          <p className="text-white/80">No return reasons added yet.</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6"
      >
        <Link href="/vendor/settings" passHref>
          <button className="btn btn-ghost text-white hover:text-fuchsia-700 flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Settings
          </button>
        </Link>
      </motion.div>

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-[600px] bg-white p-6 rounded-lg shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Reason</h3>
              <button onClick={closeModal} className="btn btn-ghost btn-circle">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="form-control">
                  <label htmlFor="value" className="label">
                    <span className="label-text">
                      Value <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input
                    id="value"
                    placeholder="wrong_size"
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="label" className="label">
                    <span className="label-text">
                      Label <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input
                    id="label"
                    placeholder="Wrong size"
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
              <div className="form-control py-4">
                <label htmlFor="description" className="label">
                  <span className="label-text">
                    Description <span className="text-red-500">*</span>
                  </span>
                </label>
                <textarea
                  id="description"
                  placeholder="Describe the return reason"
                  className="textarea textarea-bordered w-full h-24"
                />
              </div>
            </form>
            <div className="modal-action flex justify-end gap-2 mt-4">
              <button onClick={closeModal} className="btn btn-secondary">
                Cancel
              </button>
              <button className="btn btn-primary bg-violet-600 text-white hover:bg-violet-700">
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardComponent>
  );
};

export default withAuth(ReturnReasons);