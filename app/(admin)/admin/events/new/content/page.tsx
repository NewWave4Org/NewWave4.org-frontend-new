'use client';

import ArticleContent from '@/components/admin/Articles/ArticleContent';
import { ArticleTypeEnum } from '@/utils/ArticleType';
import { useSearchParams } from 'next/navigation';

const NewEventContentPage = () => {
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const id = idParam ? Number(idParam) : undefined;

  return (
    <>
      <h4 className="text-h4 mb-3">Create new event</h4>
      <ArticleContent articleId={id} articleType={ArticleTypeEnum.EVENT} />
    </>
  );
};

export default NewEventContentPage;
