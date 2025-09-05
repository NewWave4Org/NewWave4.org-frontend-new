import ArticlePreview from '@/components/admin/CreateEditArticle/ArticlePreview';

interface PageProps {
  params: Promise<{ id: string }>;
}

const PreviewArticlePage = async ({ params }: PageProps) => {
  const { id } = await params;
  const articleId = Number(id);

  if (!articleId) return <div>Article not found</div>;

  return (
    <>
      <ArticlePreview articleId={articleId} />
    </>
  );
};

export default PreviewArticlePage;

export async function generateStaticParams() {
  const ids = Array.from({ length: 1000 }, (_, i) => i + 1);
  return ids.map(id => ({ id: String(id) }));
}
