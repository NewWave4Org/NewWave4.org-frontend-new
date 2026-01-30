'use client';

import OpenEyeIcon from "@/components/icons/symbolic/OpenEyeIcon";
import Button from "@/components/shared/Button";
import Table from "@/components/ui/Table/Table";
import { numericDate } from "@/utils/date";
import { DonationStatus } from "@/utils/donation/type/interface";
import clsx from "clsx";
import { ReactNode } from "react";

interface IRenderPaginationProps {
  currentPage: number;
  totalPages: number;
  changePage: (page: number) => void;
}

interface IDonationPaymentsTable {
  renderPagination: (props: IRenderPaginationProps) => ReactNode;
  allDonations: any[];
  totalPages: number;
  currentPage: number;
  changePage: (page: number) => void;
  handleShowDetails: (donationInfo: any) => void;
}

const TableHeader = [
  { id: '1', title: 'Name', classBlock: '' },
  { id: '2', title: 'Email', classBlock: '' },
  { id: '3', title: 'Amount', classBlock: 'text-center' },
  { id: '4', title: 'Created at', classBlock: 'text-center' },
  { id: '5', title: 'Provider', classBlock: 'text-center' },
  { id: '6', title: 'Status', classBlock: 'text-center' },
  { id: '7', title: 'Details', classBlock: 'text-center' },
];

function DonationPaymentsTable({allDonations, currentPage, totalPages, changePage, renderPagination, handleShowDetails}: IDonationPaymentsTable) {
  return (
    <div className="relative w-full h-full">
      <div className="mb-5">
        <Table
          classNameRow="bg-admin-100"
          className="mb-5 last:mb-0"
          data={allDonations}
          renderHeader={() => (
            <>
              {TableHeader.map(({ id, title, classBlock }) => (
                <th key={id} className={`px-3 pb-4 border-b border-admin-300 ${classBlock}`}>
                  {title}
                </th>
              ))}
            </>
          )}
          renderRow={donation => {
            const { name, email, amount, createdAt, paymentProvider, paymentStatus } = donation;
            console.log('createdAt', createdAt);
            const status = paymentStatus.slice(0, 1).toUpperCase() + paymentStatus.toLowerCase().slice(1);
            return (
              <>
                <td className="min-w-[200px] max-w-[250px] pl-3 py-6">
                  <p className="title-row">{name}</p>
                </td>

                <td className="px-3 py-6">{email}</td>

                <td className="px-3 py-6">
                  <div className="flex items-center justify-center gap-[10px]">
                    <p className="font-bold text-[20px] text-admin-700 line-clamp-1">{amount} $</p>
                  </div>
                </td>

                <td className="px-3 py-6 text-center">{numericDate(createdAt)}</td>

                <td className="px-3 py-6 text-center">{paymentProvider}</td>

                <td className="px-3 py-6 text-center">
                  <span className={clsx('flex items-center justify-center w-[120px] px-3 py-1 rounded-full border-2 mx-auto', {
                    'border-status-success-500 text-status-success-500': paymentStatus === DonationStatus.SUCCESS,
                    'border-status-danger-500 text-status-danger-500': paymentStatus === DonationStatus.FAILED,
                    'border-status-grey-500 text-status-gray-500': paymentStatus === DonationStatus.PENDING,
                  })}>{status}</span>
                </td>

                <td className="pr-3 py-6">
                  <div className="flex gap-x-3 justify-end">
                    <Button
                      variant="tertiary"
                      className="!text-admin-700 !py-2 bg-white h-auto flex items-center font-bold shadow-md
                      active:bg-transparent active:!text-admin-700 hover:shadow-lg duration-500"
                      onClick={() => handleShowDetails(donation)}
                    >
                      <OpenEyeIcon />
                    </Button>
                  </div>
                </td>
              </>
            );
          }}
        ></Table>
      </div>

      {renderPagination && renderPagination({ currentPage, totalPages, changePage })}
    </div>
  );
}

export default DonationPaymentsTable;