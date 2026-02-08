import axiosInstance from './axiosInstance';

export interface CreateSalesInvoiceItem {
    product_id: number;
    quantity: number;
}

export interface CreateSalesInvoicePayload {
    store_id: number;
    items: CreateSalesInvoiceItem[];
    notes?: string;
}

export interface SalesInvoiceFilters {
    status?: 'pending' | 'approved' | 'rejected' | 'cancelled';
    page?: number;
}

export const salesInvoicesAPI = {
    // إنشاء فاتورة بيع جديدة
    createSalesInvoice: async (payload: CreateSalesInvoicePayload) => {
        const response = await axiosInstance.post('/marketer/sales', payload);
        return response.data;
    },

    // عرض جميع فواتير البيع
    getSalesInvoices: async (filters?: SalesInvoiceFilters) => {
        const response = await axiosInstance.get('/marketer/sales', { params: filters });
        return response.data;
    },

    // عرض تفاصيل فاتورة
    getSalesInvoiceDetails: async (id: number | string) => {
        const response = await axiosInstance.get(`/marketer/sales/${id}`);
        return response.data;
    },

    // عرض معلومات رفض الفاتورة
    getRejectionDetails: async (id: number | string) => {
        const response = await axiosInstance.get(`/marketer/sales/${id}/rejection`);
        return response.data;
    },

    // إلغاء فاتورة
    cancelSalesInvoice: async (id: number | string) => {
        const response = await axiosInstance.put(`/marketer/sales/${id}/cancel`);
        return response.data;
    }
};
