"use client"

import { useEffect, useState } from "react"
import { motion, useSpring, useTransform } from "framer-motion"

interface AnimatedCounterProps {
  value: number
  decimal?: number
  duration?: number
  formatValue?: (value: number) => string
}

export function AnimatedCounter({
  value,
  duration = 1,
  formatValue = (value) => value.toLocaleString(),
}: AnimatedCounterProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const springValue = useSpring(0, {
    duration: duration * 1000,
    bounce: 0.1,
  })

  const displayValue = useTransform(springValue, (current) => {
    return formatValue(Math.floor(current))
  })

  useEffect(() => {
    springValue.set(value)
  }, [value, springValue])

  // Prevent hydration mismatch
  if (!isClient) {
    return <span>{formatValue(0)}</span>
  }

  return <motion.span>{displayValue}</motion.span>
}

