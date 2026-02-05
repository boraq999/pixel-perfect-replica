import { useEffect } from 'react';
import { useKeeperStore } from '@/store/keeperStore';

export const useKeeperData = () => {
    const store = useKeeperStore();

    useEffect(() => {
        // Only fetch if data looks stale or empty, or simply on mount
        store.fetchInitialData();
    }, []);

    const lowStockCount = store.warehouseStock.filter(s => s.quantity <= s.min_limit).length;

    return {
        ...store,
        lowStockCount,
        // Add any derived state here
    };
};
