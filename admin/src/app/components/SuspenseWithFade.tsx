// components/SuspenseWithFade.tsx
"use client";

import { Suspense, useState, useEffect } from "react";

type SuspenseWithFadeProps = {
  children: React.ReactNode;
  fallback: React.ReactNode;
};

export default function SuspenseWithFade({ children, fallback }: SuspenseWithFadeProps) {
  const [isFading, setIsFading] = useState(false);

  return (
    <Suspense
      fallback={
        <div
          className={`transition-opacity duration-500 ${
            isFading ? "opacity-0" : "opacity-100"
          }`}
          onTransitionEnd={() => setIsFading(false)} // Hide after fade-out
        >
          {fallback}
        </div>
      }
    >
      <FadeHandler setIsFading={setIsFading}>{children}</FadeHandler>
    </Suspense>
  );
}

function FadeHandler({
  children,
  setIsFading,
}: {
  children: React.ReactNode;
  setIsFading: (value: boolean) => void;
}) {
  useEffect(() => {
    // When content is ready, trigger fade-out of the fallback
    setIsFading(true);
  }, []);

  return <>{children}</>;
}