import React, { createContext, useContext, useState } from "react";

interface IPaymentDetails {
  description?: string;
}
interface IPaymentContext {
  isPaymentApproved: boolean;
  setIsPaymentApproved: (value: boolean) => void;
  isPaymentError: boolean;
  setIsPaymentError: (value: boolean) => void;
  amount: string;
  setAmount: (value: string) => void;
  loading: boolean;
  setLoading: (values: boolean) => void;
  paymentDetails: IPaymentDetails;
  setPaymentDetails: (values: IPaymentDetails) => void;
}

const initialValues: IPaymentContext = {
  isPaymentApproved: false,
  setIsPaymentApproved: (value: boolean) => null,
  isPaymentError: false,
  setIsPaymentError: (value: boolean) => null,
  amount: '',
  setAmount: (value: string) => null,
  loading: false,
  setLoading: (values: boolean) => null,
  paymentDetails: {},
  setPaymentDetails: (values: IPaymentDetails) => null
};

const PaymentContext = createContext(initialValues);

export const usePaymentContext = () => useContext(PaymentContext);

function PaymentContextAPI(props: React.PropsWithChildren<{}>) {
  const { children } = props;

  const [isPaymentApproved, setIsPaymentApproved] = useState<boolean>(false);
  const [isPaymentError, setIsPaymentError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>('');
  const [paymentDetails, setPaymentDetails] = useState<IPaymentDetails>({ description: "" });

  const values: IPaymentContext = {
    isPaymentApproved,
    setIsPaymentApproved,
    isPaymentError,
    setIsPaymentError,
    loading,
    setLoading,
    amount,
    setAmount,
    paymentDetails,
    setPaymentDetails
  }
  return (
    <PaymentContext.Provider value={values}>{children}</PaymentContext.Provider>
  )

}

export default PaymentContextAPI;