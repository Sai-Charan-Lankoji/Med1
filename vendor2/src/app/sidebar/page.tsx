"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useVendorLogout } from "../hooks/auth/useVendorLogout";
import Link from "next/link";
import { Settings, LogOut, ChevronDown, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import MenuItems from "../utils/menuItems";
import { company_name } from "../utils/constant";

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
    <div className="relative">
      {/* Mobile Toggle */}
      <button
        className="btn btn-ghost absolute right-[-40px] top-4 md:hidden z-50"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
      </button>

      <aside
        className={cn(
          "h-screen transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64",
          "flex flex-col",
          "border-r border-gray-300",
          "bg-gradient-to-b from-blue-50 via-purple-50 to-blue-50",
          "relative"
        )}
      >
        {/* Gradient Border */}
        <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-gradient-to-b from-blue-100 via-purple-100 to-blue-100" />

        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {!isCollapsed && (
              <span className="text-xl font-bold text-blue-700">
                {companyName}
              </span>
            )}
          </div>
          <button
            className="btn btn-ghost hidden md:flex text-blue-600 hover:text-purple-600"
            onClick={toggleSidebar}
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                isCollapsed ? "rotate-90" : "-rotate-90"
              )}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <MenuItems collapsed={isCollapsed} currentPath={pathname} />
        </nav>

        {/* Footer */}
        <div
          className={cn(
            "p-4 text-xs text-gray-500",
            isCollapsed ? "text-center" : "text-left"
          )}
        >
          {!isCollapsed && <p>© 2024 Vendor Hub</p>}
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;