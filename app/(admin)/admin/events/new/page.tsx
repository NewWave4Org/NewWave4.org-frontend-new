'use client';

import ArticleForm from '@/components/admin/Articles/ArticleForm';
import { ArticleTypeEnum } from '@/utils/ArticleType';

const NewEventPage = () => {
  return (
    <>
      <h4 className="text-h4 mb-3">Create new event</h4>
      <ArticleForm articleType={ArticleTypeEnum.EVENT} />
    </>
  );
};

export default NewEventPage;
