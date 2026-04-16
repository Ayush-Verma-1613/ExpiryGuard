"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/use-categories";
import { useFamily } from "@/hooks/use-family";
import { Search } from "lucide-react";

interface ItemFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  member: string;
  onMemberChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
}

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "expired", label: "Expired" },
  { value: "renewed", label: "Renewed" },
  { value: "archived", label: "Archived" },
];

const SORT_OPTIONS = [
  { value: "expiry_asc", label: "Expiry (soonest)" },
  { value: "expiry_desc", label: "Expiry (latest)" },
  { value: "name_asc", label: "Name (A-Z)" },
  { value: "name_desc", label: "Name (Z-A)" },
  { value: "newest", label: "Newest first" },
];

export function ItemFilters({
  search, onSearchChange,
  category, onCategoryChange,
  status, onStatusChange,
  member, onMemberChange,
  sort, onSortChange,
}: ItemFiltersProps) {
  const { data: categories } = useCategories();
  const { data: members } = useFamily();

  const categoryLabel =
    category === "all"
      ? "All Categories"
      : categories?.find((c) => c._id === category)?.name ?? "Category";

  const statusLabel =
    STATUS_OPTIONS.find((s) => s.value === status)?.label ?? "Status";

  const memberLabel =
    member === "all"
      ? "All Members"
      : members?.find((m) => m._id === member)?.name ?? "Member";

  const sortLabel =
    SORT_OPTIONS.find((s) => s.value === sort)?.label ?? "Sort by";

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search items..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={category} onValueChange={(val) => onCategoryChange(val)}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Category">{categoryLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories?.map((cat) => (
            <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={(val) => onStatusChange(val)}>
        <SelectTrigger className="w-full sm:w-36">
          <SelectValue placeholder="Status">{statusLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={member} onValueChange={(val) => onMemberChange(val)}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Member">{memberLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Members</SelectItem>
          {members?.map((m) => (
            <SelectItem key={m._id} value={m._id}>{m.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sort} onValueChange={(val) => onSortChange(val)}>
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Sort by">{sortLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
