// components/LoadingOverlay.tsx
"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface LoadingOverlayProps {
  isLoading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-white" />
        </motion.div>
        <p className="text-white text-lg font-semibold animate-pulse">
          Loading your dashboard...
        </p>
      </div>
    </motion.div>
  );
};

export default LoadingOverlay;