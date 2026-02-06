import axiosInstance from './axiosInstance';

export interface Product {
  id: number;
  name: string;
  current_price: number;
  description?: string;
  barcode?: string;
  is_active: boolean;
  main_stock_quantity: number;
}

export const productsAPI = {
  getProducts: async (page = 1) => {
    const response = await axiosInstance.get('/products', { params: { page } });
    return response.data;
  },
};
