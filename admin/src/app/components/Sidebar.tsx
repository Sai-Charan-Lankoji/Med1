// components/Sidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUsers, FaDollarSign, FaCog, FaBars } from "react-icons/fa";
import { NEXT_URL } from "@/app/constants"; 
import Image from "next/image";

type User = {
  first_name: string;
  last_name: string;
  role: string;
  email: string;
  profilePic?: string;
};

export default function Sidebar({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const getInitial = () => user.first_name.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${NEXT_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        router.push("/"); // Redirect to login page
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-20 btn btn-circle"
        onClick={toggleSidebar}
      >
        <FaBars />
      </button>
      <div
        className={`fixed inset-y-0 left-0 z-10 w-64 bg-base-200 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Profile Section */}
          <div className="flex items-center mb-6 cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            {user.profilePic ? (
              <Image
                src={user.profilePic}
                alt="Profile"
                className="w-12 h-12 rounded-full mr-3"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-2xl mr-3">
                {getInitial()}
              </div>
            )}
            <div>
              <p className="font-semibold text-base-content">{`${user.first_name} ${user.last_name}`}</p>
              <p className="text-sm text-gray-500">{user.role}</p>
            </div>
          </div>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mb-4">
              <button className="btn btn-ghost w-full text-left" onClick={handleLogout}>
                Logout
              </button>
              <Link href="/admin/reset-password" className="btn btn-ghost w-full text-left">
                Reset Password
              </Link>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1">
            <Link href="/admin/vendors" className="flex items-center p-2 hover:bg-base-300 rounded text-base-content">
              <FaUsers className="mr-3" /> Vendors
            </Link>
            <Link href="/admin/plans" className="flex items-center p-2 hover:bg-base-300 rounded text-base-content">
              <FaDollarSign className="mr-3" /> Plans
            </Link>
            <Link href="/admin/billingServices" className="flex items-center p-2 hover:bg-base-300 rounded text-base-content">
              <FaCog className="mr-3" /> Billing Services
            </Link>
          </nav>

          {/* Footer */}
          <div className="mt-auto text-center text-sm text-gray-500">
            <p>© 2025 VendorSync</p>
            <p>Version 1.0.0</p>
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden z-0"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}