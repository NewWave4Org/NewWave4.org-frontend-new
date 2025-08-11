import { ArticlesResponseDTO } from './interface';

interface IArticleApi {
  getArticles: (params: { page: number }) => Promise<ArticlesResponseDTO>;
}

export { type IArticleApi };
