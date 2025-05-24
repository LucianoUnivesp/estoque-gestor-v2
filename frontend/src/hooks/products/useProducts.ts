/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/services/api";
import { Product, ProductsResponse, isPaginatedResponse } from "@/interfaces";
import { validateProduct } from "@/utils/validation";

const PRODUCTS_KEY = "products";

interface ProductSearchParams {
    page?: number;
    limit?: number;
    search?: string;
    productTypeId?: number;
}

export const useProducts = (params?: ProductSearchParams) => {
    return useQuery<ProductsResponse>({
        queryKey: [PRODUCTS_KEY, params],
        queryFn: async (): Promise<ProductsResponse> => {
            return await api.getProducts(params);
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

// Hook for getting all products without pagination (for dropdowns, etc.)
export const useAllProducts = () => {
    return useQuery<Product[]>({
        queryKey: [PRODUCTS_KEY, 'all'],
        queryFn: async (): Promise<Product[]> => {
            const result = await api.getProducts();
            // If it's paginated, return just the data array, otherwise return as is
            return isPaginatedResponse<Product>(result) ? result.data : result;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (product: Omit<Product, "id">) => {
            const validationErrors = validateProduct(product);
            if (validationErrors.length > 0) {
                throw new Error(validationErrors[0].message);
            }

            return await api.createProduct(product);
        },
        onSuccess: () => {
            // Invalidate all product-related queries
            queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
        },
        onError: (error: any) => {
            console.error('Error creating product:', error);
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Partial<Product> }) => {
            const validationErrors = validateProduct(data);
            if (validationErrors.length > 0) {
                throw new Error(validationErrors[0].message);
            }

            return await api.updateProduct(id, data);
        },
        onSuccess: () => {
            // Invalidate all product-related queries
            queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
        },
        onError: (error: any) => {
            console.error('Error updating product:', error);
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            return await api.deleteProduct(id);
        },
        onSuccess: () => {
            // Invalidate all product-related queries
            queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
        },
        onError: (error: any) => {
            console.error('Error deleting product:', error);
        },
    });
};