import axiosInstance from './axiosInstance';

export interface StoreFilters {
    is_active?: 0 | 1;
    page?: number;
}

export const storesAPI = {
    // عرض جميع المتاجر
    getStores: async (filters?: StoreFilters) => {
        const response = await axiosInstance.get('/stores', { params: filters });
        return response.data;
    },

    // عرض تفاصيل متجر محدد (اختياري، للتحسين مستقبلاً)
    getStoreDetails: async (id: number | string) => {
        const response = await axiosInstance.get(`/stores/${id}`);
        return response.data;
    },

    // عرض جميع المتاجر مع الديون
    getStoresDebts: async () => {
        const response = await axiosInstance.get('/stores/debts');
        return response.data;
    },

    // عرض تفاصيل متجر محدد وسجل الحركات
    getStoreDebtsDetails: async (id: number | string) => {
        const response = await axiosInstance.get(`/stores/debts/${id}`);
        return response.data;
    }
};
