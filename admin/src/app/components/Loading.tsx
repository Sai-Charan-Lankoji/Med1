// components/Loading.tsx
"use client";

import { useEffect, useState } from "react";

export default function Loading() {
  const [isFading, setIsFading] = useState(false);

  // Trigger fade-out just before content loads (simulated here, Suspense handles actual timing)
  useEffect(() => {
    // This is a placeholder; Suspense will unmount this component when content is ready
    // We’ll rely on CSS transition for the fade-out effect
    const timer = setTimeout(() => {
      setIsFading(true);
    }, 2000); // Simulate content loading after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`flex justify-center items-center min-h-screen bg-base-100 transition-opacity duration-500 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      <span className="loading loading-spinner loading-lg text-primary animate-spin"></span>
    </div>
  );
}