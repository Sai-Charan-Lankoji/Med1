"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useVendorLogout } from "../hooks/auth/useVendorLogout";
import Link from 'next/link';
import { Settings, LogOut, ChevronDown, Menu } from 'lucide-react';
import { DropdownMenu, IconButton } from "@medusajs/ui"
import { Button } from "@medusajs/ui";
import { cn } from '@/lib/utils';
import MenuItems from '../utils/menuItems';

export default function Sidebar() {
  const {  companyName } = useAuth();
  const { logout, loading } = useVendorLogout();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={cn(
      "relative h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-blue-50 transition-all duration-300 ease-in-out",
      isCollapsed ? "w-20" : "w-64",
      "flex flex-col",
      "border-r border-gray-300",
      "before:content-[''] before:absolute before:top-0 before:right-0 before:bottom-0 before:w-[1px]",
      "before:bg-gradient-to-b before:from-blue-100 before:via-purple-100 before:to-blue-100"
    )}>
      {/* Mobile Toggle */}
      <Button
        variant="transparent"
        className="absolute right-[-40px] top-4 md:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {!isCollapsed && (
            <span className="text-xl font-bold text-blue-700">
              {companyName}
            </span>
          )}
        </div>
        {!isMobile && (
          <Button
            variant="transparent"
            className="hidden md:flex text-blue-600 hover:text-purple-600 transition-colors"
            onClick={toggleSidebar}
          >
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform",
              isCollapsed ? "rotate-90" : "-rotate-90"
            )} />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <MenuItems collapsed={isCollapsed} currentPath={pathname} />
      </nav>

      {/* Footer */}
      <div className={cn(
        "p-4 text-xs text-gray-500",
        isCollapsed ? "text-center" : "text-left"
      )}>
        {!isCollapsed && (
          <p>© 2024 Vendor Hub</p>
        )}
      </div>
    </aside>
  );
}

