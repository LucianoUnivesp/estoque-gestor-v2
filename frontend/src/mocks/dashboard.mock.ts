// src/mocks/dashboard.mock.ts
import { DashboardStats } from "@/interfaces";

export const MOCK_DASHBOARD_STATS: DashboardStats = {
    totalProducts: 25,
    totalProductTypes: 8,
    lowStockProducts: 3,
    todayEntries: 12,
    todayExits: 7,
    todayBalance: 5,
    todayEntriesValue: 1500.75,
    todayExitsValue: 850.25,
};

export const MOCK_TREND_DATA = [
    { date: "01/05", entries: 50, exits: 30, balance: 20 },
    { date: "02/05", entries: 45, exits: 35, balance: 10 },
    { date: "03/05", entries: 60, exits: 40, balance: 20 },
    { date: "04/05", entries: 70, exits: 50, balance: 20 },
    { date: "05/05", entries: 55, exits: 45, balance: 10 },
    { date: "06/05", entries: 80, exits: 60, balance: 20 },
    { date: "07/05", entries: 90, exits: 70, balance: 20 },
];

export const MOCK_RECENT_MOVEMENTS = [
    {
        id: 1,
        product: { name: "Smartphone Galaxy S22 ALTERADO" },
        type: "entry" as const,
        quantity: 10,
        createdAt: "2024-05-22T10:30:00Z",
    },
    {
        id: 2,
        product: { name: "Notebook Dell XPS" },
        type: "exit" as const,
        quantity: 2,
        createdAt: "2024-05-22T09:15:00Z",
    },
    {
        id: 3,
        product: { name: "Mouse Wireless Logitech" },
        type: "entry" as const,
        quantity: 15,
        createdAt: "2024-05-21T14:20:00Z",
    },
];