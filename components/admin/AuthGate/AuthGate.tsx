'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { getUserInfo } from '@/store/auth/action';
import Loading from '@/components/admin/Loading/Loading';

const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAppSelector((state) => state.authUser.isAuthenticated);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const hasLoaded = useRef(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (hasLoaded.current) return;
      hasLoaded.current = true;

      const result = await dispatch(getUserInfo());

      if (getUserInfo.rejected.match(result)) {
        router.replace('/admin');
        return;
      }

      setLoading(false);
    };

    loadUser();
  }, [dispatch, router]);

  if (loading) return <Loading />;

  return <>{children}</>;
};

export default AuthGate;
