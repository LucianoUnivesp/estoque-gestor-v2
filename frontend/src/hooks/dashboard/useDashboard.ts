// src/hooks/dashboard/useDashboard.ts (Simplified)
"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { DashboardStats } from "@/interfaces";

// Cache keys
const DASHBOARD_STATS_KEY = "dashboard-stats";
const RECENT_MOVEMENTS_KEY = "recent-movements";
const STOCK_TREND_KEY = "stock-trend";

export const useDashboardStats = () => {
    return useQuery({
        queryKey: [DASHBOARD_STATS_KEY],
        queryFn: async (): Promise<DashboardStats> => {
            const response = await api.get("/dashboard/stats");
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useRecentMovements = () => {
    return useQuery({
        queryKey: [RECENT_MOVEMENTS_KEY],
        queryFn: async () => {
            const response = await api.get("/dashboard/recent-movements");
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useStockTrend = () => {
    return useQuery({
        queryKey: [STOCK_TREND_KEY],
        queryFn: async () => {
            const response = await api.get("/dashboard/stock-trend");
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};