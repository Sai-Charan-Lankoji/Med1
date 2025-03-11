"use client";

import { ShoppingCart, Tag, Users, Settings, Store, Wrench, LayoutDashboard, Package, User } from 'lucide-react';
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MenuItemsProps {
  collapsed: boolean;
  currentPath: string;
}

const menuItems = [
  {
    title: "Orders",
    icon: ShoppingCart,
    href: "/vendor/orders",
  },
  {
    title: "Products",
    icon: Tag,
    href: "/vendor/products",
  },
  {
    title: "Customers",
    icon: Users,
    href: "/vendor/customers",
  },
  {
    title: "Store",
    icon: Store,
    href: "/vendor/store",
  },
  {
    title: "Services",
    icon: Wrench,
    href: "/vendor/services",
  },
  {
    title: "Users",
    icon: User,
    href: "/vendor/users",
  },
  {
    title: "Stock Management",
    icon: Package,
    href: "/vendor/stock-management",
  },
  {
    title: "Revenue-Analytics",
    icon: LayoutDashboard,
    href: "/vendor/Revenue-Analytics",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/vendor/settings",
  },
];

export default function MenuItems({ collapsed, currentPath }: MenuItemsProps) {
  return (
    <div className="space-y-1 px-3">
      {menuItems.map((item) => {
        const isActive = currentPath === item.href;
        
        return (
          <div 
            key={item.href}
            className={collapsed ? "tooltip tooltip-right" : ""}
            data-tip={collapsed ? item.title : ""}
          >
            <Link
              href={item.href}
              className={cn(
                "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out",
                collapsed ? "justify-center" : "justify-start",
                isActive
                  ? "bg-linear-to-r from-blue-200 to-purple-200 text-blue-600 shadow-xs"
                  : "text-gray-600 hover:bg-gray-100/80",
              )}
            >
              <item.icon 
                className={cn(
                  "h-5 w-5 transition-colors",
                  isActive ? "text-blue-600" : "text-gray-500",
                  collapsed ? "mx-0" : "mr-3"
                )} 
              />
              {!collapsed && (
                <span 
                  className={cn(
                    isActive ? "text-blue-600" : "text-gray-700"
                  )}
                >
                  {item.title}
                </span>
              )}
            </Link>
          </div>
        );
      })}
    </div>
  );
};