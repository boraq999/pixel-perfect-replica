import axiosInstance from './axiosInstance';

export interface CreateRequestItem {
  product_id: number;
  quantity: number;
}

export interface CreateRequestPayload {
  items: CreateRequestItem[];
}

export interface RequestFilters {
  status?: 'pending' | 'approved' | 'documented' | 'rejected' | 'cancelled';
  from_date?: string;
  to_date?: string;
}

export const marketerRequestsAPI = {
  // إنشاء طلب جديد
  createRequest: async (payload: CreateRequestPayload) => {
    const response = await axiosInstance.post('/marketer/requests', payload);
    return response.data;
  },

  // عرض جميع الطلبات
  getRequests: async (filters?: RequestFilters) => {
    const response = await axiosInstance.get('/marketer/requests', { params: filters });
    return response.data;
  },

  // عرض تفاصيل طلب محدد
  getRequestDetails: async (id: number) => {
    const response = await axiosInstance.get(`/marketer/requests/${id}`);
    return response.data;
  },

  // إلغاء طلب
  cancelRequest: async (id: number, notes?: string) => {
    const response = await axiosInstance.put(`/marketer/requests/${id}/cancel`, { notes });
    return response.data;
  },
};
