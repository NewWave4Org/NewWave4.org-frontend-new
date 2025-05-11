'use client';

import React, { ReactNode } from 'react';

import AdminHeader from '@/components/layout/admin/adminHeader/AdminHeader';
import AdminSidebar from '@/components/layout/admin/adminSidebar/AdminSidebar';
import Modals from '@/components/admin/Modals/Modals';


type AdminPanelProps = {
  children: ReactNode
}

const AdminPanel = ({children}: AdminPanelProps) => {
  
  return (
    <>
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

          {/* <main className="flex-1">
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
            
          </main> */}

          <Modals />
    </>
  );
};

export default AdminPanel;