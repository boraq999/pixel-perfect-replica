import axiosInstance from './axiosInstance';

export const authApi = {
  login: (credentials: any) => axiosInstance.post('/auth/login', credentials),
  getMe: () => axiosInstance.get('/auth/me'),
};

export const productsApi = {
  getAll: () => axiosInstance.get('/products'),
  getPromotions: () => axiosInstance.get('/product-promotions/active'),
};

export const salesApi = {
  createInvoice: (data: any) => axiosInstance.post('/sales-invoices', data),
  getInvoices: () => axiosInstance.get('/sales-invoices'),
};

export const stockApi = {
  getMarketerStock: () => axiosInstance.get('/marketer/stock'),
  getWarehouseStock: () => axiosInstance.get('/warehouse/stock'),
};
