"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/use-categories";
import { useFamily } from "@/hooks/use-family";
import { itemSchema, type ItemFormValues } from "@/lib/validations";
import api from "@/lib/api";
import type { Item } from "@/types";

interface ItemFormProps {
  mode: "create" | "edit";
  item?: Item;
}

export function ItemForm({ mode, item }: ItemFormProps) {
  const router = useRouter();
  const { data: categories } = useCategories();
  const { data: members } = useFamily();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: item
      ? {
          name: item.name,
          description: item.description || "",
          expiryDate: item.expiryDate.split("T")[0],
          purchaseDate: item.purchaseDate?.split("T")[0] || "",
          cost: item.cost || undefined,
          notes: item.notes || "",
          categoryId: item.categoryId?._id || "",
          familyMemberId: item.familyMemberId?._id || "",
          isEmergency: item.isEmergency,
        }
      : {
          name: "",
          description: "",
          expiryDate: "",
          purchaseDate: "",
          notes: "",
          categoryId: "",
          familyMemberId: "",
          reminderDays: [30, 7, 1],
          isEmergency: false,
        },
  });

  const onSubmit = async (data: ItemFormValues) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        familyMemberId: data.familyMemberId || null,
        cost: data.cost || null,
        purchaseDate: data.purchaseDate || null,
      };

      if (mode === "create") {
        await api.post("/items", payload);
        toast.success("Item created!");
      } else {
        await api.patch(`/items/${item?._id}`, payload);
        toast.success("Item updated!");
      }
      router.push("/items");
      router.refresh();
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        "Something went wrong";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === "create" ? "Add New Item" : "Edit Item"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" placeholder="e.g. Passport" {...register("name")} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={watch("categoryId")}
                onValueChange={(val) => setValue("categoryId", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category">
                    {categories?.find((c) => c._id === watch("categoryId"))?.name || "Select category"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-red-500">{errors.categoryId.message}</p>
              )}
            </div>

            {/* Expiry Date */}
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date *</Label>
              <Input id="expiryDate" type="date" {...register("expiryDate")} />
              {errors.expiryDate && (
                <p className="text-sm text-red-500">{errors.expiryDate.message}</p>
              )}
            </div>

            {/* Purchase Date */}
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input id="purchaseDate" type="date" {...register("purchaseDate")} />
            </div>

            {/* Cost */}
            <div className="space-y-2">
              <Label htmlFor="cost">Cost</Label>
              <Input id="cost" type="number" step="0.01" placeholder="0.00" {...register("cost", { valueAsNumber: true })} />
            </div>

            {/* Family Member */}
            <div className="space-y-2">
              <Label>Family Member</Label>
              <Select
                value={watch("familyMemberId") || ""}
                onValueChange={(val) => setValue("familyMemberId", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select member (optional)">
                    {members?.find((m) => m._id === watch("familyMemberId"))
                      ? `${members.find((m) => m._id === watch("familyMemberId"))!.name} (${members.find((m) => m._id === watch("familyMemberId"))!.relation})`
                      : "Select member (optional)"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {members?.map((m) => (
                    <SelectItem key={m._id} value={m._id}>
                      {m.name} ({m.relation})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" placeholder="Optional description" {...register("description")} />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Any additional notes..."
              {...register("notes")}
            />
          </div>

          {/* Emergency toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isEmergency"
              className="h-4 w-4 rounded border-gray-300"
              {...register("isEmergency")}
            />
            <Label htmlFor="isEmergency" className="text-sm font-normal">
              Include in emergency card
            </Label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? mode === "create"
                  ? "Creating..."
                  : "Saving..."
                : mode === "create"
                  ? "Create Item"
                  : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
