/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/product-types/useProductTypes.ts - Enhanced with search and pagination
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/services/api";
import { ProductType } from "@/interfaces";
import { validateProductType } from "@/utils/validation";

const PRODUCT_TYPES_KEY = "product-types";

interface ProductTypeSearchParams {
    page?: number;
    limit?: number;
    search?: string;
}

export const useProductTypes = (params?: ProductTypeSearchParams) => {
    return useQuery({
        queryKey: [PRODUCT_TYPES_KEY, params],
        queryFn: async () => {
            return await api.getProductTypes(params);
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
        keepPreviousData: true, // Important for pagination UX
    });
};

// Hook for getting all product types without pagination (for dropdowns, etc.)
export const useAllProductTypes = () => {
    return useQuery({
        queryKey: [PRODUCT_TYPES_KEY, 'all'],
        queryFn: async (): Promise<ProductType[]> => {
            const result = await api.getProductTypes();
            // If it's paginated, return just the data array, otherwise return as is
            return Array.isArray(result) ? result : result.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useCreateProductType = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (productType: Omit<ProductType, "id">) => {
            const validationErrors = validateProductType(productType);
            if (validationErrors.length > 0) {
                throw new Error(validationErrors[0].message);
            }

            return await api.createProductType(productType);
        },
        onSuccess: () => {
            // Invalidate all product type-related queries
            queryClient.invalidateQueries({ queryKey: [PRODUCT_TYPES_KEY] });
        },
        onError: (error: any) => {
            console.error('Error creating product type:', error);
        },
    });
};

export const useUpdateProductType = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Partial<ProductType> }) => {
            const validationErrors = validateProductType(data);
            if (validationErrors.length > 0) {
                throw new Error(validationErrors[0].message);
            }

            return await api.updateProductType(id, data);
        },
        onSuccess: () => {
            // Invalidate all product type-related queries
            queryClient.invalidateQueries({ queryKey: [PRODUCT_TYPES_KEY] });
        },
        onError: (error: any) => {
            console.error('Error updating product type:', error);
        },
    });
};

export const useDeleteProductType = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            return await api.deleteProductType(id);
        },
        onSuccess: () => {
            // Invalidate all product type-related queries
            queryClient.invalidateQueries({ queryKey: [PRODUCT_TYPES_KEY] });
        },
        onError: (error: any) => {
            console.error('Error deleting product type:', error);
        },
    });
};