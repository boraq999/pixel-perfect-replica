export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'documented';
export type InvoiceStatus = 'pending' | 'approved' | 'cancelled';
export type DiscountType = 'percentage' | 'fixed';

export interface Product {
    id: string;
    name: string;
    barcode: string;
    description: string;
    current_price: number;
    is_active: boolean;
    image?: string;
}

export interface ProductPromotion {
    id: string;
    product_id: string;
    min_quantity: number;
    free_quantity: number;
    is_active: boolean;
}

export interface Store {
    id: string;
    name: string;
    owner_name: string;
    phone: string;
    location: string;
    address: string;
}

export interface NavigationItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}
