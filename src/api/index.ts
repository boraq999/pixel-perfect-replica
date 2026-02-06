import axiosInstance from './axiosInstance';

export const authApi = {
  login: (credentials: { username: string; password: string }) => 
    axiosInstance.post('/auth/login', credentials),
  getUser: () => axiosInstance.get('/auth/user'),
  logout: () => axiosInstance.post('/auth/logout'),
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

export { marketerRequestsAPI } from './marketerRequests';
export { productsAPI } from './products';
