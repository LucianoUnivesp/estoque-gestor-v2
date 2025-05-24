// src/hooks/product-types/useProductTypes.ts (Simplified)
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/services/api";
import { ProductType } from "@/interfaces";
import { validateProductType } from "@/utils/validation";

const PRODUCT_TYPES_KEY = "product-types";

export const useProductTypes = () => {
    return useQuery({
        queryKey: [PRODUCT_TYPES_KEY],
        queryFn: async (): Promise<ProductType[]> => {
            return await api.getProductTypes();
        },
        staleTime: 5 * 60 * 1000,
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
            queryClient.invalidateQueries({ queryKey: [PRODUCT_TYPES_KEY] });
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
            queryClient.invalidateQueries({ queryKey: [PRODUCT_TYPES_KEY] });
        },
    });
};

export const useDeleteProductType = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            return await api.deleteProductType(id);;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PRODUCT_TYPES_KEY] });
        },
    });
};