'use client';

import AboutUsForm from '@/components/admin/Pages/AboutUsForm';
import { PagesType } from '@/components/admin/Pages/enum/types';
import HomeForm from '@/components/admin/Pages/HomeForm';
import ArrowLeft4Icon from '@/components/icons/navigation/ArrowLeft4Icon';
import Button from '@/components/shared/Button';
import { useParams, useRouter } from 'next/navigation';

function PageEdit() {
  const { page } = useParams();
  const router = useRouter();

  console.log('pages', page);

  return (
    <div>
      <Button onClick={() => router.back()} className="!py-2 pl-2 pr-4 !min-h-8 !h-auto flex text-white !bg-admin-700 hover:!bg-admin-600 duration-500 mb-10">
        <ArrowLeft4Icon color="white" />
        Back
      </Button>
      <h1 className="text-h4 mb-3">{String(page).replaceAll('_', ' ')} PAGE</h1>

      {page === PagesType.HOME && <HomeForm />}
      {page === PagesType.ABOUT_US && <AboutUsForm />}
    </div>
  );
}

export default PageEdit;
