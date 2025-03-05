"use client"

import React from "react"
import { motion } from "framer-motion"
import { Card, CardContent,  CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DashboardComponentProps {
  title: string
  description: string
  children: React.ReactNode
}

export default function DashboardComponent({ title, description, children }: DashboardComponentProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br">
      <div className="relative z-10 min-h-screen p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-2 mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-blue-700">
              {title}
            </h1>
            <p className="text-sm text-black/80 max-w-xl mx-auto">
              {description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="mb-6 rounded-xl overflow-hidden border-0 bg-white/10 backdrop-blur-md shadow-2xl">
              <CardContent className="p-4">
                {children}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export function DashboardCard({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <Card className={cn("bg-white/10 rounded-xl p-4 shadow-md border border-white/20", className)}>
      <CardHeader className="p-0">
        <CardTitle className="text-base font-semibold text-black mb-3">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {children}
      </CardContent>
    </Card>
  )
}

