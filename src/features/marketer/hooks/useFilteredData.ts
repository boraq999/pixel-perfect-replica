import { useMemo } from 'react';

export const useFilteredData = <T extends Record<string, any>>(
  data: T[],
  searchQuery: string,
  searchKeys: (keyof T)[]
) => {
  return useMemo(() => {
    if (!searchQuery) return data;

    return data.filter((item) =>
      searchKeys.some((key) => {
        const value = item[key];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchQuery.toLowerCase());
        }
        if (typeof value === 'object' && value !== null) {
          return Object.values(value).some(
            (v) => typeof v === 'string' && v.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        return false;
      })
    );
  }, [data, searchQuery, searchKeys]);
};
