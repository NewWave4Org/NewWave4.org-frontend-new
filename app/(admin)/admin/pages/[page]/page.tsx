'use client';

import AboutUsForm from '@/components/admin/Pages/AboutUsForm';
import { PagesType } from '@/components/admin/Pages/enum/types';
import HomeForm from '@/components/admin/Pages/HomeForm';
import { useParams } from 'next/navigation';

function PageEdit() {
  const { page } = useParams();

  console.log('pages', page);

  return (
    <div>
      <h1 className="text-h4 mb-3">{String(page).replaceAll('_', ' ')} PAGE</h1>

      {page === PagesType.HOME && <HomeForm />}
      {page === PagesType.ABOUT_US && <AboutUsForm />}
    </div>
  );
}

export default PageEdit;
