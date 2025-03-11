"use client";

import React from 'react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Store, UserRound, Settings, LogOut } from "lucide-react";
import { useAuth } from '@/app/context/AuthContext';
import { useVendorLogout } from '@/app/hooks/auth/useVendorLogout';

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { email, contactName, companyName } = useAuth() ?? {
    email: '',
    contactName: '',
    companyName: ''
  };
  const { logout, loading } = useVendorLogout();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <nav className="navbar bg-slate-50 shadow-lg sticky top-0 z-50">
      {/* Logo Section */}
      <div className="navbar-start">
        <Link href="/" className="flex items-center space-x-3 transition-transform hover:scale-105">
          <Store className="text-purple-600" />
          <span className="font-bold text-2xl tracking-tight text-purple-600">
            {companyName}
          </span>
        </Link>
      </div>

      {/* Navigation Items */}
      <div className="navbar-end flex items-center space-x-4">
        {/* About Us Link */}
        <Link href="/about" className="btn btn-ghost hidden sm:inline-flex">
          About Us
        </Link>

        {/* Authentication State */}
        {!email ? (
          pathname !== "/login" && (
            <Link href="/login" className="btn text-white bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg rounded-2xl flex items-center space-x-2">
              <UserRound className="h-5 w-5" />
              <span className="font-semibold">Vendor Login</span>
            </Link>
          )
        ) : (
          <div className="dropdown dropdown-end">
            {/* Dropdown Trigger */}
            <label tabIndex={0} className="btn btn-ghost flex items-center space-x-2">
              <div className="avatar">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-medium">
                    {contactName?.slice(0, 1).toUpperCase()}
                  </span>
                </div>
              </div>
              <span className="hidden sm:inline text-sm font-medium text-gray-900">
                {contactName}
              </span>
            </label>

            {/* Dropdown Content */}
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-56">
              <li>
                <Link href="/vendor/settings" className="flex items-center rounded-xl hover:bg-blue-400">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="flex items-center rounded-xl hover:bg-blue-400 text-error w-full text-left"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {loading ? 'Logging out...' : 'Logout'}
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}