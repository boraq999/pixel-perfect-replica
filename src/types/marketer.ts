import {
  Product,
  Store,
  RequestStatus,
  InvoiceStatus,
  DiscountType,
  NavigationItem,
  ProductPromotion
} from './common';

export type { RequestStatus, InvoiceStatus, DiscountType, Product, Store, NavigationItem, ProductPromotion };

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
  id: number;
  request_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  current_price: number;
}

export interface MarketerRequest {
  id: number;
  invoice_number: string;
  marketer_id: number;
  status: 'pending' | 'approved' | 'documented' | 'rejected' | 'cancelled';
  created_at: string;
  updated_at: string;
  approved_by?: number;
  approved_at?: string;
  documented_by?: number;
  documented_at?: string;
  rejected_by?: number;
  rejected_at?: string;
  stamped_image?: string;
  notes?: string;
  approver_name?: string;
  documenter_name?: string;
  rejecter_name?: string;
}

export interface MarketerRequestDetails {
  request: MarketerRequest;
  items: MarketerRequestItem[];
}

export interface MarketerActualStock {
  id: string;
  marketer_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
}
