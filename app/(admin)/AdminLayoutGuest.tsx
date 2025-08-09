'use client';

import AdminHeader from "@/components/layout/admin/adminHeader/AdminHeader";
import Logo from "@/components/layout/Logo";
import { ReactNode } from "react";

function AdminLayoutGuest({ children }: { children: ReactNode }) {

  return ( 
    <>
      <AdminHeader />
      <main className="flex-1">
        <div className="py-[35px] flex items-center justify-center h-full">
          <div className="container mx-auto px-4">
            <div className="max-w-[500px] mx-auto">
              <div className="mb-[52px] flex justify-center"><Logo /></div>
              <div className="p-[32px] bg-[#fff] rounded-[10px]">
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default AdminLayoutGuest