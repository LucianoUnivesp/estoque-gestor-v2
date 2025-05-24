// src/hooks/stock-movements/useStockMovements.ts (Simplified)
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { StockMovement } from "@/interfaces";
import { validateStockMovement } from "@/utils/validation";

const STOCK_MOVEMENTS_KEY = "stock-movements";

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
            let url = "/stock-movements";
            if (startDate && endDate) {
                url += `?startDate=${startDate}&endDate=${endDate}`;
            }
            const response = await api.get(url);
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
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

            const response = await api.post("/stock-movements", stockMovement);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [STOCK_MOVEMENTS_KEY] });
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

            const response = await api.patch(`/stock-movements/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [STOCK_MOVEMENTS_KEY] });
        },
    });
};

export const useDeleteStockMovement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/stock-movements/${id}`);
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [STOCK_MOVEMENTS_KEY] });
        },
    });
};