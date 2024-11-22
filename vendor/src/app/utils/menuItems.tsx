"use client";

import { ShoppingCart, Tag, Users, Settings, Store, Wrench, LayoutDashboard } from 'lucide-react';
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Tooltip } from "@medusajs/ui";
import { User } from '@medusajs/icons';

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
        
        const MenuItem = (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out",
              collapsed ? "justify-center" : "justify-start",
              isActive
                ? "bg-gradient-to-r from-blue-200 to-purple-200 text-blue-600 shadow-sm"
                : "text-gray-600 hover:bg-gray-100/80",
            )}
          >
            <item.icon className={cn(
              "h-5 w-5 transition-colors",
              isActive ? "text-blue-600" : "text-gray-500",
              collapsed ? "mx-0" : "mr-3"
            )} />
            {!collapsed && (
              <span className={cn(
                isActive ? "text-blue-600" : "text-gray-700"
              )}>
                {item.title}
              </span>
            )}
          </Link>
        );

        return collapsed ? (
          <Tooltip key={item.href} content={item.title}>
            {MenuItem}
          </Tooltip>
        ) : MenuItem;
      })}
    </div>
  );
}

