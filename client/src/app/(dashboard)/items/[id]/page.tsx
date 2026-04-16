"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Edit, Trash2, Calendar, Tag, User, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UrgencyBadge } from "@/components/items/urgency-badge";
import { useItem } from "@/hooks/use-items";
import { formatDate } from "@/lib/utils";
import api from "@/lib/api";

export default function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: item, isLoading } = useItem(id);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await api.delete(`/items/${id}`);
      toast.success("Item deleted");
      router.push("/items");
    } catch {
      toast.error("Failed to delete item");
    }
  };

  if (isLoading) {
    return <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />;
  }

  if (!item) {
    return <p className="text-center py-16 text-gray-500">Item not found</p>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold flex-1">{item.name}</h1>
        <Link href={`/items/${id}/edit`}>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </Link>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Details</CardTitle>
            <UrgencyBadge expiryDate={item.expiryDate} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-gray-500">Expiry Date</p>
                <p className="font-medium">{formatDate(item.expiryDate)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Tag className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-gray-500">Category</p>
                <p className="font-medium">{item.categoryId?.name || "Other"}</p>
              </div>
            </div>

            {item.purchaseDate && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-gray-500">Purchase Date</p>
                  <p className="font-medium">{formatDate(item.purchaseDate)}</p>
                </div>
              </div>
            )}

            {item.familyMemberId && (
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-gray-500">Family Member</p>
                  <p className="font-medium">
                    {item.familyMemberId.name} ({item.familyMemberId.relation})
                  </p>
                </div>
              </div>
            )}

            {item.cost != null && (
              <div className="text-sm">
                <p className="text-gray-500">Cost</p>
                <p className="font-medium">${item.cost}</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Badge>
            {item.isEmergency && (
              <Badge variant="outline" className="bg-orange-50 text-orange-700">
                Emergency Card
              </Badge>
            )}
          </div>

          {item.description && (
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="text-sm mt-1">{item.description}</p>
            </div>
          )}

          {item.notes && (
            <div>
              <p className="text-sm text-gray-500">Notes</p>
              <p className="text-sm mt-1 whitespace-pre-wrap">{item.notes}</p>
            </div>
          )}

          {item.documentUrl && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Document</p>
              <a
                href={item.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline"
              >
                <FileText className="h-4 w-4" />
                View Document
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
