'use client';

import { useAppSelector } from '@/store/hook';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Props = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const isAuthenticated = useAppSelector(state => state.authUser.isAuthenticated);
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/admin');
    } else {
      setChecked(true);
    }
  }, [isAuthenticated, router]);

  if (!checked) {
    return <div>Завантаження...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
