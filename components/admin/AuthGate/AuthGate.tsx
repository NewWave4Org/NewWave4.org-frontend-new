'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hook';
import { getUserInfo } from '@/store/auth/action';
import Loading from '@/components/admin/Loading/Loading';
import { ROLES } from '@/data/admin/roles/Roles';
import { getRedirectPathByRole } from '@/utils/getRedirectPathByRole';

const AuthGate = ({ children }: { children: React.ReactNode }) => {
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

      // const userRole = result.payload?.roles || [];

      // const redirectPath = getRedirectPathByRole(userRole);
      // router.replace(redirectPath);
    };

    loadUser();
  }, []);

  if (loading) return <Loading />;

  return <>{children}</>;
};

export default AuthGate;
