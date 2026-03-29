import Article from '@/components/news/Article';
import { ArticleTypeEnum } from '@/utils/ArticleType';

const NewsArticlePage = () => {
  return (
    <>
      <Article articleType={ArticleTypeEnum.NEWS} />
    </>
  );
};

export default NewsArticlePage;
