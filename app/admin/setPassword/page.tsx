'use client';

import SetPasswordForm from '@/components/admin/SetPasswordForm/SetPasswordForm';
import { useSearchParams } from 'next/navigation';

function SetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  return <SetPasswordForm token={token} />;
}

export default SetPasswordPage;
