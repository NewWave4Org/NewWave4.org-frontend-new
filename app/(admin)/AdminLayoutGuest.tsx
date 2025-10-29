'use client';

import AdminHeader from '@/components/layout/admin/adminHeader/AdminHeader';
import { ReactNode } from 'react';

function AdminLayoutGuest({ children }: { children: ReactNode }) {
  return (
    <>
      <AdminHeader />
      <main className="flex-1">
        <div className="py-9 flex items-center justify-center h-full">
          <div className="container mx-auto px-4">
            <div className="max-w-[500px] mx-auto mt-[120px]">
              <div className="p-8 bg-white rounded-[10px]">{children}</div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default AdminLayoutGuest;
