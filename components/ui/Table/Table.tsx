import React from "react";
import { BaseTable} from "./interfaces";

const Table = <T, >({data, renderHeader, renderRow, className, classNameRow, emptyState = <div>No data evailable</div>}: BaseTable<T>) => {
  return (
    <table className={`table-auto w-full text-left border-separate border-spacing-y-[18px] ${className}`}>
      <thead>
        <tr>{renderHeader()}</tr>
      </thead>
      <tbody>
        {data.length > 0 
          ? (
            data.map((item, index) => (
              <tr key={index} className={classNameRow}>
                {renderRow(item, index)}
              </tr>
            ))
          )
          : (
            <tr className="h-[50px]">
              <td>{emptyState}</td>
            </tr>
          )
        }
      </tbody>
    </table>
  );
};

export default Table;