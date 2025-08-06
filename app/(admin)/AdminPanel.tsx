'use client';

import React, { ReactNode } from 'react';
import { useAppSelector } from '@/store/hook';
import AdminLayoutAuthorized from './AdminLayoutAuthorized';
import AdminLayoutGuest from './AdminLayoutGuest';


type AdminPanelProps = {
  children: ReactNode
}

const AdminPanel = ({children}: AdminPanelProps) => {
  const isAuthenticated = useAppSelector(state => state.authUser.isAuthenticated);

  const Layout = isAuthenticated ? AdminLayoutAuthorized : AdminLayoutGuest;
  
  return (
    <>
      <AdminLayoutAuthorized>{children}</AdminLayoutAuthorized>
    </>
  );
};

export default AdminPanel;