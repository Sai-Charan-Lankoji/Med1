"use client";

import React from "react";
import {
  Key as KeyIcon,
  DollarSign,
  Smile,
  ShoppingBag,
  Users as UsersIcon,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import withAuth from "@/lib/withAuth";

const Settings = () => {
  const settings = [
    {
      href: "/vendor/settings/api-key-management",
      icon: <KeyIcon className="h-6 w-6" />,
      title: "API Key Management",
      description: "Create and manage API Keys",
    },
    {
      href: "/vendor/settings/currencies",
      icon: <DollarSign className="h-6 w-6" />,
      title: "Currencies",
      description: "Manage currencies across stores",
    },
    {
      href: "/vendor/settings/personal-information",
      icon: <Smile className="h-6 w-6" />,
      title: "Personal Information",
      description: "Manage your profile",
    },
    {
      href: "/vendor/settings/sales-channels",
      icon: <ShoppingBag className="h-6 w-6" />,
      title: "Sales Channels",
      description: "Control products availability",
    },
    {
      href: "/vendor/settings/team",
      icon: <UsersIcon className="h-6 w-6" />,
      title: "The Team",
      description: "Manage users of your Store",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="relative z-10 min-h-screen p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-2 mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-blue-800">
              General Settings
            </h1>
            <p className="text-sm text-gray-500 max-w-xl mx-auto">
              Manage the general settings for your store
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {settings.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              >
                <Link href={item.href}>
                  <div className="card bg-white/10 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg p-6 flex items-center gap-4 transition-all duration-300 hover:bg-white/20">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-xl text-white transition-all hover:bg-blue-700">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="font-semibold text-lg text-black">
                        {item.title}
                      </h2>
                      <p className="text-sm text-gray-700">{item.description}</p>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 text-gray-600 transition-colors hover:text-black" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Settings);