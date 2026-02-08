import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { marketerRequestsAPI } from '@/api/marketerRequests';
import { productsAPI } from '@/api/products';
import { salesInvoicesAPI } from '@/api/salesInvoices';
import { storesAPI, StoreFilters } from '@/api/stores';
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

export interface PaginationData {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

interface MarketerStore {
  requests: MarketerRequest[];
  stock: MarketerActualStock[];
  reservedStock: MarketerActualStock[];
  products: Product[];
  stores: Store[];
  storesPagination: PaginationData | null;
  totalStoresBalance: number;
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

  fetchSalesInvoices: () => Promise<void>;
  fetchStores: (filters?: StoreFilters) => Promise<void>;
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

const mockRequests: MarketerRequest[] = [
  {
    id: 'req-1',
    invoice_number: 'REQ-2024-001',
    marketer_id: 'marketer-2',
    status: 'approved',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    items: [
      { id: 'item-1', request_id: 'req-1', product_id: '1', quantity: 20, product: mockProducts[0] },
      { id: 'item-2', request_id: 'req-1', product_id: '2', quantity: 50, product: mockProducts[1] },
    ]
  },
  {
    id: 'req-2',
    invoice_number: 'REQ-2024-002',
    marketer_id: 'marketer-2',
    status: 'pending',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    items: [
      { id: 'item-3', request_id: 'req-2', product_id: '3', quantity: 15, product: mockProducts[2] },
    ]
  }
];

const mockStock: MarketerActualStock[] = [
  {
    id: 'stock-1',
    marketer_id: 'marketer-2',
    product_id: '1',
    quantity: 45,
    product: mockProducts[0]
  },
  {
    id: 'stock-2',
    marketer_id: 'marketer-2',
    product_id: '2',
    quantity: 120,
    product: mockProducts[1]
  }
];

export const useMarketerStore = create<MarketerStore>()(
  persist(
    (set, get) => ({
      requests: mockRequests,
      stock: mockStock,
      reservedStock: [],
      products: mockProducts,
      stores: mockStores,
      storesPagination: null,
      totalStoresBalance: 0,
      promotions: mockPromotions,
      invoices: [],
      isLoading: false,

      fetchInitialData: async () => {
        set({ products: mockProducts, stores: mockStores, promotions: mockPromotions });
      },

      fetchProducts: async () => {
        set({ isLoading: true });
        try {
          const response = await productsAPI.getProducts();
          set({ products: response.data?.data || [], isLoading: false });
        } catch (error) {
          console.error('Failed to fetch products', error);
          set({ isLoading: false });
        }
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

      fetchRequests: async (marketerId) => {
        set({ isLoading: true });
        try {
          // جلب الطلبات والمنتجات
          const [requestsResponse, productsResponse] = await Promise.all([
            marketerRequestsAPI.getRequests(),
            productsAPI.getProducts()
          ]);

          console.log('📦 Requests List Response:', requestsResponse);

          const basicRequests = requestsResponse.data?.data || [];
          const products = productsResponse.data?.data || [];

          // تحديث قائمة المنتجات في الـ store
          set({ products });

          // جلب تفاصيل كل طلب للحصول على الأصناف (Items) وربطها بالمنتجات
          const detailedRequests = await Promise.all(
            basicRequests.map(async (req: any) => {
              try {
                const detailsResponse = await marketerRequestsAPI.getRequestDetails(req.id);

                const rawItems = detailsResponse.data?.items || [];

                // ربط الأصناف ببيانات المنتج
                const itemsWithProduct = rawItems.map((item: any) => {
                  const product = products.find((p: any) => p.id === item.product_id);
                  return {
                    ...item,
                    product: product || { name: item.product_name || 'منتج غير معروف', id: item.product_id, barcode: '---' }
                  };
                });

                return {
                  ...req,
                  ...detailsResponse.data?.request,
                  items: itemsWithProduct
                };
              } catch (error) {
                console.error(`Failed to fetch details for request ${req.id}`, error);
                return { ...req, items: [] };
              }
            })
          );

          console.log('📦 Detailed Requests (with products):', detailedRequests);

          set({
            requests: detailedRequests,
            isLoading: false
          });
        } catch (error) {
          console.error('Failed to fetch requests', error);
          set({ isLoading: false });
        }
      },
      fetchStock: async (marketerId) => {
        set({ isLoading: true });
        try {
          // جلب المخزون الفعلي والمحجوز والمنتجات معاً
          const [stockResponse, reservedStockResponse, productsResponse] = await Promise.all([
            marketerRequestsAPI.getActualStock(),
            marketerRequestsAPI.getReservedStock(),
            productsAPI.getProducts()
          ]);

          console.log('🏭 Actual Stock Raw:', stockResponse);
          console.log('📦 Reserved Stock Raw:', reservedStockResponse);

          const rawStock = stockResponse.data?.data || [];
          const rawReservedStock = reservedStockResponse.data?.data || [];
          const products = productsResponse.data?.data || [];

          // تحديث قائمة المنتجات
          set({ products });

          // دالة مساعدة لربط المنتج بالمخزون
          const mapStockWithProduct = (stockItems: any[]) => {
            return stockItems.map((item: any) => {
              const product = products.find((p: any) => p.id === item.product_id);
              return {
                ...item,
                product: product || { name: 'منتج غير معروف', id: item.product_id, barcode: '---' }
              };
            });
          };

          const stockWithDetails = mapStockWithProduct(rawStock);
          const reservedStockWithDetails = mapStockWithProduct(rawReservedStock);

          set({
            stock: stockWithDetails,
            reservedStock: reservedStockWithDetails,
            isLoading: false
          });
        } catch (error) {
          console.error('Failed to fetch stock', error);
          set({ isLoading: false });
        }
      },

      fetchSalesInvoices: async () => {
        set({ isLoading: true });
        try {
          const response = await salesInvoicesAPI.getSalesInvoices();
          console.log('💰 Sales Invoices Response:', response);

          const invoices = response.data?.data || [];
          set({ invoices, isLoading: false });
        } catch (error) {
          console.error('Failed to fetch sales invoices', error);
          set({ isLoading: false });
        }
      },

      fetchStores: async (filters) => {
        set({ isLoading: true });
        try {
          // جلب المتاجر (مقسمة لصفحات) وجلب الديون (القائمة الكاملة)
          const [storesResponse, debtsResponse] = await Promise.all([
            storesAPI.getStores(filters),
            storesAPI.getStoresDebts()
          ]);

          console.log('🏪 Stores API Response:', storesResponse);
          console.log('💸 Stores Debts Response:', debtsResponse);

          const paginationObj = storesResponse;
          const basicStores = paginationObj.data || [];

          // تحديد مصفوفة الديون بشكل صحيح (سواء كانت مصفوفة مباشرة أو كائن مقسم لصفحات)
          const debtsDataRaw = debtsResponse.data || [];
          const debtsList = Array.isArray(debtsDataRaw) ? debtsDataRaw : (debtsDataRaw.data || []);

          // دمج بيانات الديون مع المتاجر في الصفحة الحالية
          const storesWithDebts = basicStores.map((store: any) => {
            const debtInfo = debtsList.find((d: any) => d.id === store.id);
            return {
              ...store,
              ...(debtInfo || {}),
              remaining_debt: debtInfo?.remaining_debt || 0
            };
          });

          // حساب إجمالي الديون لجميع المتاجر (من القائمة المتاحة)
          const totalBalance = debtsList.reduce((acc: number, curr: any) => acc + (Number(curr.remaining_debt) || 0), 0);

          set({
            stores: storesWithDebts,
            totalStoresBalance: totalBalance,
            storesPagination: {
              current_page: paginationObj.current_page,
              last_page: paginationObj.last_page,
              total: paginationObj.total,
              per_page: paginationObj.per_page
            },
            isLoading: false
          });
        } catch (error) {
          console.error('Failed to fetch stores', error);
          set({ isLoading: false });
        }
      },

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
