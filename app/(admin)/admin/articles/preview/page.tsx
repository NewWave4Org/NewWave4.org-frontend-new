'use client';

import ArticlePreview from '@/components/admin/CreateEditArticle/ArticlePreview';
import ArrowLeft4Icon from '@/components/icons/navigation/ArrowLeft4Icon';
import Button from '@/components/shared/Button';
import { useSearchParams, useRouter } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

const PreviewArticlePage = ({ params }: PageProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idParam = searchParams.get('id');
  const articleId = idParam ? Number(idParam) : undefined;

  if (!articleId) return <div>Article not found</div>;

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(`/admin/articles/${articleId}/edit`);
    }
  };

  return (
    <>
      <Button
        size="medium"
        className="ml-4 mb-4 !bg-background-darkBlue text-white !rounded-[5px] font-normal p-4 hover:opacity-[0.8] duration-500"
        onClick={handleBack}
      >
        <div className="flex gap-x-2">
          <ArrowLeft4Icon color="#fff" />
          Back to Edit
        </div>
      </Button>
      <ArticlePreview articleId={articleId} />
    </>
  );
};

export default PreviewArticlePage;
