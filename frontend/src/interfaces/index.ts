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
