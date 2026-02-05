import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    WarehouseStock,
    SupplyRequest,
    DashboardStats
} from '@/types/keeper';
import {
    MarketerRequest,
    SalesInvoice,
    Product
} from '@/types/marketer';
import { RequestStatus } from '@/types/common';

interface KeeperStore {
    warehouseStock: WarehouseStock[];
    supplyRequests: SupplyRequest[];
    marketerRequests: MarketerRequest[];
    returns: SalesInvoice[]; // Invoices marked for return
    stats: DashboardStats;
    isLoading: boolean;

    // Actions
    fetchInitialData: () => Promise<void>;

    // Warehouse Stock Actions
    addStock: (productId: string, quantity: number) => Promise<void>;
    updateStockLimit: (stockId: string, minLimit: number) => Promise<void>;

    // Keeper Request Actions
    approveMarketerRequest: (requestId: string) => Promise<void>;
    rejectMarketerRequest: (requestId: string, reason?: string) => Promise<void>;

    // Return Actions
    approveReturn: (invoiceId: string) => Promise<void>;
}

// Mock Data
const mockWarehouseStock: WarehouseStock[] = [
    { id: 'ws-1', product_id: '1', quantity: 5000, min_limit: 500, verification_status: 'verified' },
    { id: 'ws-2', product_id: '2', quantity: 1500, min_limit: 200, verification_status: 'verified' },
    { id: 'ws-3', product_id: '3', quantity: 50, min_limit: 100, verification_status: 'verified' }, // Low stock
];

const mockStats: DashboardStats = {
    total_stock_value: 150000,
    low_stock_items: 1,
    pending_requests: 5,
    daily_movements: 23
};

const mockMarketerRequests: MarketerRequest[] = [
    {
        id: 'req-101',
        invoice_number: 'REQ-2024-101',
        marketer_id: 'marketer-1',
        status: 'pending',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        items: []
    },
    {
        id: 'req-102',
        invoice_number: 'REQ-2024-102',
        marketer_id: 'marketer-3',
        status: 'pending',
        created_at: new Date(Date.now() - 7200000).toISOString(),
        items: []
    }
];

export const useKeeperStore = create<KeeperStore>()(
    persist(
        (set, get) => ({
            warehouseStock: mockWarehouseStock,
            supplyRequests: [],
            marketerRequests: mockMarketerRequests,
            returns: [],
            stats: mockStats,
            isLoading: false,

            fetchInitialData: async () => {
                set({ isLoading: true });
                // Simulate API
                await new Promise(resolve => setTimeout(resolve, 800));
                set({
                    warehouseStock: mockWarehouseStock,
                    stats: mockStats,
                    marketerRequests: mockMarketerRequests,
                    isLoading: false
                });
            },

            addStock: async (productId, quantity) => {
                set(state => ({
                    warehouseStock: state.warehouseStock.map(s =>
                        s.product_id === productId ? { ...s, quantity: s.quantity + quantity } : s
                    )
                }));
            },

            updateStockLimit: async (stockId, minLimit) => {
                set(state => ({
                    warehouseStock: state.warehouseStock.map(s =>
                        s.id === stockId ? { ...s, min_limit: minLimit } : s
                    )
                }));
            },

            approveMarketerRequest: async (requestId) => {
                set({ isLoading: true });
                await new Promise(resolve => setTimeout(resolve, 500));
                set(state => ({
                    marketerRequests: state.marketerRequests.map(r =>
                        r.id === requestId ? { ...r, status: 'approved' } : r
                    ),
                    stats: {
                        ...state.stats,
                        pending_requests: Math.max(0, state.stats.pending_requests - 1)
                    },
                    isLoading: false
                }));
            },

            rejectMarketerRequest: async (requestId) => {
                set(state => ({
                    marketerRequests: state.marketerRequests.map(r =>
                        r.id === requestId ? { ...r, status: 'rejected' } : r
                    ),
                    stats: {
                        ...state.stats,
                        pending_requests: Math.max(0, state.stats.pending_requests - 1)
                    }
                }));
            },

            approveReturn: async (invoiceId) => {
                // Logic for approving returns
                // This would typically involve verifying the goods returning to stock
            }
        }),
        {
            name: 'keeper-storage',
        }
    )
);
