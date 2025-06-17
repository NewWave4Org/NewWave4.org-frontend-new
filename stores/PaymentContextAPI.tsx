import { createContext, useContext, useState } from "react";

interface IPaymentContext {
  isPaymentApproved: boolean;
  setIsPaymentApproved: (value: any) => void;
  isPaymentError: boolean;
  setIsPaymentError: (value: any) => void;
  amount: string;
  setAmount: (value: any) => void;
  loading: boolean;
  setLoading: (values: any) => void;
}

const initialValues: IPaymentContext = {
  isPaymentApproved: false,
  setIsPaymentApproved: (value: any) => null,
  isPaymentError: false,
  setIsPaymentError: (value: any) => null,
  amount: '',
  setAmount: (value: any) => null,
  loading: false,
  setLoading: (values: any) => null
};

const PaymentContext = createContext(initialValues);

export const usePaymentContext = () => useContext(PaymentContext);

function PaymentContextAPI(props: any) {
  const { children } = props;

  const [isPaymentApproved, setIsPaymentApproved] = useState<boolean>(false);
  const [isPaymentError, setIsPaymentError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>('');

  const values: IPaymentContext = {
    isPaymentApproved,
    setIsPaymentApproved,
    isPaymentError,
    setIsPaymentError,
    loading,
    setLoading,
    amount,
    setAmount
  }
  return (
    <PaymentContext.Provider value={values}>{children}</PaymentContext.Provider>
  )

}

export default PaymentContextAPI;