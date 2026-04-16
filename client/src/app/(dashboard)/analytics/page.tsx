"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertTriangle, XCircle, CheckCircle } from "lucide-react";
import { useAnalytics } from "@/hooks/use-analytics";

export default function AnalyticsPage() {
  const { data, isLoading } = useAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    { label: "Total Items", value: data.total, icon: Package, color: "text-blue-600 bg-blue-50" },
    { label: "Expiring (30d)", value: data.expiringThisMonth, icon: AlertTriangle, color: "text-yellow-600 bg-yellow-50" },
    { label: "Expired", value: data.expired, icon: XCircle, color: "text-red-600 bg-red-50" },
    { label: "Active", value: data.active, icon: CheckCircle, color: "text-green-600 bg-green-50" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>

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

      {/* By Category */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Items by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {data.byCategory.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No data yet</p>
          ) : (
            <div className="space-y-3">
              {data.byCategory.map((cat) => (
                <div key={cat.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm flex-1">{cat.name}</span>
                  <span className="text-sm font-semibold">{cat.count}</span>
                  <div className="w-24 bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        backgroundColor: cat.color,
                        width: `${(cat.count / data.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* By Month */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Expirations by Month</CardTitle>
        </CardHeader>
        <CardContent>
          {data.byMonth.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No upcoming expirations</p>
          ) : (
            <div className="flex items-end gap-2 h-40">
              {data.byMonth.map((m) => {
                const maxCount = Math.max(...data.byMonth.map((x) => x.count));
                const height = maxCount > 0 ? (m.count / maxCount) * 100 : 0;
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-medium">{m.count}</span>
                    <div
                      className="w-full bg-indigo-500 rounded-t min-h-[4px]"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-gray-500 truncate w-full text-center">
                      {m.month.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* By Member */}
      {data.byMember.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Items by Family Member</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.byMember.map((m) => (
                <div key={m.name} className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">{m.name}</span>
                    <span className="text-xs text-gray-500 ml-2">({m.relation})</span>
                  </div>
                  <span className="text-sm font-semibold">{m.count} items</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
