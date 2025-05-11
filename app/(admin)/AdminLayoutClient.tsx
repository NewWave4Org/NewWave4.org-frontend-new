'use client';

import { ReactNode } from 'react';
import ReduxProvider from './ReduxProvider';
import AdminPanel from './AdminPanel';

const AdminLayoutClient = ({ children }: { children: ReactNode }) => {
  return (
    <ReduxProvider>
      <AdminPanel>
        {children}
      </AdminPanel>
    </ReduxProvider>
  );
};

export default AdminLayoutClient;
