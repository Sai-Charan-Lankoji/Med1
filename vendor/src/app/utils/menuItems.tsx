import React from "react";
import Link from "next/link";
import clsx from "clsx";
import {
  ShoppingCart,
  Tag,
  UsersSolid,
  ReceiptPercent,
  Gift,
  CurrencyDollar,
  User,
  CogSixTooth,
  BuildingStorefront,
  Users,
} from "@medusajs/icons";
import { usePathname } from "next/navigation";
import { MdBusinessCenter } from "react-icons/md";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  { name: "Orders", href: "/vendor/orders", icon: <ShoppingCart /> },
  { name: "Products", href: "/vendor/products", icon: <Tag /> },
  { name: "Customers", href: "/vendor/customers", icon: <UsersSolid /> },
  { name: "Store", href: "/vendor/store", icon: <BuildingStorefront />},
  { name: "Settings", href: "/vendor/settings", icon: <CogSixTooth /> },
  { name: "Users", href: "/vendor/users", icon: <Users />}
];

const MenuItems: React.FC = () => {
  const pathname = usePathname();

  return (
    <ul className="space-y-2 px-4 py-8">
      {menuItems.map((item) => (
        <li key={item.href} className="hover:bg-gray-200 p-1 rounded">
          <Link
            href={item.href}
            className={clsx(
              "flex items-center gap-1 p-1 rounded-md text-[14px] font-medium",
              {
                "text-[rgb(17, 24, 39)] bg-gray-200": pathname === item.href,
                "text-[rgb(107, 114, 128)]": pathname !== item.href,
              }
            )}
          >
            {item.icon && <span>{item.icon}</span>}
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default MenuItems;
