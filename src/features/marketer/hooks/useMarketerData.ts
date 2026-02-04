import { useEffect } from 'react';
import { useMarketerStore } from '@/store/marketerStore';

export const useMarketerData = (marketerId: string | undefined) => {
  const { requests, stock, fetchRequests, fetchStock, isLoading } = useMarketerStore();

  useEffect(() => {
    if (marketerId) {
      fetchRequests(marketerId);
      fetchStock(marketerId);
    }
  }, [marketerId, fetchRequests, fetchStock]);

  return {
    requests,
    stock,
    isLoading
  };
};
