export interface BaseTable<T> {
  data: T[];
  renderHeader: () => React.ReactNode;
  renderRow: (item: T, index: number) => React.ReactNode;
  className?: string;
  classNameRow?: string;
  emptyState?: React.ReactNode;
}
