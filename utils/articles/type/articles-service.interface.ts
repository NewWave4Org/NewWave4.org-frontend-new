import { ArticlesResponseDTO } from './interface';

interface IArticleService {
  getArticles: () => Promise<ArticlesResponseDTO>;
}

export { type IArticleService };
