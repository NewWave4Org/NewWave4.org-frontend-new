'use client';

import ArticleContent from '@/components/admin/Articles/ArticleContent';
import { ArticleTypeEnum } from '@/utils/ArticleType';
import { useSearchParams } from 'next/navigation';

const NewArticleContentPage = () => {
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const id = idParam ? Number(idParam) : undefined;

  return (
    <>
      <h4 className="text-h4 mb-3">Create new article</h4>
      <ArticleContent articleId={id} articleType={ArticleTypeEnum.NEWS} />
    </>
  );
};

export default NewArticleContentPage;
