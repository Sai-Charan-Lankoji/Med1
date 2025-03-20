"use client";

import { ShoppingCart, Tag, Users, Settings, Store, Wrench, LayoutDashboard, Package, User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MenuItemsProps {
  collapsed: boolean;
  currentPath: string;
}

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/vendor/dashboard",
    description: "Overview of your store",
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    href: "/vendor/orders",
    description: "Manage customer orders",
  },
  {
    title: "Products",
    icon: Tag,
    href: "/vendor/products",
    description: "Manage your products",
  },
  {
    title: "Customers",
    icon: Users,
    href: "/vendor/customers",
    description: "View customer information",
  },
  {
    title: "Store",
    icon: Store,
    href: "/vendor/store",
    description: "Manage store settings",
  },
  {
    title: "Services",
    icon: Wrench,
    href: "/vendor/services",
    description: "Manage offered services",
  },
  {
    title: "Stock",
    icon: Package,
    href: "/vendor/stock-management",
    description: "Inventory management",
  },
  {
    title: "Analytics",
    icon: LayoutDashboard,
    href: "/vendor/Revenue-Analytics",
    description: "Revenue and performance",
  },
  {
    title: "Users",
    icon: User,
    href: "/vendor/users",
    description: "Manage staff accounts",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/vendor/settings",
    description: "Configure your account",
  },
];

export default function MenuItems({ collapsed, currentPath }: MenuItemsProps) {
  return (
    <div className={cn("px-3", collapsed ? "px-2" : "px-4")}>
      {!collapsed && <h3 className="font-medium text-xs uppercase text-base-content/50 mb-4 ml-2">Main Menu</h3>}
      <ul className="space-y-1.5">
        {menuItems.map((item) => {
          const isActive = currentPath === item.href;

          return (
            <li
              key={item.href}
              className={cn(collapsed && "tooltip tooltip-right", "group")}
              data-tip={collapsed ? item.title : ""}
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive ? "bg-primary text-primary-content" : "text-base-content hover:bg-base-200",
                  collapsed ? "justify-center p-2.5" : "",
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-colors duration-200",
                    isActive ? "text-primary-content" : "text-base-content/70 group-hover:text-base-content",
                    collapsed ? "mx-0" : "mr-2",
                  )}
                />
                {!collapsed && (
                  <div className="flex flex-col">
                    <span className={cn(isActive ? "text-primary-content" : "text-base-content")}>{item.title}</span>
                    {!isActive && (
                      <span className="text-xs text-base-content/50 font-normal hidden group-hover:block transition-opacity duration-200">
                        {item.description}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}