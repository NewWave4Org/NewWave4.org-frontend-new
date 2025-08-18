import { IArticleApi } from './type/articles-api.interface';
import { IArticleService } from './type/articles-service.interface';
import { ArticlesResponseDTO } from './type/interface';

class ArticleService implements IArticleService {
  private articles: IArticleApi;

  constructor(articles: IArticleApi) {
    this.articles = articles;
  }

  async getArticles(params: { page?: number } = {}): Promise<ArticlesResponseDTO> {
    const { page = 0 } = params;
    return this.articles.getArticles({ page });
  }
}

export default ArticleService;
