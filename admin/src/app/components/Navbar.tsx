// components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import { FaBell, FaSun, FaMoon } from "react-icons/fa";

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  // Sync theme with system preference and toggle
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <div className="navbar bg-base-100 shadow-md">
      <div className="flex-1">
        <span className="text-xl font-bold pl-4 text-base-content">Admin Dashboard</span>
      </div>
      <div className="flex-none gap-2">
        <button
          className="btn btn-ghost btn-circle"
          onClick={() => setIsModalOpen(true)}
        >
          <FaBell className="text-xl text-base-content" />
        </button>
        <button className="btn btn-ghost btn-circle" onClick={toggleTheme}>
          {theme === "light" ? (
            <FaMoon className="text-xl text-base-content" />
          ) : (
            <FaSun className="text-xl text-base-content" />
          )}
        </button>
      </div>

      {/* Right-side Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-end z-50">
          <div className="w-80 bg-base-100 shadow-xl p-4 transform transition-transform duration-300 translate-x-0">
            <h3 className="text-lg font-semibold mb-4 text-base-content">Notifications</h3>
            <p className="text-base-content">No new notifications yet!</p>
            <button
              className="btn btn-sm btn-primary mt-4"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
          <div
            className="flex-1 bg-black opacity-50"
            onClick={() => setIsModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
}