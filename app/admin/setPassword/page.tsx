'use client';

import SetPasswordForm from '@/components/admin/SetPasswordForm/SetPasswordForm';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SetPasswordForm token={token} />;
    </Suspense>
  );
}

export default SetPasswordPage;
