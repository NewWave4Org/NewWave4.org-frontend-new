import React from 'react';
import { BaseTable } from './interfaces';

const Table = <T,>({
  data,
  renderHeader,
  renderRow,
  className,
  classNameRow,
  emptyState = <div>No data available</div>,
}: BaseTable<T>) => {
  return (
    <div className="overflow-x-auto">
      <table
        className={`table-auto min-w-full divide-y divide-gray-200 text-left border-separate border-spacing-y-[18px] ${className}`}
      >
        <thead>
          <tr>{renderHeader()}</tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index} className={classNameRow}>
                {renderRow(item, index)}
              </tr>
            ))
          ) : (
            <tr className="h-[50px]">
              <td colSpan={100}>{emptyState}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
