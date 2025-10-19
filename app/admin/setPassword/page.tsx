'use client';

import SetPasswordForm from '@/components/admin/UserActions/SetPasswordForm/SetPasswordForm';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SetPasswordWrapper() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

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
