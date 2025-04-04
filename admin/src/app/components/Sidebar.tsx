"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaUsers, FaDollarSign, FaCog, FaChevronDown, FaPlayCircle } from "react-icons/fa";
import { LogOut } from "lucide-react";
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
  const router = useRouter();
  const pathname = usePathname();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const getInitial = () => user.first_name.charAt(0).toUpperCase();

  const handleLogout = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      localStorage.removeItem("auth_token");
      router.push("/");
      return;
    }
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        localStorage.removeItem("auth_token");
        router.push("/");
      } else {
        console.error("Logout failed:", await response.text());
        localStorage.removeItem("auth_token");
        router.push("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("auth_token");
      router.push("/");
    }
  };

  const navItems = [
    { href: "/admin/vendors", label: "Vendors", icon: FaUsers },
    { href: "/admin/plans", label: "Plans", icon: FaDollarSign },
    { href: "/admin/billingServices", label: "Billing Services", icon: FaCog },
    { href: "/admin/demo-requests", label: "Demo Requests", icon: FaPlayCircle },
  ];

  return (
    <aside
      className={clsx(
        "min-h-screen bg-base-200 transition-all duration-300 ease-in-out flex flex-col border-r border-base-300 shadow-md",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header with Toggle Button */}
      <div className="p-3 flex items-center justify-between border-b border-b-gray-400 bg-base-100 shadow-sm">
        {!isCollapsed && (
          <span className="text-xl font-bold text-primary">Dashboard</span>
        )}
        <button
          className="btn btn-ghost btn-circle text-base-content hover:bg-base-200 transition-all duration-300"
          onClick={toggleSidebar}
        >
          <FaChevronDown
            className={clsx(
              "w-5 h-5 transition-transform",
              isCollapsed ? "rotate-90" : "-rotate-90"
            )}
          />
        </button>
      </div>

      {/* Profile Section */}
      <div className="p-4 border-b bg-base-100 shadow-sm">
        <div className="dropdown">
          <label
            tabIndex={0}
            className={clsx(
              "btn btn-ghost w-full flex items-center rounded-lg hover:bg-base-200 transition-all duration-300 cursor-pointer",
              isCollapsed ? "justify-center p-0" : "justify-start p-2 space-x-3"
            )}
          >
            <div className="relative flex-shrink-0">
              {user.profilePic ? (
                <Image
                  src={user.profilePic}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-base-300"
                  width={36}
                  height={36}
                />
              ) : (
                <div className="avatar avatar-online avatar-placeholder">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-focus flex items-center justify-center ring-2 ring-base-100">
                    <span className="text-lg font-semibold text-primary-content">
                      {getInitial()}
                    </span>
                  </div>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-base-content truncate">
                    {`${user.first_name} ${user.last_name}` || "Admin"}
                  </span>
                  <span className="badge badge-primary badge-sm text-primary-content">
                    {user.role || "N/A"}
                  </span>
                </div>
                <span className="text-xs text-base-content/70 truncate max-w-[150px]">
                  {user.email || "No email"}
                </span>
              </div>
            )}
          </label>
          {!isCollapsed && (
            <ul
              tabIndex={0}
              className="dropdown-content menu shadow-md bg-base-100 rounded-md w-48 border border-base-300 mt-2"
            >
              <li>
                <button className="btn btn-outline btn-success w-full">
                  <Link
                    href="/forget-password" // Change to forgot-password initially
                    className="flex items-center hover:text-base-300 text-success transition-all duration-300 py-2 px-4"
                  >
                    Reset Password
                  </Link>
                </button>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-error hover:bg-error hover:text-error-content transition-all duration-300 py-2 px-4 w-full text-left"
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
              "flex items-center p-2 mx-2 rounded-lg transition-all duration-300",
              pathname === href
                ? "bg-primary text-primary-content"
                : "text-base-content hover:bg-base-200",
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
        <div className="p-4 text-xs text-base-content/60 border-t bg-base-100 shadow-sm">
          <p>© 2025 Vendor Hub</p>
        </div>
      )}
    </aside>
  );
}