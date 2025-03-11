"use client";

import { ArrowLeft, Settings, MoreHorizontal } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import withAuth from "@/lib/withAuth";

const Taxes = () => {
  const router = useRouter();

  return (
    <div>
      <div className="p-4 flex items-center">
        <button
          className="btn btn-ghost text-sm text-gray-500 font-semibold flex items-center"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to settings
        </button>
      </div>

      <div className="max-w-[400px] mx-auto bg-white min-h-screen p-6 rounded-lg shadow-md">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-2xl font-semibold mb-2">Regions</h2>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <MoreHorizontal className="h-5 w-5" />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <button
                  onClick={() => router.push("/vendor/settings/regions")}
                  className="flex items-center gap-2 p-2"
                >
                  <Settings className="h-5 w-5" />
                  <span className="text-sm">Go to Region settings</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Select the region you wish to manage taxes for
        </p>
      </div>
    </div>
  );
};

export default withAuth(Taxes);