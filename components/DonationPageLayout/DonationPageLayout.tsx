"use client";

import PaymentContextAPI from "@/stores/PaymentContextAPI";

function DonationPageLayout({ children }: any) {
  return (
    <PaymentContextAPI>{children}</PaymentContextAPI>
  );
};

export default DonationPageLayout;