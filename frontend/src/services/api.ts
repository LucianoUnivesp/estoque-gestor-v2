/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { Product, ProductType, StockMovement, DashboardStats, PaginatedResponse, ProductTypeDistribution } from '@/interfaces';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 60000, // 60 second timeout
});

// Pagination and search interfaces
interface PaginationParams {
    page?: number;
    limit?: number;
    search?: string;
}

interface ProductSearchParams extends PaginationParams {
    productTypeId?: number;
}

// Products
export async function getProducts(params?: ProductSearchParams): Promise<Product[] | PaginatedResponse<Product>> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.productTypeId) searchParams.append('productTypeId', params.productTypeId.toString());

    const url = `/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await api.get(url);
    return response.data;
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const response = await api.post('/products', product);
    return response.data;
}

export async function updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    const response = await api.patch(`/products/${id}`, data);
    return response.data;
}

export async function deleteProduct(id: number): Promise<void> {
    await api.delete(`/products/${id}`);
}

// Product Types
export async function getProductTypes(params?: PaginationParams): Promise<ProductType[] | PaginatedResponse<ProductType>> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);

    const url = `/product-types${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await api.get(url);
    return response.data;
}

export async function createProductType(productType: Omit<ProductType, 'id'>): Promise<ProductType> {
    const response = await api.post('/product-types', productType);
    return response.data;
}

export async function updateProductType(id: number, data: Partial<ProductType>): Promise<ProductType> {
    const response = await api.patch(`/product-types/${id}`, data);
    return response.data;
}

export async function deleteProductType(id: number): Promise<void> {
    await api.delete(`/product-types/${id}`);
}

// Stock Movements
export async function getStockMovements(startDate?: string, endDate?: string): Promise<{
    movements: StockMovement[];
    summary: {
        entries: number;
        exits: number;
        balance: number;
        entriesValue: number;
        exitsValue: number;
    };
}> {
    let url = '/stock-movements';
    const params = new URLSearchParams();

    if (startDate) {
        params.append('startDate', startDate);
    }
    if (endDate) {
        params.append('endDate', endDate);
    }

    if (params.toString()) {
        url += `?${params.toString()}`;
    }

    const response = await api.get(url);
    return response.data;
}

export async function createStockMovement(movement: Omit<StockMovement, 'id' | 'createdAt'>): Promise<StockMovement> {
    const response = await api.post('/stock-movements', movement);
    return response.data;
}

export async function updateStockMovement(id: number, data: Partial<StockMovement>): Promise<StockMovement> {
    const response = await api.patch(`/stock-movements/${id}`, data);
    return response.data;
}

export async function deleteStockMovement(id: number): Promise<void> {
    await api.delete(`/stock-movements/${id}`);
}

// Dashboard
export async function getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get('/dashboard/stats');
    return response.data;
}

export async function getStockTrend(): Promise<any[]> {
    const response = await api.get('/dashboard/stock-trend');
    return response.data;
}

export async function getRecentMovements(): Promise<any[]> {
    const response = await api.get('/dashboard/recent-movements');
    return response.data;
}

export async function getProductTypeDistribution(): Promise<ProductTypeDistribution[]> {
    const response = await api.get('/dashboard/product-type-distribution');
    return response.data;
}

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response || error);
        return Promise.reject(error);
    }
);

export default api;