// src/components/Navbar.tsx
"use client";

import { useState } from "react";
import { FaBell } from "react-icons/fa";
import { useTheme } from "../lib/ThemeContext";

// List of all DaisyUI 5.0.0 themes (as of March 2025)
const daisyThemes = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave",
  "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua",
  "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula",
  "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee",
  "winter", "dim", "nord", "sunset", "horizon", "twilight",
];

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  return (
    <div className="navbar bg-base-100 shadow-md border-b border-b-gray-400 px-4 py-2 flex justify-between">
      {/* Left Side */}
      <div className="navbar-start flex-shrink-0">
        <span className="text-xl font-bold text-primary">Admin Dashboard</span>
      </div>

      {/* Center (Explicitly Empty) */}
      <div className="navbar-center flex-grow"></div>

      {/* Right Side */}
      <div className="navbar-end flex-shrink-0 gap-4">
        {/* Notifications Button */}
        <button
          className="btn btn-ghost btn-circle text-base-content hover:bg-base-200 transition-all duration-300"
          onClick={toggleDrawer}
        >
          <FaBell className="w-5 h-5" />
        </button>

        {/* Theme Select Dropdown */}
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="select select-info w-40 capitalize"
        >
          <option disabled>Pick a Theme</option>
          {daisyThemes.map((themeName) => (
            <option key={themeName} value={themeName}>
              {themeName}
            </option>
          ))}
        </select>
      </div>

      {/* Drawer for Notifications */}
      <div className="drawer drawer-end z-50">
        <input
          id="notifications-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={isDrawerOpen}
          onChange={toggleDrawer}
        />
        <div className="drawer-content">
          {/* Main content is the navbar itself */}
        </div>
        <div className="drawer-side">
          <label
            htmlFor="notifications-drawer"
            aria-label="close drawer"
            className="drawer-overlay"
          ></label>
          <div className="menu bg-base-200 text-base-content min-h-full w-80 p-6 border-l border-base-300">
            <h3 className="text-lg font-semibold text-primary mb-4">Notifications</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-base-content/70">
                  No new notifications yet!
                </span>
              </li>
            </ul>
            <button
              className="btn btn-sm btn-primary text-primary-content mt-6 hover:scale-105 transition-all duration-300"
              onClick={toggleDrawer}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}