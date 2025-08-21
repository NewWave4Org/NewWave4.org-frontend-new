'use client';

import AdminHeader from '@/components/layout/admin/adminHeader/AdminHeader';
import AdminSidebar from '@/components/layout/admin/adminSidebar/AdminSidebar';
import { ReactNode } from 'react';
import Modals from '@/components/admin/Modals/Modals';

function AdminLayoutAuthorized({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-full">
      <AdminHeader />
      <main className="flex flex-col flex-1 h-full overflow-auto">
        <div className="flex flex-grow bg-white">
          <div className="container mx-auto flex">
            <div className="admin-left bg-background-light  max-w-[30%]">
              <AdminSidebar />
            </div>
            <div className="admin-right flex-1 py-[36px] pl-5">
              <div className="container">{children}</div>
            </div>
          </div>
        </div>
      </main>
      <Modals />
    </div>
  );
}

export default AdminLayoutAuthorized;
