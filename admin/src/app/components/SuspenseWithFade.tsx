// src/app/components/SuspenseWithFade.tsx
"use client";
import { Suspense, useState, useEffect } from "react";

export default function SuspenseWithFade({ children }: { children: React.ReactNode }) {
  const [isFading, setIsFading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsFading(false);
    }, 100); // Example fade duration
  }, []); // No dependencies needed; setIsFading is stable

  return (
    <Suspense fallback={<div className="loading loading-spinner loading-lg"></div>}>
      <div className={`transition-opacity duration-500 ${isFading ? "opacity-0" : "opacity-100"}`}>
        {children}
      </div>
    </Suspense>
  );
}