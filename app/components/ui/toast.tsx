import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { useToast } from "./use-toast";

interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive";
  title?: string;
  description?: string;
  onClose?: () => void;
}

export function Toast({
  className,
  variant = "default",
  title,
  description,
  onClose,
  ...props
}: ToastProps) {
  return (
    <div
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
        variant === "destructive" 
          ? "border-destructive bg-destructive text-destructive-foreground" 
          : "border-border bg-background text-foreground",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-1">
        {title && <div className="text-sm font-semibold">{title}</div>}
        {description && <div className="text-sm opacity-90">{description}</div>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none group-hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast, index) => (
        <Toast
          key={index}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          onClose={() => dismiss()}
          className="mb-2"
        />
      ))}
    </div>
  );
} 