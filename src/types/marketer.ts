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

export interface SalesInvoiceItem {
  id: string;
  invoice_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  free_quantity: number;
  unit_price: number;
  total_price: number;
  promotion_id?: string;
}

export interface SalesInvoice {
  id: string;
  invoice_number: string;
  marketer_id: string;
  store_id: string;
  store?: Store;
  subtotal: number;
  product_discount: number;
  invoice_discount_type: DiscountType;
  invoice_discount_value: number;
  invoice_discount_amount: number;
  total_amount: number;
  status: InvoiceStatus;
  keeper_id?: string;
  stamped_invoice_image?: string;
  notes?: string;
  items: SalesInvoiceItem[];
  created_at: string;
}

export interface MarketerRequestItem {
  id: string;
  request_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
}

export interface MarketerRequest {
  id: string;
  invoice_number: string;
  marketer_id: string;
  status: RequestStatus;
  items: MarketerRequestItem[];
  created_at: string;
  updated_at?: string;
  keeper_id?: string;
}

export interface MarketerActualStock {
  id: string;
  marketer_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
}
