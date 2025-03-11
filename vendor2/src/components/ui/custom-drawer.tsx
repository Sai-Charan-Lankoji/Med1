// components/ui/custom-drawer.tsx
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const DrawerRoot = DialogPrimitive.Root;
const DrawerTrigger = DialogPrimitive.Trigger;
const DrawerClose = DialogPrimitive.Close;

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-y-0 right-0 z-50 h-full max-w-[90vw] shadow-lg outline-hidden",
        "bg-white border-l border-gray-100",
        "transform transition-all duration-300 ease-in-out",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
        "w-full sm:w-[400px] md:w-[500px]",
        className
      )}
      {...props}
    >
      <div className="h-full flex flex-col overflow-hidden">
        {children}
      </div>
      <DrawerClose className="absolute top-4 right-4 rounded-full p-1.5 opacity-70 ring-offset-white hover:bg-gray-100 hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DrawerClose>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div 
    className={cn(
      "flex flex-col space-y-1.5 px-6 pt-6 pb-3",
      "border-b border-gray-100",
      className
    )} 
    {...props} 
  />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerTitle = React.forwardRef<
  React.ElementRef<"h2">,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2 
    ref={ref} 
    className={cn(
      "text-xl font-semibold leading-6 text-gray-900",
      className
    )} 
    {...props} 
  />
));
DrawerTitle.displayName = "DrawerTitle";

const DrawerBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div 
    className={cn(
      "flex-1 overflow-y-auto px-6 py-4 text-gray-700",
      className
    )} 
    {...props} 
  />
);
DrawerBody.displayName = "DrawerBody";

// New component for drawer footer actions
const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      "border-t border-gray-100 px-6 py-4",
      className
    )}
    {...props}
  />
);
DrawerFooter.displayName = "DrawerFooter";

export { 
  DrawerRoot, 
  DrawerTrigger, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerBody, 
  DrawerClose,
  DrawerFooter 
};