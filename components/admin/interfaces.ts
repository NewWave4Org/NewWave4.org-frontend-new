export interface BaseTable {
  id: string;
  title: string;
}
export interface BaseTableHeader extends BaseTable {
  type?: string;
  icon?: React.ReactNode;
}
export interface BaseTableBody extends BaseTable {
  role: string;
  type?: string;
}
