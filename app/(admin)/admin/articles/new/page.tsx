'use client';

import ArticleForm from '@/components/admin/Articles/ArticleForm';
import { ArticleTypeEnum } from '@/utils/ArticleType';

const NewArticlePage = () => {
  return (
    <>
      <h4 className="text-h4 mb-3">Create new article</h4>
      <ArticleForm articleType={ArticleTypeEnum.NEWS} />
    </>
  );
};

export default NewArticlePage;
