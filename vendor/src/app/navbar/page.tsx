"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { BellAlert, QuestionMarkCircle } from "@medusajs/icons";
import { Button, DropdownMenu, Input } from "@medusajs/ui";
import { vendor_id } from "../utils/constant";
import {
  DrawerRoot,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/custom-drawer"; // Adjust path
import { useAuth } from "../context/AuthContext";
import { cn } from "@/lib/utils";
import { Settings, LogOut } from "lucide-react";
import { useVendorLogout } from "../hooks/auth/useVendorLogout";
import Link from "next/link";
import { motion } from "framer-motion";

// Notification interface
interface Notification {
  id: string;
  vendor_id: string;
  invoice_id: string | null;
  type: string;
  message: string;
  status: string;
  sent_at: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout, loading } = useVendorLogout();
  const { email, contactName } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  const vendorId = vendor_id; // Replace with dynamic ID from auth context

  useEffect(() => {
    const socketInstance = io("http://localhost:5000", {
      reconnection: true,
      reconnectionAttempts: 5,
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Connected to WebSocket server:", socketInstance.id);
      socketInstance.emit("joinVendorRoom", vendorId);
      console.log("Joined room:", `vendor_${vendorId}`);
    });

    socketInstance.on("notificationUpdate", (notification: Notification) => {
      console.log("Received notification:", notification);
      setNotifications((prev) => [notification, ...prev].slice(0, 10));
    });

    socketInstance.on("connect_error", (err) => {
      console.error(`Connection failed: ${err.message}`);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [vendorId]);

  const handleLogout = async () => {
    await logout();
    sessionStorage.clear();
    router.refresh();
    router.push("/login");
  };

  const handleIgnore = async (notificationId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${vendorId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "inactive" }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update notification");
      }

      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, status: "Inactive" } : notif
        )
      );
    } catch (err) {
      console.error("Error ignoring notification:", err);
    }
  };

  const handlePayNow = (notification: Notification) => {
    const amountMatch = notification.message.match(/\$(\d+\.\d{2})/);
    const amount = amountMatch ? amountMatch[1] : "10.00";
    router.push(`/payment?vendorId=${vendorId}&amount=${amount}`);
  };

  // Count active notifications for badge
  const activeNotificationCount = notifications.filter((n) => n.status === "active").length;

  return (
    <nav className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 text-black h-16 shadow-md border-b border-gray-300">
      <div className="flex items-center space-x-4">
        {/* Left side content */}
      </div>

      <div className="flex items-center space-x-4">
        {/* User Details Dropdown */}
        <div className={cn("p-4 flex items-center", isCollapsed ? "justify-center" : "justify-start")}>
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
                    <span className="text-sm font-medium text-gray-900">{contactName}</span>
                    <span className="text-xs text-gray-500 truncate max-w-[150px]">{email}</span>
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
                <span>{loading ? "Logging out..." : "Logout"}</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>

        {/* Support Drawer */}
        <DrawerRoot>
          <DrawerTrigger asChild>
            <button className="transition-colors">
              <QuestionMarkCircle className="w-6 h-6 text-black/100 hover:text-black" />
            </button>
          </DrawerTrigger>
          <DrawerContent className="bg-white text-black z-50">
            <DrawerHeader>
              <DrawerTitle>Support</DrawerTitle>
            </DrawerHeader>
            <DrawerBody>
              <h3 className="text-xl font-semibold mb-2 text-black">How can we help?</h3>
              <p className="text-sm text-gray-600 mb-6">We usually respond in a few hours</p>
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
              <Button className="w-full mt-4 rounded-xl bg-gray-700 transition-colors">
                Send Message
              </Button>
            </DrawerBody>
          </DrawerContent>
        </DrawerRoot>

        {/* Notifications Drawer */}
        <DrawerRoot>
  <DrawerTrigger asChild>
    <button className="relative p-2 rounded-full text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200">
      <BellAlert className="w-5 h-5" />
      {activeNotificationCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center animate-pulse">
          {activeNotificationCount}
        </span>
      )}
    </button>
  </DrawerTrigger>
  <DrawerContent className="bg-white text-black z-50">
    <DrawerHeader className="border-b border-gray-100">
      <div className="flex items-center justify-between mr-8">
        <DrawerTitle>Notifications</DrawerTitle>
        {notifications.length > 0 && (
          <Button 
            variant="secondary" 
            size="small"
            onClick={() => {
              // Mark all as read functionality
              notifications.forEach(notification => {
                if (notification.status === "active") {
                  handleIgnore(notification.id);
                }
              });
            }}
            className="text-sm text-gray-500 hover:text-blue-600"
          >
            Mark all as read
          </Button>
        )}
      </div>
    </DrawerHeader>
    <DrawerBody>
      {notifications.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <div className="bg-blue-50 p-4 rounded-full mb-4">
            <BellAlert className="h-8 w-8 text-blue-400" />
          </div>
          <p className="text-gray-800 font-medium">You&apos;re all caught up!</p>
          <p className="text-gray-500 text-sm mt-1">No new notifications at this time.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            // Extract amount from notification message if available
            const amountMatch = notification.message.match(/\$(\d+\.\d{2})/);
            const amount = amountMatch ? amountMatch[0] : null;
            
            // Check if there's a date mentioned in the message
            const dateMatch = notification.message.match(/on\s+([A-Za-z]+\s+[A-Za-z]+\s+\d{2}\s+\d{4})/);
            const dueDate = dateMatch ? dateMatch[1] : null;
            
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`rounded-lg border p-3 ${
                  notification.status === "active"
                    ? "bg-blue-50 border-blue-100"
                    : "bg-gray-50 border-gray-100"
                }`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {notification.status === "active" ? (
                      <div className="bg-blue-100 p-2 rounded-full">
                        <BellAlert className="h-5 w-5 text-blue-500" />
                      </div>
                    ) : (
                      <div className="bg-gray-200 p-2 rounded-full">
                        <BellAlert className="h-5 w-5 text-gray-500" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <p className={`text-sm font-medium break-words ${
                        notification.status === "active" ? "text-gray-900" : "text-gray-500"
                      }`}>
                        {/* Remove amount from message display if we've extracted it */}
                        {amount ? notification.message.replace(amount, "") : notification.message}
                      </p>
                      <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                        {new Date(notification.sent_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    
                    {/* Display amount if extracted */}
                    {amount && (
                      <p className="text-sm font-semibold text-blue-600 mb-1">
                        Amount: {amount}
                      </p>
                    )}
                    
                    {/* Display due date if extracted */}
                    {dueDate && (
                      <p className="text-xs text-gray-700 mb-1">
                        Due: {dueDate}
                      </p>
                    )}
                    
                    <p className="text-xs text-gray-500 mb-2">
                      {new Date(notification.sent_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    
                    {notification.status === "active" && (
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant="transparent"
                          size="small"
                          onClick={() => handleIgnore(notification.id)}
                          className="h-8 px-3 py-0 text-xs rounded-full text-gray-700 border-gray-300 hover:bg-gray-50"
                        >
                          Dismiss
                        </Button>
                        <Button
                          variant="transparent"
                          size="small"
                          onClick={() => handlePayNow(notification)}
                          className="h-8 px-3 py-0 text-xs rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Pay Now
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </DrawerBody>
    {notifications.length > 5 && (
      <DrawerFooter>
        <Button variant="secondary" className="text-blue-600 hover:text-blue-700 text-sm">
          View all notifications
        </Button>
      </DrawerFooter>
    )}
  </DrawerContent>
</DrawerRoot>
      </div>
    </nav>
  );
};

export default Navbar;