"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BellAlert, QuestionMarkCircle } from "@medusajs/icons";
import { Button, Drawer, DropdownMenu, Input } from "@medusajs/ui";
import { useAuth } from "../context/AuthContext";
import { cn } from "@/lib/utils";
import { Settings, LogOut } from "lucide-react";
import { useVendorLogout } from "../hooks/auth/useVendorLogout";
import Link from 'next/link';
// const contact_name = typeof window !== "undefined" ? sessionStorage.getItem("contact_name") : null;
// const vendor_email = typeof window !== "undefined" ? sessionStorage.getItem("email") : null;

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout, loading } = useVendorLogout();
  const { email, contactName } = useAuth()
  const handleLogout = async () => {
    await logout();
    sessionStorage.clear();
    router.refresh()
    router.push('/login');
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 text-black h-16 shadow-md border-b border-gray-300">
      <div className="flex items-center space-x-4">
        {/* Left side content can be added here if needed */}
      </div>

      <div className="flex items-center space-x-4">
        {/* User Details Dropdown */}
        <div className={cn(
          "p-4 flex items-center",
          isCollapsed ? "justify-center" : "justify-start"
        )}>
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button
                variant="transparent"
                className={cn(
                  "relative flex items-center space-x-3 transition-colors",
                  isCollapsed ? "w-10 h-10 p-0" : "w-full justify-start p-2"
                )}
              >
                <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {contactName?.slice(0, 1).toUpperCase()}
                  </span>
                </div>
                {!isCollapsed && (
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-gray-900">
                      {contactName}
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

        {/* Support Icon */}
        <Drawer>
          <Drawer.Trigger asChild>
            <button className="transition-colors">
              <QuestionMarkCircle className="w-6 h-6 text-black/100 hover:text-black" />
            </button>
          </Drawer.Trigger>
          <Drawer.Content className="bg-white text-black z-50">
            <Drawer.Header>
              <Drawer.Title className="text-2xl font-bold text-black">Support</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-black">How can we help?</h3>
              <p className="text-sm text-white-black mb-6">We usually respond in a few hours</p>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-black mb-1">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="What is it about?"
                    className="w-full bg-transparent border border-gray-500 rounded-xl"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-black mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    placeholder="Write your message here..."
                    className="w-full p-2 border bg-transparent border-gray-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-800 transition-all duration-300"
                  />
                </div>
              </div>
            </Drawer.Body>
            <Drawer.Footer>
              <Button className="w-full rounded-xl bg-gray-700 transition-colors">
                Send Message
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>

        {/* Notifications Icon */}
        <Drawer>
          <Drawer.Trigger asChild>
            <button className="text-black/100 hover:text-black transition-colors">
              <BellAlert className="w-6 h-6" />
            </button>
          </Drawer.Trigger>
          <Drawer.Content className="bg-white text-black z-50">
            <Drawer.Header>
              <Drawer.Title className="text-2xl font-bold text-black">Notifications</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body className="p-6">
              <p className="text-black">You have no new notifications.</p>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer>
      </div>
    </nav>
  );
};

export default Navbar;