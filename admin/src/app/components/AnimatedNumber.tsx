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
  const countUpRef = useRef<InstanceType<typeof CountUp> | null>(null); // Ref to CountUp instance
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (spanRef.current && typeof value === "number" && !isNaN(value)) {
      // Manually trigger CountUp update
      if (countUpRef.current) {
        countUpRef.current.update(value);
      }
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
      onEnd={() => {
        if (countUpRef.current) {
          countUpRef.current.update(value);
        }
      }}
    >
      {() => (
        <span ref={spanRef} className="inline-block tabular-nums" />
      )}
    </CountUp>
  );
}