"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface DashboardComponentProps {
  title: string
  description: string
  children: React.ReactNode
}

export default function DashboardComponent({ title, description, children }: DashboardComponentProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-base-100">
      <div className="relative z-10 min-h-screen p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-2 mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              {title}
            </h1>
            <p className="text-sm text-base-content/80 max-w-xl mx-auto">
              {description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="card mb-6 shadow-xl bg-base-100">
              <div className="card-body p-4">
                {children}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export function DashboardCard({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("card bg-base-200 p-4 shadow-md", className)}>
      <div className="card-body p-0">
        <h2 className="card-title text-base font-semibold text-base-content mb-3">
          {title}
        </h2>
        <div>
          {children}
        </div>
      </div>
    </div>
  )
}

