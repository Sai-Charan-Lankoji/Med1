"use client";

import { useEffect, useRef } from "react";

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number; // Duration in seconds
}

export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 0.8,
}: AnimatedNumberProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!spanRef.current || typeof value !== "number" || isNaN(value)) return;

    const startValue = 0;
    const endValue = value;
    const startTime = performance.now();
    const durationMs = duration * 1000; // Convert to milliseconds

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1); // 0 to 1
      const easedProgress = 1 - Math.pow(1 - progress, 4); // Ease-out effect

      const currentValue = startValue + (endValue - startValue) * easedProgress;
      const formattedValue = prefix + currentValue.toFixed(decimals) + suffix;

      if (spanRef.current) {
        spanRef.current.textContent = formattedValue;
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value, decimals, prefix, suffix, duration]);

  return <span ref={spanRef} className="inline-block tabular-nums" />;
}