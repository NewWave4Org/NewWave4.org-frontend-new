"use client";

import DonationPaymentsTable from "@/components/admin/DonationPaymentsPage/DonationPaymentsTable";
import DatePicker, { IPickerValue } from "@/components/admin/helperComponents/DatePicker/DatePicker";
import { convertToISO } from "@/components/admin/helperComponents/DatePicker/utils/convertToISO";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import Pagination from "@/components/shared/Pagination";
import ModalType from "@/components/ui/Modal/enums/modals-type";
import { getAllDonations } from "@/store/donations/action";
import { useAppDispatch } from "@/store/hook";
import { openModal } from "@/store/modal/ModalSlice";
import { DonationProvider, DonationProviderType, DonationStatus, DonationStatusType, IDonationRequestDTO } from "@/utils/donation/type/interface";
import React, { useCallback, useEffect, useState } from "react";
import SelectLocal from "../../../../components/shared/SelectLocale";

interface RenderPaginationProps {
  currentPage: number;
  totalPages: number;
  changePage: (page: number) => void;
}

const statusTypes = [
  { value: 'all', label: 'All' },
  { value: DonationStatus.PENDING, label: DonationStatus.PENDING },
  { value: DonationStatus.SUCCESS, label: DonationStatus.SUCCESS },
  { value: DonationStatus.FAILED, label: DonationStatus.FAILED },
];

const providerTypes = [
  { value: 'all', label: 'All' },
  { value: DonationProvider.PAYPAL, label: DonationProvider.PAYPAL },
  { value: DonationProvider.STRIPE, label: DonationProvider.STRIPE },
];

function DonationPayments() {
  const dispatch = useAppDispatch();

  const [allDonations, setAllDonations] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [chooseStatusType, setChooseStatusType] = useState<string | number>(statusTypes[0].value);
  const [chooseProviderType, setChooseProviderType] = useState<string | number>(providerTypes[0].value);
  const [dateFilter, setDateFilter] = useState<IPickerValue | null>({});
  const [emailSearch, setEmailSearch] = useState('');
  const [transactionIdSearch, setЕransactionIdSearch] = useState('');
  const [resetDatePicker, setResetDatePicker] = useState(false);

  async function fetchAllDonation(page = currentPage) {
    const params: IDonationRequestDTO = {
      page,
      size: 10,
    };

    try {
      const result = await dispatch(getAllDonations(params)).unwrap();
      setAllDonations(result?.content);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Error loading all donation payments:', error);
      setTotalPages(0);
    }
  }

   useEffect(() => {
    fetchAllDonation(currentPage);
  }, [dispatch, currentPage]);

  const changePage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const renderPagination = useCallback(({ currentPage, totalPages, changePage }: RenderPaginationProps) => 
  <Pagination currentPage={currentPage} totalPages={totalPages} changePage={changePage} />, []);

  function handleShowDetails(donatInfo: any) {
    dispatch(openModal({
      modalType: ModalType.DONATION_DEATILS,
      payload: donatInfo
    }));
  }

  function handleEmailSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setEmailSearch(e.target.value);
  }

  function handleTransactionIdSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setЕransactionIdSearch(e.target.value);
    setCurrentPage(0);
  }

  async function handleDonationSearch() {
    const params: IDonationRequestDTO = {
      page: currentPage,
      size: 10,
    };

    if (dateFilter && dateFilter.from && dateFilter.to) {
      params.dateFrom = convertToISO(dateFilter.from);
      params.dateTo = convertToISO(dateFilter.to);
    }

    if (chooseStatusType !== 'all') {
      params.status = chooseStatusType as DonationStatusType;
    }

    if (chooseProviderType !== 'all') {
      params.provider = chooseProviderType as DonationProviderType;
    }

    if(emailSearch !== '') {
      params.userEmail = emailSearch;
    }

    if(transactionIdSearch !== '') {
      params.transactionId = transactionIdSearch;
    }

    try {
      const result = await dispatch(getAllDonations(params)).unwrap();

      setAllDonations(result?.content);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Error loading all donaiotn payments:', error);
      setTotalPages(0);
    }
  }

  function handleCleanAllFields() {
    setChooseStatusType(statusTypes[0].value);
    setChooseProviderType(providerTypes[0].value);
    setResetDatePicker(true);
    setDateFilter({ from: null, to: null });
    setEmailSearch('');
    setЕransactionIdSearch('');
    setCurrentPage(0);

    fetchAllDonation(0);
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="mb-5">
            <span className="font-semibold mr-2">Show by status:</span>
            <SelectLocal options={statusTypes} name="statusTypes" value={chooseStatusType}  
            onChange={(val) => {
              setChooseStatusType(val);
            }} dropDownClass="absolute" parentClassname="!h-[50px] py-3" />
          </div>
          <div className="mb-5">
            <span className="font-semibold mr-2">Show by provider:</span>
            <SelectLocal options={providerTypes} name="providerTypes" value={chooseProviderType} 
            onChange={(val) => setChooseProviderType(val)} dropDownClass="absolute" parentClassname="py-3 !h-[50px]" />
          </div>

          <div className="mb-5 min-w-lg min-w-xs max-w-xs flex-1">
            <span className="font-semibold mr-2">Show by date:</span>
            {!resetDatePicker ? (
              <DatePicker
                name="dateFilter"
                pickerId="project-creationDate"
                pickerWithTime={false}
                pickerType="range"
                pickerPlaceholder="Choose date"
                pickerValue={dateFilter}
                onChange={(val) => {
                  setDateFilter(val);
                  setCurrentPage(0);
                }}
              />
            ) : (
              <DatePicker
                key="reset"
                name="dateFilter"
                pickerId="project-creationDate"
                pickerWithTime={false}
                pickerType="range"
                pickerPlaceholder="Choose date"
                pickerValue={dateFilter}
                onChange={(val) => {
                  setDateFilter(val);
                  setCurrentPage(0);
                  setResetDatePicker(false);
                }}
              />
            )}
          </div>
        </div>

        <div className="flex flex-wrap -mx-2">
          <div className="mb-5 w-1/2 px-2">
            <Input 
              onChange={handleEmailSearch}
              id="title"
              name="title"
              type="text"
              className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
              value={emailSearch}
              label="Search by email"
              labelClass="!text-admin-700"
            />
          </div>
          <div className="mb-5 w-1/2 px-2">
            <Input 
              onChange={handleTransactionIdSearch}
              id="title"
              name="title"
              type="text"
              className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
              value={transactionIdSearch}
              label="Search by transaction Id (Payment Intent Id)"
              labelClass="!text-admin-700"
            />
          </div>
        </div>

        <div className="flex gap-6">
          <Button type="button" onClick={() => handleDonationSearch()}>
            Search
          </Button>
          <Button type="button" className="bg-status-danger-500" onClick={() => handleCleanAllFields()}>
            Clean all fields
          </Button>
        </div>

      </div>


      
      <DonationPaymentsTable 
        allDonations={allDonations}
        currentPage={currentPage}
        totalPages={totalPages}
        changePage={changePage}
        renderPagination={renderPagination}
        handleShowDetails={handleShowDetails}
      />
    </>
  );
}

export default DonationPayments;