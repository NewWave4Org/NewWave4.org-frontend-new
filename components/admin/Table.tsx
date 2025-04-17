import React from "react";
import TableBody from "./TableBody";
import TableHeader from "./TableHeader";
import { BaseTableBody, BaseTableHeader } from "./interfaces";

const Table = ({tableHeader, tableBody}: {tableHeader: BaseTableHeader[], tableBody: BaseTableBody[]}) => {
  return (
    <table className="table-auto w-full text-left border-separate border-spacing-y-[18px]">
      <TableHeader tableHeader={tableHeader} />
      <TableBody tableBody={tableBody} />
    </table>
  );
};

export default Table;