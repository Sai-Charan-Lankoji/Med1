"use client";

import React, { useState } from 'react';
import { ArrowRightOnRectangle, CogSixTooth } from "@medusajs/icons";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useVendorLogout } from "../hooks/auth/useVendorLogout";
import MenuItems from '../utils/menuItems';
import Link from 'next/link';

export default function Sidebar() {
  const { email, contactName } = useAuth() ?? { email: '' };
  const [showPopup, setShowPopup] = useState(false);
  const { logout, loading, error } = useVendorLogout(); // Use the custom hook
  const router = useRouter();

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="w-64 bg-transparent text-gray-500 h-screen shadow-lg relative">
      <div className="mb-4 flex w-full items-center px-4 py-6 relative">
        <div
          className="text-gray-50 flex h-8 w-8 items-center justify-center bg-black rounded-full cursor-pointer"
          onClick={togglePopup}
        >
          {contactName?.slice(0, 1).toLocaleUpperCase()}
        </div>
        <span className="ml-3 text-[rgb(17, 24, 39)] font-semibold">{contactName}</span>

        {showPopup && (
          <div className="absolute top-16 left-6 w-40 bg-white shadow-lg rounded-lg p-2 z-10">
            <ul className="space-y-2">
              <li>
                <Link href="/vendor/settings" className="text-[13px] font-semibold flex justify-evenly text-gray-700 hover:bg-gray-200 rounded p-1">
                  <CogSixTooth /> Settings
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-[13px] font-semibold flex justify-evenly text-left text-red-500 hover:bg-gray-200 rounded p-1"
                >
                  <ArrowRightOnRectangle /> Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
      <MenuItems /> 
    </div>
  );
}
