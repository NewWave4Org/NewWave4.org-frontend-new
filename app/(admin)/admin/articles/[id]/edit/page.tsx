import ArticleContent from '@/components/admin/CreateEditArticle/ArticleContent';
import ArticleForm from '@/components/admin/CreateEditArticle/ArticleForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

const EditArticlePage = async ({ params }: PageProps) => {
  const { id } = await params;
  const articleId = Number(id);

  if (!articleId) return <div>Article not found</div>;

  return (
    <>
      <h4 className="text-h4 mb-3">Edit article</h4>
      <ArticleForm articleId={articleId} />
      <h4 className="text-h4 mb-3 mt-3">Edit article content</h4>
      <ArticleContent articleId={articleId} />
    </>
  );
};

export default EditArticlePage;

export async function generateStaticParams() {
  const ids = Array.from({ length: 1000 }, (_, i) => i + 1);
  return ids.map(id => ({ id: String(id) }));
}
