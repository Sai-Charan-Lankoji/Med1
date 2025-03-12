// src/components/AnimatedNumber.tsx
"use client";

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
      {({ countUpRef }) => (
        <span ref={countUpRef} className="inline-block tabular-nums" />
      )}
    </CountUp>
  );
}