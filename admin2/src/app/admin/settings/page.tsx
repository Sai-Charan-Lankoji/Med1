"use client";

import React from "react";
import { Channels, ChevronRight, CurrencyDollar, Users } from "@medusajs/icons";
import { Container } from "@medusajs/ui";
import Link from "next/link";
import { motion } from "framer-motion";
import { LoadingDots } from "@/components/ui/Loding";

const Settings = () => {
  const settings = [
    {
      href: "/admin/settings/currencies",
      icon: <CurrencyDollar />,
      title: "Currencies",
      description: "Manage currencies across stores",
    },
    {
      href: "/admin/settings/sales-channels",
      icon: <Channels />,
      title: "Sales Channels",
      description: "Control products availability",
    },
    {
      href: "/admin/settings/team",
      icon: <Users />,
      title: "The Team",
      description: "Manage users of your Store",
    },
  ];

  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000); 
  }, []);

  if (isLoading) {
    return <LoadingDots message="Loading settings..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900 py-10 overflow-hidden">
      <div className="relative z-10 min-h-screen p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3 mb-10"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              General Settings
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Manage the general settings for your store
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {settings.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <Link href={item.href}>
                  <Container className="group flex items-center gap-4 p-6 bg-white/95 dark:bg-gray-800/95 border-none shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl hover:bg-gray-100 dark:hover:bg-gray-700/50">
                    <div className="flex items-center justify-center w-12 h-12 bg-indigo-600 dark:bg-indigo-700 rounded-lg text-white transition-all duration-200 group-hover:bg-indigo-700 dark:group-hover:bg-indigo-600">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                        {item.title}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                    </div>
                    <ChevronRight className="text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200" />
                  </Container>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;