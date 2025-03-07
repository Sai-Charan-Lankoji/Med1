"use client";

import React from "react";
import { cn } from "@/app/lib/utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="relative w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {children}
      </div>
    </div>
  );
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-white rounded-xl shadow-lg p-6 max-h-[90vh] overflow-y-auto",
        className
      )}
      {...props}
    />
  )
);
DialogContent.displayName = "DialogContent";

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("mb-4", className)}
      {...props}
    />
  )
);
DialogHeader.displayName = "DialogHeader";

interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn("text-xl font-bold text-gray-900", className)}
      {...props}
    />
  )
);
DialogTitle.displayName = "DialogTitle";

interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex justify-end gap-3 mt-6", className)}
      {...props}
    />
  )
);
DialogFooter.displayName = "DialogFooter";