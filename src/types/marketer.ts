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
