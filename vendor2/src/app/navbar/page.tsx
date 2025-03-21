"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import Link from "next/link";
import { 
  Bell, 
  HelpCircle, 
  Settings, 
  LogOut, 
  Store,
  UserRound
} from "lucide-react";
import { vendor_id } from "@/app/utils/constant";
import { useAuth } from "@/app/context/AuthContext";
import { useVendorLogout } from "@/app/hooks/auth/useVendorLogout";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/themeContext";
import { Next_server } from "@/constant";

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

// Available themes
const daisyThemes = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave",
  "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua",
  "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula",
  "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee",
  "winter", "dim", "nord", "sunset"
];

const NavigationBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, loading } = useVendorLogout();
  const { email, contactName, companyName } = useAuth() || { 
    email: '', 
    contactName: '', 
    companyName: '' 
  };
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { theme, setTheme } = useTheme();
  const vendorId = vendor_id;
  const isAuthenticated = !!email;

  // WebSocket setup for notifications
  useEffect(() => {
    if (!vendorId) return;

    const socketInstance = io(`${Next_server}`, {
      reconnection: true,
      reconnectionAttempts: 5,
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Connected to WebSocket server:", socketInstance.id);
      socketInstance.emit("joinVendorRoom", vendorId);
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
      const response = await fetch(`${Next_server}/api/notifications/${vendorId}`, {
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
      {/* Modern DaisyUI 5 Navbar */}
      <div className="navbar bg-base-100 shadow-md border-b border-base-300">
        {/* Navbar start - Brand/Logo section */}
        <div className="navbar-start ml-2">
          <Link href={isAuthenticated ? "/vendor/dashboard" : "/"} className="btn btn-ghost normal-case text-xl text-primary">
            <div className="flex items-center gap-2">
              <Store className="h-6 w-6" />
              <span>{companyName || "Vendor Hub"}</span>
            </div>
          </Link>
        </div>

      
        

        {/* Navbar end - profile and notification elements */}
        <div className="navbar-end gap-2 mr-2">
          {/* Theme selector */}
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="select select-sm select-bordered max-w-28"
          >
            {daisyThemes.map((themeName) => (
              <option key={themeName} value={themeName}>
                {themeName}
              </option>
            ))}
          </select>

          {isAuthenticated ? (
            <>
              {/* Help/Support button - only for authenticated users */}
              <label htmlFor="support-modal" className="btn btn-ghost btn-circle">
                <HelpCircle className="h-5 w-5" />
              </label>

              {/* Notifications dropdown - only for authenticated users */}
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle">
                  <div className="indicator">
                    <Bell className="h-5 w-5" />
                    {activeNotificationCount > 0 && (
                      <span className="badge badge-primary badge-sm indicator-item">{activeNotificationCount}</span>
                    )}
                  </div>
                </label>
                <div tabIndex={0} className="dropdown-content z-[1] card card-compact shadow bg-base-100 w-80 max-h-96 overflow-y-auto">
                  <div className="card-body">
                    <h3 className="card-title font-medium text-base-content">Notifications</h3>
                    <div className="divider my-0"></div>
                    
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center py-4">
                        <div className="bg-base-200 p-4 rounded-full mb-2">
                          <Bell className="h-6 w-6 text-primary" />
                        </div>
                        <span className="font-medium">{"You're all caught up!"}</span>
                        <p className="text-sm text-base-content/70">No new notifications at this time.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {notifications.map((notification) => {
                          const amountMatch = notification.message.match(/\$(\d+\.\d{2})/);
                          const amount = amountMatch ? amountMatch[0] : null;
                          const dateMatch = notification.message.match(/on\s+([A-Za-z]+\s+[A-Za-z]+\s+\d{2}\s+\d{4})/);
                          const dueDate = dateMatch ? dateMatch[1] : null;

                          return (
                            <motion.div
                              key={notification.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className={`card ${
                                notification.status === "active" 
                                  ? "bg-primary/10 border border-primary/20" 
                                  : "bg-base-200"
                              } shadow-sm`}
                            >
                              <div className="card-body p-3">
                                <div className="flex gap-3">
                                  <div className="avatar">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                      notification.status === "active" 
                                        ? "bg-primary/20" 
                                        : "bg-base-300"
                                    }`}>
                                      <Bell className={`h-5 w-5 ${
                                        notification.status === "active" 
                                          ? "text-primary" 
                                          : "text-base-content/50"
                                      }`} />
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-start justify-between gap-2">
                                      <p className={`text-sm font-medium ${
                                        notification.status === "active" 
                                          ? "text-base-content" 
                                          : "text-base-content/70"
                                      }`}>
                                        {amount ? notification.message.replace(amount, "") : notification.message}
                                      </p>
                                      <span className="text-xs text-base-content/50 whitespace-nowrap">
                                        {new Date(notification.sent_at).toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </span>
                                    </div>
                                    
                                    {amount && <p className="text-sm font-semibold text-primary mt-1">Amount: {amount}</p>}
                                    {dueDate && <p className="text-xs text-base-content/70 mt-1">Due: {dueDate}</p>}
                                    
                                    <p className="text-xs text-base-content/50 mt-1">
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
                                          className="btn btn-xs btn-ghost"
                                        >
                                          Dismiss
                                        </button>
                                        <button
                                          onClick={() => handlePayNow(notification)}
                                          className="btn btn-xs btn-primary"
                                        >
                                          Pay Now
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                    
                    {notifications.length > 5 && (
                      <>
                        <div className="divider my-0"></div>
                        <div className="card-actions">
                          <button className="btn btn-ghost btn-sm text-primary btn-block">
                            View all notifications
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* User profile dropdown - for authenticated users */}
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost">
                  <div className="flex items-center gap-2">
                    <div className="avatar avatar-placeholder">
                      <div className="bg-primary text-primary-content rounded-full w-8">
                        <span className="text-xs">{contactName?.slice(0, 1).toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-medium">{contactName}</span>
                      <span className="text-xs text-base-content/60 truncate max-w-[150px]">{email}</span>
                    </div>
                  </div>
                </label>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <Link href="/vendor/profile" className="text-base-content">
                      <div className="avatar avatar-placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-8">
                          <span className="text-xs">{contactName?.slice(0, 1).toUpperCase()}</span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{contactName}</span>
                        <span className="text-xs text-base-content/60 truncate max-w-[180px]">{email}</span>
                      </div>
                    </Link>
                  </li>
                  <div className="divider my-0"></div>
                  <li>
                    <Link href="/vendor/settings" className="text-base-content">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </li>
                  <div className="divider my-0"></div>
                  <li>
                    <button
                      onClick={handleLogout}
                      disabled={loading}
                      className="text-error"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{loading ? "Logging out..." : "Logout"}</span>
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            /* Login button - for non-authenticated users */
            pathname !== "/login" && (
              <Link href="/login" className="btn btn-outline btn-primary">
                <UserRound className="h-4 w-4 mr-2" />
                Vendor Login
              </Link>
            )
          )}
        </div>
      </div>

      {/* Support Modal - Using DaisyUI modal */}
      <input type="checkbox" id="support-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <form>
            <h3 className="font-bold text-lg">Support</h3>
            <p className="py-2 text-sm text-base-content/70">How can we help? We usually respond in a few hours</p>
            
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Subject</span>
              </label>
              <input 
                type="text" 
                placeholder="What is it about?" 
                className="input input-bordered w-full" 
              />
            </div>
            
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Message</span>
              </label>
              <textarea 
                className="textarea textarea-bordered h-24" 
                placeholder="Write your message here..."
              ></textarea>
            </div>
            
            <div className="modal-action">
              <label htmlFor="support-modal" className="btn btn-outline">Cancel</label>
              <button type="submit" className="btn btn-primary">Send Message</button>
            </div>
          </form>
        </div>
        <label className="modal-backdrop" htmlFor="support-modal"></label>
      </div>
    </>
  );
};

export default NavigationBar;