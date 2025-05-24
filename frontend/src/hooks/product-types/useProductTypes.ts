/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/services/api";
import { ProductType, ProductTypesResponse, isPaginatedResponse } from "@/interfaces";
import { validateProductType } from "@/utils/validation";

const PRODUCT_TYPES_KEY = "product-types";

interface ProductTypeSearchParams {
    page?: number;
    limit?: number;
    search?: string;
}

export const useProductTypes = (params?: ProductTypeSearchParams) => {
    return useQuery<ProductTypesResponse>({
        queryKey: [PRODUCT_TYPES_KEY, params],
        queryFn: async (): Promise<ProductTypesResponse> => {
            return await api.getProductTypes(params);
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

// Hook for getting all product types without pagination (for dropdowns, etc.)
export const useAllProductTypes = () => {
    return useQuery<ProductType[]>({
        queryKey: [PRODUCT_TYPES_KEY, 'all'],
        queryFn: async (): Promise<ProductType[]> => {
            const result = await api.getProductTypes();
            // If it's paginated, return just the data array, otherwise return as is
            return isPaginatedResponse<ProductType>(result) ? result.data : result;
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