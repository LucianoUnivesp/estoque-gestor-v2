/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/services/api";
import { StockMovement } from "@/interfaces";
import { validateStockMovement } from "@/utils/validation";

const STOCK_MOVEMENTS_KEY = "stock-movements";
const PRODUCTS_KEY = "products";
const DASHBOARD_STATS_KEY = "dashboard-stats";

export const useStockMovements = (startDate?: string, endDate?: string) => {
    return useQuery({
        queryKey: [STOCK_MOVEMENTS_KEY, startDate, endDate],
        queryFn: async (): Promise<{
            movements: StockMovement[];
            summary: {
                entries: number;
                exits: number;
                balance: number;
                entriesValue: number;
                exitsValue: number;
            };
        }> => {
            return await api.getStockMovements(startDate, endDate);
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

export const useCreateStockMovement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (stockMovement: Omit<StockMovement, "id" | "createdAt">) => {
            const validationErrors = validateStockMovement(stockMovement);
            if (validationErrors.length > 0) {
                throw new Error(validationErrors[0].message);
            }

            return await api.createStockMovement(stockMovement);
        },
        onSuccess: () => {
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: [STOCK_MOVEMENTS_KEY] });
            queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
            queryClient.invalidateQueries({ queryKey: [DASHBOARD_STATS_KEY] });
        },
        onError: (error: any) => {
            console.error('Error creating stock movement:', error);
        },
    });
};

export const useUpdateStockMovement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Partial<StockMovement> }) => {
            const validationErrors = validateStockMovement(data);
            if (validationErrors.length > 0) {
                throw new Error(validationErrors[0].message);
            }

            return await api.updateStockMovement(id, data);
        },
        onSuccess: () => {
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: [STOCK_MOVEMENTS_KEY] });
            queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
            queryClient.invalidateQueries({ queryKey: [DASHBOARD_STATS_KEY] });
        },
        onError: (error: any) => {
            console.error('Error updating stock movement:', error);
        },
    });
};

export const useDeleteStockMovement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await api.deleteStockMovement(id);
            return id;
        },
        onSuccess: () => {
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: [STOCK_MOVEMENTS_KEY] });
            queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
            queryClient.invalidateQueries({ queryKey: [DASHBOARD_STATS_KEY] });
        },
        onError: (error: any) => {
            console.error('Error deleting stock movement:', error);
        },
    });
};