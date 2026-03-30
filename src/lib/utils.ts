import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateShort(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: "bg-[#6b7280]/10 text-[#6b7280] border border-[#6b7280]/20 dark:bg-[#6b7280]/20",
    submitted: "bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20 dark:bg-[#3b82f6]/20",
    "under review": "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20 dark:bg-[#f59e0b]/20",
    approved: "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 dark:bg-[#10b981]/20",
    "in progress": "bg-[#8b5cf6]/10 text-[#8b5cf6] border border-[#8b5cf6]/20 dark:bg-[#8b5cf6]/20",
    processing: "bg-[#06b6d4]/10 text-[#06b6d4] border border-[#06b6d4]/20 dark:bg-[#06b6d4]/20",
    pending: "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20 dark:bg-[#f59e0b]/20",
    completed: "bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 dark:bg-[#22c55e]/20",
    cancelled: "bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20 dark:bg-[#ef4444]/20",
    rejected: "bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20 dark:bg-[#ef4444]/20",
    active: "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 dark:bg-[#10b981]/20",
    paused: "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20 dark:bg-[#f59e0b]/20",
    scheduled: "bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20 dark:bg-[#3b82f6]/20",
    ended: "bg-[#6b7280]/10 text-[#6b7280] border border-[#6b7280]/20 dark:bg-[#6b7280]/20",
  };
  return colors[status.toLowerCase()] || "bg-[#6b7280]/10 text-[#6b7280] border border-[#6b7280]/20";
}
