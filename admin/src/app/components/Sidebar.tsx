// src/app/components/Sidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaUsers, FaDollarSign, FaCog, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Settings, LogOut } from "lucide-react";
import Image from "next/image";
import clsx from "clsx";

type User = {
  first_name: string;
  last_name: string;
  role: string;
  email: string;
  profilePic?: string;
};

export default function Sidebar({ user }: { user: User }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const getInitial = () => user.first_name.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        router.push("/");
      } else {
        console.error("Logout failed:", await response.text());
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { href: "/admin/vendors", label: "Vendors", icon: FaUsers },
    { href: "/admin/plans", label: "Plans", icon: FaDollarSign },
    { href: "/admin/billingServices", label: "Billing Services", icon: FaCog },
  ];

  return (
    <aside
      className={clsx(
        "min-h-screen bg-base-200 transition-all duration-300 ease-in-out flex flex-col border-r border-base-300 shadow-sm relative",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Toggle Button at Top Right */}
      <button
        className="btn btn-ghost btn-sm text-base-content/70 hover:text-base-content absolute top-2 right-2 z-10"
        onClick={toggleSidebar}
      >
        {isCollapsed ? <FaChevronRight className="w-5 h-5" /> : <FaChevronLeft className="w-5 h-5" />}
      </button>

      {/* Header */}
      <div className="p-4 pt-12 flex items-center justify-between border-b bg-base-100">
        {!isCollapsed && <span className="text-xl font-bold text-base-content">Dashboard</span>}
      </div>

      {/* Profile Section */}
      <div className="p-4 border-b bg-base-100">
        <div
          className={clsx(
            "dropdown dropdown-hover w-full",
            isCollapsed ? "dropdown-end" : "dropdown-bottom"
          )}
        >
          <button
            tabIndex={0}
            className={clsx(
              "flex items-center w-full p-2 rounded-lg hover:bg-base-200 transition-colors",
              isCollapsed ? "justify-center" : "justify-start space-x-3"
            )}
            onClick={() => !isCollapsed && setIsDropdownOpen(!isDropdownOpen)}
          >
            {user.profilePic ? (
              <Image
                src={user.profilePic}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-base-300"
                width={40}
                height={40}
              />
            ) : (
              <div className="avatar avatar-online">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-focus flex items-center justify-center ring-2 ring-base-100">
                  <span className="text-lg font-semibold text-primary-content">{getInitial()}</span>
                </div>
              </div>
            )}
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-base-content truncate">
                    {`${user.first_name} ${user.last_name}`}
                  </span>
                  <span className="badge badge-primary badge-sm">{user.role}</span>
                </div>
                <span className="text-xs text-base-content/70 truncate max-w-[150px]">{user.email}</span>
              </div>
            )}
          </button>

          {/* Dropdown Menu */}
          {!isCollapsed && isDropdownOpen && (
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-56 border border-base-200 z-10"
            >
              <li>
                <Link href="/admin/settings" className="flex items-center text-base-content">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-error hover:bg-error hover:text-error-content"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex items-center p-2 mx-2 rounded-lg transition-colors duration-200",
              pathname === href
                ? "bg-primary text-primary-content"
                : "text-base-content hover:bg-base-300",
              isCollapsed ? "justify-center" : "space-x-3"
            )}
            title={isCollapsed ? label : undefined}
          >
            <Icon
              className={clsx(
                "w-5 h-5",
                pathname === href ? "text-primary-content" : "text-primary"
              )}
            />
            {!isCollapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 mb-auto text-xs text-base-content/60 border-t bg-base-100">
          <p>© 2025 VendorSync</p>
          <p>Version 1.0.0</p>
        </div>
      )}
    </aside>
  );
}