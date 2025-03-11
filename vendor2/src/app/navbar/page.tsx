"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { Bell, HelpCircle, Settings, LogOut } from "lucide-react";
import { vendor_id } from "../utils/constant";
import { useAuth } from "../context/AuthContext";
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

  // WebSocket setup
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

  // Logout handler
  const handleLogout = async () => {
    await logout();
    sessionStorage.clear();
    router.refresh();
    router.push("/login");
  };

  // Ignore notification handler
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

  // Pay now handler
  const handlePayNow = (notification: Notification) => {
    const amountMatch = notification.message.match(/\$(\d+\.\d{2})/);
    const amount = amountMatch ? amountMatch[1] : "10.00";
    router.push(`/payment?vendorId=${vendorId}&amount=${amount}`);
  };

  // Count active notifications for badge
  const activeNotificationCount = notifications.filter((n) => n.status === "active").length;

  return (
    <>
      {/* Navbar */}
      <nav className="navbar bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 text-black shadow-md border-b border-gray-300">
        <div className="navbar-start">
          {/* Left side content, e.g., logo */}
          <div className="flex items-center space-x-4">{/* Add logo or links here if needed */}</div>
        </div>
        <div className="navbar-end">
          <div className="flex items-center space-x-4">
            {/* User Details Dropdown */}
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className={`btn btn-ghost flex items-center space-x-3 ${isCollapsed ? "p-0 w-10 h-10" : "p-2 justify-start"}`}
              >
                <div className="avatar">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-medium">{contactName?.slice(0, 1).toUpperCase()}</span>
                  </div>
                </div>
                {!isCollapsed && (
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-gray-900">{contactName}</span>
                    <span className="text-xs text-gray-500 truncate max-w-[150px]">{email}</span>
                  </div>
                )}
              </label>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-56">
                <li>
                  <Link href="/vendor/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </li>
                <li className="divider"></li>
                <li>
                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="text-red-600 hover:text-red-700 flex items-center"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{loading ? "Logging out..." : "Logout"}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Support Modal Trigger */}
            <label htmlFor="support-modal" className="btn btn-ghost p-2">
              <HelpCircle className="w-6 h-6" />
            </label>

            {/* Notifications Dropdown */}
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost p-2 relative">
                <Bell className="w-5 h-5" />
                {activeNotificationCount > 0 && (
                  <span className="badge badge-error absolute -top-1 -right-1 animate-pulse">{activeNotificationCount}</span>
                )}
              </label>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-80 max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <li className="p-4 text-center">
                    <div className="bg-blue-50 p-4 rounded-full inline-block mb-4">
                      <Bell className="h-8 w-8 text-blue-400" />
                    </div>
                    <p className="font-medium">You're all caught up!</p>
                    <p className="text-sm text-gray-500">No new notifications at this time.</p>
                  </li>
                ) : (
                  notifications.map((notification) => {
                    const amountMatch = notification.message.match(/\$(\d+\.\d{2})/);
                    const amount = amountMatch ? amountMatch[0] : null;
                    const dateMatch = notification.message.match(/on\s+([A-Za-z]+\s+[A-Za-z]+\s+\d{2}\s+\d{4})/);
                    const dueDate = dateMatch ? dateMatch[1] : null;

                    return (
                      <li key={notification.id} className="p-2">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className={`rounded-lg border p-3 ${
                            notification.status === "active" ? "bg-blue-50 border-blue-100" : "bg-gray-50 border-gray-100"
                          }`}
                        >
                          <div className="flex gap-3">
                            <div className="shrink-0 mt-1">
                              {notification.status === "active" ? (
                                <div className="bg-blue-100 p-2 rounded-full">
                                  <Bell className="h-5 w-5 text-blue-500" />
                                </div>
                              ) : (
                                <div className="bg-gray-200 p-2 rounded-full">
                                  <Bell className="h-5 w-5 text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-1">
                                <p
                                  className={`text-sm font-medium break-words ${
                                    notification.status === "active" ? "text-gray-900" : "text-gray-500"
                                  }`}
                                >
                                  {amount ? notification.message.replace(amount, "") : notification.message}
                                </p>
                                <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                  {new Date(notification.sent_at).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              {amount && <p className="text-sm font-semibold text-blue-600 mb-1">Amount: {amount}</p>}
                              {dueDate && <p className="text-xs text-gray-700 mb-1">Due: {dueDate}</p>}
                              <p className="text-xs text-gray-500 mb-2">
                                {new Date(notification.sent_at).toLocaleDateString(undefined, {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                              {notification.status === "active" && (
                                <div className="flex gap-2 mt-2">
                                  <button
                                    onClick={() => handleIgnore(notification.id)}
                                    className="btn btn-xs btn-ghost text-gray-700 border-gray-300 hover:bg-gray-50"
                                  >
                                    Dismiss
                                  </button>
                                  <button
                                    onClick={() => handlePayNow(notification)}
                                    className="btn btn-xs btn-primary text-white"
                                  >
                                    Pay Now
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      </li>
                    );
                  })
                )}
                {notifications.length > 5 && (
                  <li className="p-2">
                    <button className="btn btn-ghost w-full text-blue-600 hover:text-blue-700">
                      View all notifications
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Support Modal */}
      <input type="checkbox" id="support-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative bg-white text-black">
          <label className="btn btn-sm btn-circle absolute right-2 top-2" htmlFor="support-modal">
            ✕
          </label>
          <h3 className="text-lg font-bold">Support</h3>
          <p className="py-4 text-sm text-gray-600">How can we help? We usually respond in a few hours</p>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Subject</span>
            </label>
            <input
              type="text"
              placeholder="What is it about?"
              className="input input-bordered w-full rounded-xl bg-transparent border-gray-500"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Message</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24 rounded-xl bg-transparent border-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-800 transition-all duration-300"
              placeholder="Write your message here..."
            ></textarea>
          </div>
          <div className="modal-action">
            <button className="btn btn-primary w-full rounded-xl bg-gray-700 hover:bg-gray-800 transition-colors">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;