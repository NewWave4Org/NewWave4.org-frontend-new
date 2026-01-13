'use client';

import SetPasswordForm from '@/components/admin/UserActions/SetPasswordForm/SetPasswordForm';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

function SetPasswordWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      router.replace('/admin');
    }
  }, [token, router]);

  if (!token) {
    return null;
  }

  return <SetPasswordForm token={token} />;
}

function SetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SetPasswordWrapper />
    </Suspense>
  );
}

export default SetPasswordPage;
