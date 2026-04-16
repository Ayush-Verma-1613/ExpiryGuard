"use client";

import useSWR from "swr";
import api from "@/lib/api";
import type { ItemsResponse, Item } from "@/types";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

interface ItemFilters {
  search?: string;
  category?: string;
  status?: string;
  member?: string;
  sort?: string;
  page?: number;
}

export function useItems(filters?: ItemFilters) {
  const params = new URLSearchParams();
  if (filters?.search) params.set("search", filters.search);
  if (filters?.category) params.set("category", filters.category);
  if (filters?.status) params.set("status", filters.status);
  if (filters?.member) params.set("member", filters.member);
  if (filters?.sort) params.set("sort", filters.sort);
  if (filters?.page) params.set("page", String(filters.page));

  const query = params.toString();
  return useSWR<ItemsResponse>(`/items${query ? `?${query}` : ""}`, fetcher, {
    keepPreviousData: true,
  });
}

export function useItem(id: string) {
  return useSWR<Item>(id ? `/items/${id}` : null, fetcher);
}
