"use client";

import { useEffect, useRef } from "react";
import CountUp from "react-countup";

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 0.8,
}: AnimatedNumberProps) {
  const countUpRef = useRef<any>(null); // Ref to CountUp instance

  useEffect(() => {
    if (countUpRef.current && typeof value === "number" && !isNaN(value)) {
      countUpRef.current.update(value); // Update value when it changes
    }
  }, [value]);

  return (
    <CountUp
      start={0}
      end={value}
      decimals={decimals}
      prefix={prefix}
      suffix={suffix}
      duration={duration}
      useEasing={true}
      separator=","
    >
      {({ countUpRef: containerRef }) => (
        <span ref={containerRef} className="inline-block tabular-nums" />
      )}
    </CountUp>
  );
}