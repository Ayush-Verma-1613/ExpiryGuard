"use client";

import Link from "next/link";
import { Package, AlertTriangle, XCircle, CheckCircle, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ItemCard } from "@/components/items/item-card";
import { useItems } from "@/hooks/use-items";

export default function DashboardPage() {
  const { data, isLoading } = useItems({ sort: "expiry_asc" });

  const items = data?.items || [];
  const now = new Date();
  const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const activeItems = items.filter((i) => i.status === "active");
  const expiredItems = items.filter((i) => i.status === "expired");
  const expiringSoon = activeItems.filter(
    (i) => new Date(i.expiryDate) <= thirtyDaysFromNow && new Date(i.expiryDate) >= now
  );

  const stats = [
    { label: "Total Items", value: data?.total || 0, icon: Package, color: "text-blue-600 bg-blue-50" },
    { label: "Expiring Soon", value: expiringSoon.length, icon: AlertTriangle, color: "text-yellow-600 bg-yellow-50" },
    { label: "Expired", value: expiredItems.length, icon: XCircle, color: "text-red-600 bg-red-50" },
    { label: "Active", value: activeItems.length, icon: CheckCircle, color: "text-green-600 bg-green-50" },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="h-16 bg-gray-100 animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link href="/items/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-2.5 rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Expiring Soon */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Expiring Soon</CardTitle>
        </CardHeader>
        <CardContent>
          {expiringSoon.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No items expiring in the next 30 days. You&apos;re all set!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {expiringSoon.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recently Expired */}
      {expiredItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-red-600">Expired Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {expiredItems.slice(0, 6).map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
