import { useState, useMemo } from 'react';
import { normalizeText } from '../utils/normalize';

export const useClientPagination = <T extends Record<string, any>>(
  initialItems: T[] = [],
  searchFields: (keyof T | string)[] = [],
  filtersFn: ((item: T, filters: Record<string, any>) => boolean) | null = null
) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const items = useMemo(() => (Array.isArray(initialItems) ? initialItems : []), [initialItems]);

  const setFilterVal = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setPage(1);
  };

  const filteredItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return items.filter((item) => {
      if (searchQuery.trim() !== '') {
        const queryNorm = normalizeText(searchQuery);
        const matchSearch = searchFields.some((field) => {
          const val = item[field as string];
          if (val === undefined || val === null) return false;
          return normalizeText(String(val)).includes(queryNorm);
        });
        if (!matchSearch) return false;
      }

      if (filtersFn) {
        return filtersFn(item, filters);
      }

      return true;
    });
  }, [items, searchQuery, searchFields, filters, filtersFn]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, page, pageSize]);

  return {
    searchQuery,
    setSearchQuery: handleSearchChange,
    filters,
    setFilters,
    setFilterVal,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalItems: filteredItems.length,
    filteredItems,
    paginatedItems,
  };
};

export default useClientPagination;
