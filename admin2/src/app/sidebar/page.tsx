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
  const { email, first_name } = useAuth() ?? { email: '' };
  const { logout, loading } = useVendorLogout();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsCollapsed(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

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
              Admin
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

      {/* Profile Section */}
      <div className={cn(
        "p-4 flex items-center",
        isCollapsed ? "justify-center" : "justify-start"
      )}>
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <Button
              variant="transparent"
              className={cn(
                "relative flex items-center space-x-3 hover:bg-white/50 transition-colors",
                isCollapsed ? "w-10 h-10 p-0" : "w-full justify-start p-2"
              )}
            >
              <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {first_name?.slice(0, 1).toUpperCase()}
                </span>
              </div>
              {!isCollapsed && (
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-900">
                    {first_name}
                  </span>
                  <span className="text-xs text-gray-500 truncate max-w-[150px]">
                    {email}
                  </span>
                </div>
              )}
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="start" className="w-56">
            <DropdownMenu.Item asChild>
              <Link href="/vendor/settings" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item
              className="text-red-600 focus:text-red-600"
              onClick={handleLogout}
              disabled={loading}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{loading ? 'Logging out...' : 'Logout'}</span>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
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
          <p>© 2024 Admin Dashboard</p>
        )}
      </div>
    </aside>
  );
}

