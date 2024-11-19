"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BuildingStorefront, User, ShoppingBag } from "@medusajs/icons";
import { Button } from "@medusajs/ui";

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-slate-50 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto ">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 transition-transform hover:scale-105">
            <BuildingStorefront className=" text-purple-600" />
            <span className="font-bold text-2xl tracking-tight text-purple-600">VendorHub</span>
          </Link>
          <div className="flex items-center space-x-6">
          
            <Link href="/about" className="hidden sm:flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
              <span className="font-medium">About Us</span>
            </Link>
            {pathname !== "/login" && (
              <Link href="/login">
                <Button 
                  variant="secondary" 
                  className="flex items-center space-x-2 bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-300 shadow-md hover:shadow-lg rounded-2xl"
                >
                  <User className="h-5 w-5" />
                  <span className="font-semibold">Vendor Login</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}