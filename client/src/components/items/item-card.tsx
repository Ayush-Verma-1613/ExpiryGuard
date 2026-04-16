"use client";

import Link from "next/link";
import { Calendar, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { UrgencyBadge } from "./urgency-badge";
import { formatDate } from "@/lib/utils";
import type { Item } from "@/types";

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <Link href={`/items/${item._id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{item.name}</h3>
              {item.familyMemberId && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {item.familyMemberId.name}
                </p>
              )}
            </div>
            <UrgencyBadge expiryDate={item.expiryDate} />
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {item.categoryId?.name || "Other"}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(item.expiryDate)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
