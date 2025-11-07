import { useCallback, useMemo, useState } from 'react';

type SortVal = 'asc' | 'desc';

interface ISortProps<T> {
  data: T[];
  initialSortField?: keyof T;
  initialSortOrder?: SortVal;
}

function useSortTable<T>({ data, initialSortField, initialSortOrder = 'asc' }: ISortProps<T>) {
  const [sortField, setSortField] = useState(initialSortField);
  const [sortVal, setSortVal] = useState(initialSortOrder);

  const sortedData = useMemo(() => {
    if (!sortField) return [...data];

    return [...data].sort((a, b) => {
      const aVal = a[sortField] ?? '';
      const bVal = b[sortField] ?? '';

      if (sortField === 'articleStatus' && typeof aVal === 'string' && typeof bVal === 'string') {
        const order = ['PUBLISHED', 'DRAFT'];
        return sortVal === 'asc' ? order.indexOf(aVal) - order.indexOf(bVal) : order.indexOf(bVal) - order.indexOf(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortVal === 'asc' ? aVal - bVal : bVal - aVal;
      }

      if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
        return sortVal === 'asc' ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortVal === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      return 0;
    });
  }, [data, sortVal, sortField]);

  const handleSort = useCallback(
    (field: keyof T) => {
      if (field === sortField) {
        setSortVal(prev => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortField(field);
        setSortVal('asc');
      }
    },
    [sortField],
  );

  return { sortVal, handleSort, sortedData, sortField };
}

export default useSortTable;
