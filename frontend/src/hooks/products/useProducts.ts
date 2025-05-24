
// src/hooks/products/useProducts.ts (Simplified - no mock logic)
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/services/api";
import { Product } from "@/interfaces";
import { validateProduct } from "@/utils/validation";

const PRODUCTS_KEY = "products";

export const useProducts = () => {
    return useQuery({
        queryKey: [PRODUCTS_KEY],
        queryFn: async (): Promise<Product[]> => {
            return await api.getProducts();;
        },
        staleTime: 5 * 60 * 1000,
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
            queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
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
            queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
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
            queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
        },
    });
};