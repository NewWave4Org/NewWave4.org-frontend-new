'use client';

import ArticlePreview from '@/components/admin/CreateEditArticle/ArticlePreview';
import { useSearchParams } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

const PreviewArticlePage = ({ params }: PageProps) => {
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const articleId = idParam ? Number(idParam) : undefined;

  if (!articleId) return <div>Article not found</div>;

  return (
    <>
      <ArticlePreview articleId={articleId} />
    </>
  );
};

export default PreviewArticlePage;
