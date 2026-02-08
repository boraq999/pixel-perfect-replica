import { useEffect } from 'react';
import { useMarketerStore } from '@/store/marketerStore';

export const useMarketerData = (marketerId: string | undefined) => {
  const { requests, stock, reservedStock, invoices, fetchRequests, fetchStock, fetchSalesInvoices, isLoading } = useMarketerStore();

  useEffect(() => {
    if (marketerId) {
      fetchRequests(marketerId);
      fetchStock(marketerId);
      fetchSalesInvoices();
    }
  }, [marketerId, fetchRequests, fetchStock, fetchSalesInvoices]);

  return {
    requests,
    stock,
    reservedStock,
    invoices,
    isLoading
  };
};
