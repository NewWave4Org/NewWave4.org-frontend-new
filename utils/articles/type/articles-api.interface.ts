import { ArticlesResponseDTO } from './interface';

interface IArticleApi {
  getArticles: () => Promise<ArticlesResponseDTO>;
}

export { type IArticleApi };
