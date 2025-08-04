'use client';

import { ReactNode, useEffect, useState } from 'react';
import ReduxProvider from './ReduxProvider';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import AdminLayoutAuthorized from './AdminLayoutAuthorized';
import AdminLayoutGuest from './AdminLayoutGuest';
import { useRouter } from 'next/navigation';
import { getUserInfo } from '@/store/auth/action';
import Loading from '@/components/admin/Loading/Loading';

const AdminLayoutClient = ({ children }: { children: ReactNode }) => {
  return (
    <ReduxProvider>
      <AuthGate>{children}</AuthGate>
    </ReduxProvider>
  );
};

const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.authUser.isAuthenticated);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const result = await dispatch(getUserInfo());

      setLoading(false);

      if (getUserInfo.rejected.match(result)) {
        router.replace('/admin');
      }
    };

    loadUser();
  }, [dispatch, router]);

  if (loading) return <Loading />;

  return isAuthenticated
    ? <AdminLayoutAuthorized>{children}</AdminLayoutAuthorized>
    : <AdminLayoutGuest>{children}</AdminLayoutGuest>;
};

export default AdminLayoutClient;
