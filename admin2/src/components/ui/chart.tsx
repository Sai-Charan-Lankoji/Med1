"use client"

import type React from "react"

import { Bar as BarChart, Area as AreaChart, Tooltip, ResponsiveContainer } from "recharts"

interface ChartProps {
  children: React.ReactElement
  config?: Record<string, { label: string; color: string }>
  className?: string
}

export function ChartContainer({ children, config, className }: ChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
}

interface ChartTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
}

export function ChartTooltip({ content }: { content: React.ComponentType<ChartTooltipProps> }) {
  return <Tooltip content={content} />
}

export function ChartTooltipContent({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload) return null

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-sm font-medium">
              {item.name}: ${Number(item.value).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export { BarChart as Bar, AreaChart as Area }

