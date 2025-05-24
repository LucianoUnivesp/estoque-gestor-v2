/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ProductType {
    id: number;
    name: string;
    description?: string;
}

export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    quantity: number;
    expirationDate?: string;
    supplier?: string;
    productTypeId?: number;
    productType?: ProductType;
}

export interface StockMovement {
    id: number;
    type: 'entry' | 'exit';
    quantity: number;
    productId: number;
    product?: Product;
    createdAt: string;
    notes?: string;
}

export interface DashboardStats {
    totalProducts: number;
    totalProductTypes: number;
    lowStockProducts: number;
    todayEntries: number;
    todayExits: number;
    todayBalance: number;
    todayEntriesValue: number;
    todayExitsValue: number;
}

// New interfaces for API responses
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

// Type guards for API responses
export function isPaginatedResponse<T>(response: any): response is PaginatedResponse<T> {
    return response && typeof response === 'object' && 'data' in response && 'pagination' in response;
}

// Union types for API responses
export type ProductTypesResponse = ProductType[] | PaginatedResponse<ProductType>;
export type ProductsResponse = Product[] | PaginatedResponse<Product>;