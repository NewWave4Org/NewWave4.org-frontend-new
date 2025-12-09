"use client";

import PaymentContextAPI from "@/stores/PaymentContextAPI";
import { Provider } from "react-redux";
import { store } from "@/store/store";

function DonationPageLayout({ children }: any) {
  return (
    <Provider store={store}>
      <PaymentContextAPI>{children}</PaymentContextAPI>
    </Provider>
  );
};

export default DonationPageLayout;