"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, User, Globe, BarChart3 } from "lucide-react";
import withAuth from "@/lib/withAuth";
import { useAuth } from "@/app/context/AuthContext";
import { getColors } from "@/app/utils/dummyData";
import DashboardComponent from "../../../../components/dashboard/page";

function PersonalInformation() {
  const { email } = useAuth() ?? { email: "Default Email" };
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });

  const [isEditInfoOpen, setIsEditInfoOpen] = useState(false);
  const [isEditPreferencesOpen, setIsEditPreferencesOpen] = useState(false);
  const [isAnonymized, setIsAnonymized] = useState(false);
  const [isOptedOut, setIsOptedOut] = useState(false);
  const [language, setLanguage] = useState("en");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  if (!email) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <DashboardComponent
      title="Personal Information"
      description="Manage your Medusa profile"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-white/10 backdrop-blur-md shadow-lg rounded-xl border border-gray-200 overflow-hidden">
          <div className="card-body p-6 flex flex-row items-center gap-4">
            <div
              className={`w-12 h-12 flex text-2xl items-center justify-center rounded-full text-black ${getColors(2)}`}
            >
              {email.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-black">{email}</h2>
              <p className="text-sm text-gray-700">Your account email</p>
            </div>
          </div>
          <div className="card-actions p-6 pt-0">
            <button
              onClick={() => setIsEditInfoOpen(true)}
              className="btn btn-secondary w-full bg-white/10 text-black hover:bg-white/20"
            >
              Edit Information
            </button>
          </div>
        </div>

        <div className="card bg-white/10 backdrop-blur-md shadow-lg rounded-xl border border-gray-200 overflow-hidden">
          <div className="card-body p-6">
            <h2 className="text-xl font-bold text-black">Language</h2>
            <p className="text-gray-700 mb-4">Adjust the language of Medusa Admin</p>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="select select-bordered w-full bg-white/10 text-black"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>

        <div className="card md:col-span-2 bg-white/10 backdrop-blur-md shadow-lg rounded-xl border border-gray-200 overflow-hidden">
          <div className="card-body p-6">
            <h2 className="text-xl font-bold text-black">Usage Insights</h2>
            <p className="text-gray-700 mb-4">Share usage insights and help us improve Medusa</p>
            <button
              onClick={() => setIsEditPreferencesOpen(true)}
              className="btn btn-secondary w-full bg-white/10 text-black hover:bg-white/20"
            >
              Edit Preferences
            </button>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6"
      >
        <Link href="/vendor/settings" passHref>
          <button className="btn btn-ghost text-black hover:text-fuchsia-700 flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Settings
          </button>
        </Link>
      </motion.div>

      {isEditInfoOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-[425px] bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-semibold">Edit Information</h3>
            <div className="grid gap-4 py-4">
              <div className="form-control">
                <label htmlFor="firstName" className="label">
                  <span className="label-text text-right">First name</span>
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control">
                <label htmlFor="lastName" className="label">
                  <span className="label-text text-right">Last name</span>
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>
            </div>
            <div className="modal-action flex justify-end mt-4">
              <button
                onClick={() => setIsEditInfoOpen(false)}
                className="btn btn-primary bg-violet-500 text-white hover:bg-violet-700"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditPreferencesOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-[425px] bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-semibold">Edit Preferences</h3>
            <div className="py-4">
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <label htmlFor="anonymize" className="label-text">
                    Anonymize my usage data
                  </label>
                  <p className="text-sm text-gray-500">
                    Choose to anonymize your usage data
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="anonymize"
                  checked={isAnonymized}
                  onChange={() => setIsAnonymized(!isAnonymized)}
                  className="toggle toggle-primary"
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <label htmlFor="optout" className="label-text">
                    Opt out of sharing my usage data
                  </label>
                  <p className="text-sm text-gray-500">
                    Choose to opt out of sharing your usage data
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="optout"
                  checked={isOptedOut}
                  onChange={() => setIsOptedOut(!isOptedOut)}
                  className="toggle toggle-primary"
                />
              </div>
            </div>
            <div className="modal-action flex justify-end mt-4">
              <button
                onClick={() => setIsEditPreferencesOpen(false)}
                className="btn btn-primary bg-violet-500 text-white hover:bg-violet-700"
              >
                Save preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardComponent>
  );
}

export default withAuth(PersonalInformation);