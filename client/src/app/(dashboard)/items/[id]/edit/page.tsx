"use client";

import { use } from "react";
import { ItemForm } from "@/components/items/item-form";
import { useItem } from "@/hooks/use-items";

export default function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: item, isLoading } = useItem(id);

  if (isLoading) {
    return <div className="h-64 bg-gray-100 animate-pulse rounded-lg max-w-2xl mx-auto" />;
  }

  if (!item) {
    return <p className="text-center py-16 text-gray-500">Item not found</p>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <ItemForm mode="edit" item={item} />
    </div>
  );
}
