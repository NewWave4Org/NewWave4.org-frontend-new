'use client';

import AdminHeader from "@/components/layout/admin/adminHeader/AdminHeader";
import AdminSidebar from "@/components/layout/admin/adminSidebar/AdminSidebar";
import { ReactNode } from "react";
import Modals from "@/components/admin/Modals/Modals";

function AdminLayoutAuthorized({ children }: { children: ReactNode }) { 

  return (
    <div className="flex flex-col h-full">
      <AdminHeader />
      <main className="flex-1">
        <div className='flex h-full bg-white'>
          <div className='container mx-auto flex'>
            <div className='admin-left bg-background-light  w-[300px]'>
              <AdminSidebar />
            </div>
            <div className='admin-right flex-1 py-[36px] pl-5'>
              <div className='container'>
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Modals />
    </div>
  );
}

export default AdminLayoutAuthorized;