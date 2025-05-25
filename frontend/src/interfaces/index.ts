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
    costPrice: number;
    salePrice: number;
    quantity: number;
    expirationDate?: string;
    supplier?: string;
    productTypeId?: number;
    productType?: ProductType;
    profitMargin?: number;
    profitValue?: number;
}

export interface StockMovement {
    id: number;
    type: 'entry' | 'exit';
    quantity: number;
    productId: number;
    product?: {
        id: number;
        name: string;
        costPrice: number;
        salePrice: number;
        productType?: {
            id: number;
            name: string;
        };
    };
    createdAt: string;
    notes?: string;
}

export interface DashboardStats {
    totalProducts: number;
    totalProductTypes: number;
    lowStockProducts: number;
    todaySales: number; // Mudança: era todayExits
    todayPurchases: number; // Mudança: era todayEntries
    todayBalance: number;
    todaySalesValue: number; // Valor total das vendas
    todayPurchasesValue: number; // Valor total das compras
    todayProfit: number; // Lucro do dia
    todayProfitMargin: number; // Margem de lucro do dia em %
}

export interface ProductTypeDistribution {
    id: number;
    name: string;
    value: number;
    percentage: number;
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