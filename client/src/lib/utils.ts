import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { differenceInDays, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return format(new Date(date), "MMM d, yyyy");
}

export function daysUntil(date: string | Date) {
  return differenceInDays(new Date(date), new Date());
}

export type UrgencyLevel = "expired" | "critical" | "warning" | "safe";

export function getUrgencyLevel(expiryDate: string | Date): UrgencyLevel {
  const days = daysUntil(expiryDate);
  if (days < 0) return "expired";
  if (days <= 7) return "critical";
  if (days <= 30) return "warning";
  return "safe";
}

export const urgencyConfig: Record<UrgencyLevel, { label: string; className: string }> = {
  expired: {
    label: "Expired",
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
  critical: {
    label: "Critical",
    className: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  },
  warning: {
    label: "Warning",
    className: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  },
  safe: {
    label: "Safe",
    className: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  },
};
