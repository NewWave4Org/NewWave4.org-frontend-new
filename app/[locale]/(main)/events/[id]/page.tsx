import Article from '@/components/news/Article';
import { ArticleTypeEnum } from '@/utils/ArticleType';

const EventArticlePage = () => {
  return (
    <>
      <Article articleType={ArticleTypeEnum.EVENT}  />
    </>
  );
};

export default EventArticlePage;
