"use client";

import { ItemForm } from "@/components/items/item-form";

export default function NewItemPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <ItemForm mode="create" />
    </div>
  );
}
