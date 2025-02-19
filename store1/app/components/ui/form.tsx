"use client";

import React, { createContext, useContext, useId } from "react";
import { cn } from "@/app/lib/utils";

const FormContext = createContext<{ id: string }>({ id: "" });

export function Form({ className, ...props }: React.HTMLAttributes<HTMLFormElement>) {
  return <form className={cn("space-y-6", className)} {...props} />;
}

export function FormItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-2", className)} {...props} />;
}

export function FormLabel({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  const { id } = useContext(FormContext);
  return (
    <label
      htmlFor={id}
      className={cn("text-sm font-medium leading-none", className)}
      {...props}
    />
  );
}

export function FormControl({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { id } = useContext(FormContext);
  return <div id={id} className={cn("mt-2", className)} {...props} />;
}

export function FormMessage({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm font-medium text-destructive", className)} {...props}>
      {children}
    </p>
  );
}
