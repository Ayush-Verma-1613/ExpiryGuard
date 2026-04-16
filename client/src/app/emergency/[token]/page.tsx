"use client";

import { use, useEffect, useState } from "react";
import { Shield, Calendar, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { UrgencyBadge } from "@/components/items/urgency-badge";

interface EmergencyItem {
  _id: string;
  name: string;
  expiryDate: string;
  status: string;
  categoryId: { name: string; color: string };
}

export default function EmergencyCardPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [data, setData] = useState<{ name: string; items: EmergencyItem[] } | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/emergency-card/${token}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setData)
      .catch(() => setError(true));
  }, [token]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Emergency card not found or expired.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <Shield className="h-10 w-10 text-indigo-600 mx-auto mb-2" />
          <h1 className="text-2xl font-bold">Emergency Card</h1>
          <p className="text-gray-500">{data.name}</p>
        </div>

        {data.items.length === 0 ? (
          <p className="text-center text-gray-500">No emergency items.</p>
        ) : (
          <div className="space-y-3">
            {data.items.map((item) => (
              <Card key={item._id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {item.categoryId?.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(item.expiryDate)}
                      </span>
                    </div>
                  </div>
                  <UrgencyBadge expiryDate={item.expiryDate} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
