"use client";

import useSWR from "swr";
import api from "@/lib/api";
import type { AnalyticsData } from "@/types";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useAnalytics() {
  return useSWR<AnalyticsData>("/analytics", fetcher);
}
