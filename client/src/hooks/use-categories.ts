"use client";

import useSWR from "swr";
import api from "@/lib/api";
import type { Category } from "@/types";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useCategories() {
  return useSWR<Category[]>("/categories", fetcher);
}
