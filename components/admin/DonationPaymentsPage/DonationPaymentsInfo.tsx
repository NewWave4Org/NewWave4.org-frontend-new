'use client';

import { useAppSelector } from "@/store/hook";
import { numericDate } from "@/utils/date";
import { DonationStatus, IDonation } from "@/utils/donation/type/interface";
import clsx from "clsx";


function DonationPaymentsInfo() {
  const donation = useAppSelector(state => state.modal.payload) as IDonation;

  return (
    <div>
      <div className="flex items-center text-lg">
        <span className="block mr-2 font-bold mb-1">Name:</span>
        {donation?.name}
      </div>
      <div className="flex">
        <span className="block mr-2 font-bold mb-1">Email:</span>
        {donation?.email}
      </div>
      <div className="flex">
        <span className="block mr-2 font-bold mb-1">Purpose:</span>
        {donation?.purpose}
      </div>
      <div className="flex">
        <span className="block mr-2 font-bold mb-1">Comment:</span>
        {donation?.comment}
      </div>
      <div className="flex">
        <span className="block mr-2 font-bold mb-1">Amount:</span>
        {donation?.amount} $
      </div>
      <div className="flex">
        <span className="block mr-2 font-bold mb-1">Provider:</span>
        {donation?.paymentProvider}
      </div>
      <div className="flex">
        <span className="block mr-2 font-bold mb-1">Status:</span>
        <span className={clsx('font-bold',{
            'border-status-success-500 text-status-success-500': donation?.paymentStatus === DonationStatus.SUCCESS,
            'border-status-danger-500 text-status-danger-500': donation?.paymentStatus === DonationStatus.FAILED,
            'border-status-grey-500 text-status-gray-500': donation?.paymentStatus === DonationStatus.PENDING,
          })}>{donation?.paymentStatus}</span>
      </div>
      <div className="flex">
        <span className="block mr-2 font-bold mb-1">Payment Intent Id:</span>
        {donation?.paymentIntentId}
      </div>
      <div className="flex">
        <span className="block mr-2 font-bold mb-1">Created at:</span>
        {numericDate(donation?.createdAt)}
      </div>
      <div className="flex">
        <span className="block mr-2 font-bold mb-1">Reference Id:</span>
        {donation?.referenceId}
      </div>
      
    </div>
  );
}

export default DonationPaymentsInfo;