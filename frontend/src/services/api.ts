import axios from 'axios';
import { Product, ProductType, StockMovement, DashboardStats } from '@/interfaces';

// Import mocks
import { MOCK_PRODUCTS } from '@/mocks/products.mock';
import { MOCK_PRODUCT_TYPES } from '@/mocks/productTypes.mock';
import { MOCK_STOCK_MOVEMENTS } from '@/mocks/stockMovements.mock';
import {
    MOCK_DASHBOARD_STATS,
    MOCK_TREND_DATA,
    MOCK_RECENT_MOVEMENTS
} from '@/mocks/dashboard.mock';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 60000, // 60 second timeout
});

// In-memory storage for mock data persistence during session
const mockProductsStore = [...MOCK_PRODUCTS];
const mockProductTypesStore = [...MOCK_PRODUCT_TYPES];
const mockStockMovementsStore = [...MOCK_STOCK_MOVEMENTS];


const generateId = () => Date.now();

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

//Products
export async function getProducts(): Promise<Product[]> {
    const response = await api.get('/products');
    return response.data;
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const newProduct: Product = {
        ...product,
        id: generateId(),
        productType: mockProductTypesStore.find(type => type.id === product.productTypeId),
    };

    const response = await api.post('/products', newProduct);

    return response.data;
}

export async function updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    const response = await api.patch(`/products/${id}`, data)
    return response.data
}

export async function deleteProduct(id: number): Promise<void> {
    return await api.delete(`/products/${id}`)
}

// Product Types
export async function getProductTypes(): Promise<ProductType[]> {
    const response = await api.get('/product-types');
    return response.data;
}

export async function createProductType(productType: Omit<ProductType, 'id'>): Promise<ProductType> {
    await delay(400);
    const newProductType: ProductType = {
        ...productType,
        id: generateId(),
    };

    const response = await api.post('/product-types', newProductType);

    return response.data;
}

export async function updateProductType(id: number, data: Partial<ProductType>): Promise<ProductType> {
    const response = await api.patch(`/product-types/${id}`, data)
    return response.data
}

export async function deleteProductType(id: number): Promise<void> {
    return await api.delete(`/product-types/${id}`)
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
    await delay(400);

    let filteredMovements = [...mockStockMovementsStore];

    // Filter by date range if provided
    if (startDate || endDate) {
        filteredMovements = filteredMovements.filter(movement => {
            const movementDate = new Date(movement.createdAt);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate + 'T23:59:59.999Z') : null;

            if (start && movementDate < start) return false;
            if (end && movementDate > end) return false;

            return true;
        });
    }

    // Calculate summary
    const entries = filteredMovements.filter(m => m.type === "entry");
    const exits = filteredMovements.filter(m => m.type === "exit");

    const entriesQuantity = entries.reduce((sum, m) => sum + m.quantity, 0);
    const exitsQuantity = exits.reduce((sum, m) => sum + m.quantity, 0);
    const entriesValue = entries.reduce((sum, m) => sum + (m.quantity * (m.product?.price || 0)), 0);
    const exitsValue = exits.reduce((sum, m) => sum + (m.quantity * (m.product?.price || 0)), 0);

    return {
        movements: filteredMovements.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
        summary: {
            entries: entriesQuantity,
            exits: exitsQuantity,
            balance: entriesQuantity - exitsQuantity,
            entriesValue,
            exitsValue,
        },
    };
}

export async function createStockMovement(movement: Omit<StockMovement, 'id' | 'createdAt'>): Promise<StockMovement> {
    await delay(500);
    const product = mockProductsStore.find(p => p.id === movement.productId);

    const newMovement: StockMovement = {
        ...movement,
        id: generateId(),
        createdAt: new Date().toISOString(),
        product,
    };

    mockStockMovementsStore.push(newMovement);

    // Update product quantity
    if (product) {
        const productIndex = mockProductsStore.findIndex(p => p.id === product.id);
        if (productIndex !== -1) {
            if (movement.type === 'entry') {
                mockProductsStore[productIndex].quantity += movement.quantity;
            } else {
                mockProductsStore[productIndex].quantity = Math.max(0, mockProductsStore[productIndex].quantity - movement.quantity);
            }
        }
    }

    return newMovement;
}

export async function updateStockMovement(id: number, data: Partial<StockMovement>): Promise<StockMovement> {
    await delay(400);
    const index = mockStockMovementsStore.findIndex(sm => sm.id === id);
    if (index === -1) throw new Error('Movimentação não encontrada');

    const oldMovement = mockStockMovementsStore[index];
    const product = data.productId
        ? mockProductsStore.find(p => p.id === data.productId)
        : oldMovement.product;

    mockStockMovementsStore[index] = {
        ...oldMovement,
        ...data,
        product,
    };

    return mockStockMovementsStore[index];
}

export async function deleteStockMovement(id: number): Promise<void> {
    await delay(300);
    const index = mockStockMovementsStore.findIndex(sm => sm.id === id);
    if (index === -1) throw new Error('Movimentação não encontrada');

    const movement = mockStockMovementsStore[index];

    // Revert product quantity change
    if (movement.product) {
        const productIndex = mockProductsStore.findIndex(p => p.id === movement.product!.id);
        if (productIndex !== -1) {
            if (movement.type === 'entry') {
                mockProductsStore[productIndex].quantity = Math.max(0, mockProductsStore[productIndex].quantity - movement.quantity);
            } else {
                mockProductsStore[productIndex].quantity += movement.quantity;
            }
        }
    }

    mockStockMovementsStore.splice(index, 1);
}

// Dashboard
export async function getDashboardStats(): Promise<DashboardStats> {
    await delay(200);

    // Calculate real stats from current mock data
    const realStats = {
        totalProducts: mockProductsStore.length,
        totalProductTypes: mockProductTypesStore.length,
        lowStockProducts: mockProductsStore.filter(p => p.quantity <= 5).length,
        todayEntries: MOCK_DASHBOARD_STATS.todayEntries,
        todayExits: MOCK_DASHBOARD_STATS.todayExits,
        todayBalance: MOCK_DASHBOARD_STATS.todayBalance,
        todayEntriesValue: MOCK_DASHBOARD_STATS.todayEntriesValue,
        todayExitsValue: MOCK_DASHBOARD_STATS.todayExitsValue,
    };

    return realStats;
}

export async function getStockTrend(): Promise<typeof MOCK_TREND_DATA> {
    await delay(300);
    return MOCK_TREND_DATA;
}

export async function getRecentMovements(): Promise<typeof MOCK_RECENT_MOVEMENTS> {
    await delay(200);
    return MOCK_RECENT_MOVEMENTS;
}

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response || error);
        return Promise.reject(error);
    }
);
