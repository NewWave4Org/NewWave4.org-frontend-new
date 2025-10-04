'use client';

import { useAppSelector } from '@/store/hook';
import Loading from '@/components/admin/Loading/Loading';
import AdminLayoutAuthorized from '../AdminLayoutAuthorized';
import AdminLayoutGuest from '../AdminLayoutGuest';


export const AdminLayoutClient = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAppSelector((state) => state.authUser.isAuthenticated);
  const isUserChecked = useAppSelector((state) => state.authUser.isUserChecked);

  if (!isUserChecked) {
    return <Loading />;
  }

  if (isAuthenticated) {
    return <AdminLayoutAuthorized>{children}</AdminLayoutAuthorized>;
  } else {
    return <AdminLayoutGuest>{children}</AdminLayoutGuest>;
  }

};


export default AdminLayoutClient;
