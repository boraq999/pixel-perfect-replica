import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  MarketerRequest, 
  Product, 
  MarketerActualStock,
  RequestStatus,
  SalesInvoice,
  Store,
  ProductPromotion,
  InvoiceStatus,
  DiscountType
} from '@/types/marketer';

interface MarketerStore {
  requests: MarketerRequest[];
  stock: MarketerActualStock[];
  products: Product[];
  stores: Store[];
  promotions: ProductPromotion[];
  invoices: SalesInvoice[];
  isLoading: boolean;
  
  // Actions
  fetchInitialData: () => Promise<void>;
  createRequest: (marketerId: string, items: { product_id: string; quantity: number }[]) => Promise<void>;
  cancelRequest: (requestId: string) => Promise<void>;
  
  // Sales Actions
  createSalesInvoice: (invoiceData: Partial<SalesInvoice>) => Promise<void>;
  cancelSalesInvoice: (invoiceId: string) => Promise<void>;
  
  // Mock Utils
  fetchProducts: () => Promise<void>;
  fetchRequests: (marketerId: string) => Promise<void>;
  fetchStock: (marketerId: string) => Promise<void>;

  // Warehouse Keeper Actions (For simulation)
  approveRequest: (requestId: string, keeperId: string) => Promise<void>;
  documentRequest: (requestId: string, keeperId: string, signedImage: string) => Promise<void>;
}

const mockProducts: Product[] = [
  { id: '1', name: 'زيت زيتون 1 لتر', barcode: '6220001', description: 'زيت زيتون بكر ممتاز', current_price: 25, is_active: true },
  { id: '2', name: 'معجون طماطم 400 جرام', barcode: '6220002', description: 'معجون طماطم طبيعي', current_price: 5, is_active: true },
  { id: '3', name: 'تونة قطعة واحدة', barcode: '6220003', description: 'تونة سهلة الفتح', current_price: 12, is_active: true },
];

const mockStores: Store[] = [
  { id: 's1', name: 'سوبر ماركت الوفاء', owner_name: 'علي محمد', phone: '0912223344', location: 'طرابلس', address: 'حي الأندلس' },
  { id: 's2', name: 'محل البركة', owner_name: 'سالم أحمد', phone: '0925556677', location: 'بنغازي', address: 'وسط البلاد' },
];

const mockPromotions: ProductPromotion[] = [
  { id: 'p1', product_id: '1', min_quantity: 10, free_quantity: 1, is_active: true }, // اشتر 10 زيت واحصل على 1 مجانا
  { id: 'p2', product_id: '2', min_quantity: 24, free_quantity: 2, is_active: true }, // صندوق طماطم (24) معه 2 مجانا
];

export const useMarketerStore = create<MarketerStore>()(
  persist(
    (set, get) => ({
      requests: [],
      stock: [],
      products: mockProducts,
      stores: mockStores,
      promotions: mockPromotions,
      invoices: [],
      isLoading: false,

      fetchInitialData: async () => {
        set({ products: mockProducts, stores: mockStores, promotions: mockPromotions });
      },

      fetchProducts: async () => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 500));
        set({ products: mockProducts, isLoading: false });
      },

      createRequest: async (marketerId, items) => {
        set({ isLoading: true });
        const newRequest: MarketerRequest = {
          id: Math.random().toString(36).substr(2, 9),
          invoice_number: `REQ-${Date.now()}`,
          marketer_id: marketerId,
          status: 'pending',
          items: items.map(item => ({
            id: Math.random().toString(36).substr(2, 9),
            request_id: '',
            product_id: item.product_id,
            quantity: item.quantity,
            product: get().products.find(p => p.id === item.product_id)
          })),
          created_at: new Date().toISOString(),
        };
        set(state => ({ requests: [newRequest, ...state.requests], isLoading: false }));
      },

      cancelRequest: async (requestId) => {
        set(state => ({
          requests: state.requests.map(req => 
            req.id === requestId ? { ...req, status: 'cancelled' } : req
          )
        }));
      },

      fetchRequests: async (marketerId) => {},
      fetchStock: async (marketerId) => {},

      approveRequest: async (requestId, keeperId) => {
        set(state => ({
          requests: state.requests.map(req => 
            req.id === requestId ? { ...req, status: 'approved', keeper_id: keeperId } : req
          )
        }));
      },

      documentRequest: async (requestId, keeperId, signedImage) => {
        const state = get();
        const request = state.requests.find(r => r.id === requestId);
        if (!request) return;

        const updatedStock = [...state.stock];
        request.items.forEach(item => {
          const stockIndex = updatedStock.findIndex(s => s.product_id === item.product_id);
          if (stockIndex >= 0) {
            updatedStock[stockIndex].quantity += item.quantity;
          } else {
            updatedStock.push({
              id: Math.random().toString(36).substr(2, 9),
              marketer_id: request.marketer_id,
              product_id: item.product_id,
              product: item.product,
              quantity: item.quantity
            });
          }
        });

        set(state => ({
          requests: state.requests.map(req => 
            req.id === requestId ? { ...req, status: 'documented' } : req
          ),
          stock: updatedStock
        }));
      },

      createSalesInvoice: async (invoiceData) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const state = get();
        const newInvoice: SalesInvoice = {
          id: Math.random().toString(36).substr(2, 9),
          invoice_number: `SAL-${Date.now()}`,
          status: 'pending',
          created_at: new Date().toISOString(),
          ...invoiceData
        } as SalesInvoice;

        // Deduct from Marketer Stock
        const updatedStock = state.stock.map(s => {
          const item = newInvoice.items.find(i => i.product_id === s.product_id);
          if (item) {
            return { ...s, quantity: s.quantity - (item.quantity + item.free_quantity) };
          }
          return s;
        });

        set(state => ({
          invoices: [newInvoice, ...state.invoices],
          stock: updatedStock,
          isLoading: false
        }));
      },

      cancelSalesInvoice: async (invoiceId) => {
        const state = get();
        const invoice = state.invoices.find(i => i.id === invoiceId);
        if (!invoice || invoice.status !== 'pending') return;

        // Return stock to Marketer
        const updatedStock = state.stock.map(s => {
          const item = invoice.items.find(i => i.product_id === s.product_id);
          if (item) {
            return { ...s, quantity: s.quantity + (item.quantity + item.free_quantity) };
          }
          return s;
        });

        set(state => ({
          invoices: state.invoices.map(inv => 
            inv.id === invoiceId ? { ...inv, status: 'cancelled' } : inv
          ),
          stock: updatedStock
        }));
      }
    }),
    {
      name: 'marketer-storage',
    }
  )
);
