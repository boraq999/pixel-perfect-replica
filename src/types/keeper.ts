import {
    Product,
    RequestStatus,
    InvoiceStatus
} from './common';
import { MarketerRequest } from './marketer';

export interface WarehouseStock {
    id: string;
    product_id: string;
    product?: Product;
    quantity: number;
    min_limit: number; // For low stock alerts
    verification_status?: 'verified' | 'pending_verification';
}

export interface SupplyRequest {
    id: string;
    request_number: string;
    supplier_name: string;
    status: RequestStatus;
    items: SupplyRequestItem[];
    created_at: string;
    expected_date?: string;
    notes?: string;
}

export interface SupplyRequestItem {
    id: string;
    request_id: string;
    product_id: string;
    product?: Product;
    quantity: number;
    unit_cost: number;
}

// Keeper views Marketer Requests
export interface DashboardStats {
    total_stock_value: number;
    low_stock_items: number;
    pending_requests: number;
    daily_movements: number;
}
