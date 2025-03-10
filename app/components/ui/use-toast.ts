import { useState, useEffect } from "react";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

// Create a simple global state for toasts
let toasts: ToastProps[] = [];
let listeners: ((toasts: ToastProps[]) => void)[] = [];

function notifyListeners() {
  listeners.forEach(listener => listener(toasts));
}

export function toast(props: ToastProps) {
  toasts = [...toasts, props];
  notifyListeners();
  
  // Auto dismiss after 5 seconds
  setTimeout(() => {
    toasts = toasts.filter(t => t !== props);
    notifyListeners();
  }, 5000);
}

export function useToast() {
  const [state, setState] = useState<ToastProps[]>(toasts);
  
  useEffect(() => {
    const listener = (newToasts: ToastProps[]) => {
      setState([...newToasts]);
    };
    
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);
  
  const dismiss = () => {
    toasts = [];
    notifyListeners();
  };

  return {
    toasts: state,
    toast,
    dismiss,
  };
} 