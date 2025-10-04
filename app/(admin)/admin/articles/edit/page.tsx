'use client';

import ArticleContent from '@/components/admin/Articles/ArticleContent';
import ArrowLeft4Icon from '@/components/icons/navigation/ArrowLeft4Icon';
import LinkBtn from '@/components/shared/LinkBtn';
import { useSearchParams } from 'next/navigation';

const EditArticlePage = () => {
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const articleId = idParam ? Number(idParam) : undefined;

  if (!articleId) return <div>Article not found</div>;

  return (
    <>
      <LinkBtn
        href="/admin/articles"
        className="!py-2 pl-2 pr-4 !min-h-8 text-white !bg-admin-700 hover:!bg-admin-600 duration-500 mb-10"
        targetLink="_self"
      >
        <ArrowLeft4Icon color="white" />
        Back to all articles
      </LinkBtn>
      <h4 className="text-h4 mb-3 mt-3">Edit article content</h4>
      <ArticleContent articleId={articleId} />
    </>
  );
};

export default EditArticlePage;
