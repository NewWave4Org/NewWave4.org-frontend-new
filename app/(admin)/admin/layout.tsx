'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/store/hook';

import { useRouter } from 'next/navigation';
import { getUserInfo } from '@/store/auth/action';
import Loading from '@/components/admin/Loading/Loading';
import AdminLayoutAuthorized from '../AdminLayoutAuthorized';
import AdminLayoutGuest from '../AdminLayoutGuest';


export const AdminLayoutClient = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAppSelector((state) => state.authUser.isAuthenticated);

  if (isAuthenticated) {
    return <AdminLayoutAuthorized>{children}</AdminLayoutAuthorized>;
  } else {
    return <AdminLayoutGuest>{children}</AdminLayoutGuest>;
  }

};


export default AdminLayoutClient;
