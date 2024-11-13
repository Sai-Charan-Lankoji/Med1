"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BuildingStorefront, User } from "@medusajs/icons";
import { Button } from "@medusajs/ui"

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <BuildingStorefront className="h-6 w-6" />
            <span className="font-bold">VendorHub</span>
          </Link>
          <div className="flex items-center space-x-4">
            {pathname !== "/login" && (
              <Link href="/login">
                <Button variant="secondary" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Already a Vendor?</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}