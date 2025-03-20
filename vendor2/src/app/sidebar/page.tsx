"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useVendorLogout } from "../hooks/auth/useVendorLogout";
import Link from "next/link";
import { ChevronLeft, Menu } from 'lucide-react';
import { cn } from "@/lib/utils";
import MenuItems from "../utils/menuItems";

const Sidebar = () => {
  const { logout, loading } = useVendorLogout();
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { companyName } = useAuth();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="relative h-screen">
      {/* Mobile Toggle */}
      <button
        className="btn btn-ghost btn-circle absolute right-[-48px] top-4 md:hidden z-50 shadow-md bg-base-100"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5 text-primary" />
      </button>

      <aside
        className={cn(
          "h-screen transition-all duration-300 ease-in-out bg-base-100 shadow-lg",
          isCollapsed ? "w-20" : "w-64",
          "flex flex-col border-r border-base-200"
        )}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-base-200 bg-base-100">
          <div className="flex items-center space-x-3">
            {!isCollapsed ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-primary-content font-bold">
                  {companyName?.charAt(0) || "V"}
                </div>
                <span className="text-lg font-semibold text-primary">
                  {companyName || "Vendor Hub"}
                </span>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center text-primary-content font-bold mx-auto">
                {companyName?.charAt(0) || "V"}
              </div>
            )}
          </div>
          <button
            className="btn btn-ghost btn-sm btn-circle hidden md:flex text-primary hover:bg-primary hover:bg-opacity-10"
            onClick={toggleSidebar}
          >
            <ChevronLeft
              className={cn(
                "h-5 w-5 transition-transform",
                isCollapsed ? "rotate-180" : "rotate-0"
              )}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 bg-base-100">
          <MenuItems collapsed={isCollapsed} currentPath={pathname} />
        </nav>

        {/* Footer */}
        <div
          className={cn(
            "p-4 text-xs border-t border-base-200 bg-base-100",
            isCollapsed ? "text-center" : "text-left"
          )}
        >
          {!isCollapsed ? (
            <div className="flex flex-col gap-2">
              <p className="text-base-content/70">© 2024 Vendor Hub</p>
              <button 
                onClick={logout} 
                className="btn btn-sm btn-outline btn-error w-full justify-start"
                disabled={loading}
              >
                {loading ? "Logging out..." : "Logout"}
              </button>
            </div>
          ) : (
            <button 
              onClick={logout} 
              className="btn btn-sm btn-circle btn-outline btn-error mx-auto"
              disabled={loading}
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          )}
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
