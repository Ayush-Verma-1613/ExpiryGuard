"use client";

import useSWR from "swr";
import api from "@/lib/api";
import type { FamilyMember } from "@/types";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useFamily() {
  return useSWR<FamilyMember[]>("/family", fetcher);
}
