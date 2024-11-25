"use client"

import React from "react"
import {
  ArrowUturnLeft,
  BuildingTax,
  Channels,
  ChevronRight,
  CurrencyDollar,
  FaceSmile,
  Key,
  Lifebuoy,
  MapPin,
  Users,
} from "@medusajs/icons"
import { Container } from "@medusajs/ui"
import Link from "next/link"
import { motion } from "framer-motion"
import withAuth from "@/lib/withAuth"

const Settings = () => {
  const settings = [
    {
      href: "/vendor/settings/api-key-management",
      icon: <Key />,
      title: "API Key Management",
      description: "Create and manage API Keys",
    },
    {
      href: "/vendor/settings/currencies",
      icon: <CurrencyDollar />,
      title: "Currencies",
    description: "Manage currencies across stores",
    },
    {
      href: "/vendor/settings/personal-information",
      icon: <FaceSmile />,
      title: "Personal Information",
      description: "Manage your Medusa profile",
    },
    {
      href: "/vendor/settings/sales-channels",
      icon: <Channels />,
      title: "Sales Channels",
      description: "Control  products availability",
    },
    {
      href: "/vendor/settings/team",
      icon: <Users />,
      title: "The Team",
      description: "Manage users of your  Store",
    },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden ">
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
                  <Container className="group flex items-center gap-4 p-6 bg-white/10 backdrop-blur-md border-0 border-white/20 rounded-xl shadow-2xl transition-all duration-300 hover:bg-white/20">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-xl text-white transition-all group-hover:bg-blue-700">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="font-semibold text-lg text-black">
                        {item.title}
                      </h2>
                      <p className="text-sm text-black/80">{item.description}</p>
                    </div>
                    <ChevronRight className="text-black/60 group-hover:text-black transition-colors" />
                  </Container>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default withAuth(Settings)