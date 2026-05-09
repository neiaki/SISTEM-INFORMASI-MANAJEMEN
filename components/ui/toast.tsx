"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type?: ToastType;
  onDismiss: () => void;
  duration?: number;
}

const STYLES: Record<ToastType, string> = {
  success: "bg-green-600 text-white border-green-700",
  error:   "bg-red-500 text-white border-red-600",
  info:    "bg-blue-500 text-white border-blue-600",
  warning: "bg-amber-500 text-white border-amber-600",
};

const ICONS: Record<ToastType, string> = {
  success: "✓",
  error:   "✕",
  info:    "ℹ",
  warning: "⚠",
};

export function Toast({ message, type = "success", onDismiss, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, duration);
    return () => clearTimeout(t);
  }, [onDismiss, duration]);

  return (
    <div className="fixed top-5 right-5 z-[9999] animate-fadeIn">
      <div className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl border shadow-[0_4px_20px_rgba(0,0,0,0.2)] min-w-[240px] max-w-[360px]",
        STYLES[type]
      )}>
        <span className="text-[15px] font-bold shrink-0">{ICONS[type]}</span>
        <span className="text-[13.5px] font-medium flex-1 leading-snug">{message}</span>
        <button onClick={onDismiss} className="shrink-0 opacity-70 hover:opacity-100 transition-opacity ml-1">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

export function useToastState() {
  return { toast: null as { message: string; type: ToastType } | null };
}
