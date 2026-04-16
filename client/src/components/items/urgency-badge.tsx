"use client";

import { Badge } from "@/components/ui/badge";
import { daysUntil, getUrgencyLevel, urgencyConfig } from "@/lib/utils";

interface UrgencyBadgeProps {
  expiryDate: string;
}

export function UrgencyBadge({ expiryDate }: UrgencyBadgeProps) {
  const level = getUrgencyLevel(expiryDate);
  const config = urgencyConfig[level];
  const days = daysUntil(expiryDate);

  const label =
    days < 0
      ? `Expired ${Math.abs(days)}d ago`
      : days === 0
        ? "Expires today"
        : `${days}d left`;

  return (
    <Badge variant="outline" className={config.className}>
      {label}
    </Badge>
  );
}
