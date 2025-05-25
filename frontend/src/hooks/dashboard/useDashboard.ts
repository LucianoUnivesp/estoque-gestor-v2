"use client";

import { useQuery } from "@tanstack/react-query";
import * as api from "@/services/api";
import { DashboardStats, ProductTypeDistribution } from "@/interfaces";

// Cache keys
const DASHBOARD_STATS_KEY = "dashboard-stats";
const RECENT_MOVEMENTS_KEY = "recent-movements";
const STOCK_TREND_KEY = "stock-trend";
const PRODUCT_TYPE_DISTRIBUTION_KEY = "product-type-distribution";

export const useDashboardStats = () => {
    return useQuery({
        queryKey: [DASHBOARD_STATS_KEY],
        queryFn: async (): Promise<DashboardStats> => {
            return await api.getDashboardStats();
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
        retry: 2,
    });
};

export const useRecentMovements = () => {
    return useQuery({
        queryKey: [RECENT_MOVEMENTS_KEY],
        queryFn: async () => {
            return await api.getRecentMovements();
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
        retry: 2,
    });
};

export const useStockTrend = () => {
    return useQuery({
        queryKey: [STOCK_TREND_KEY],
        queryFn: async () => {
            return await api.getStockTrend();
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2,
    });
};

export const useProductTypeDistribution = () => {
    return useQuery({
        queryKey: [PRODUCT_TYPE_DISTRIBUTION_KEY],
        queryFn: async (): Promise<ProductTypeDistribution[]> => {
            return await api.getProductTypeDistribution();
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2,
    });
};