import { IArticleApi } from './type/articles-api.interface';
import { IArticleService } from './type/articles-service.interface';
import { Article, ArticleResponseDTO, ArticlesResponseDTO, ContentBlock, ContentBlockArrayRequestDTO, ContentBlockRequestDTO, NewArticleRequestDTO, PublishArticleRequestDTO } from './type/interface';

class ArticleService implements IArticleService {
  private articles: IArticleApi;

  constructor(articles: IArticleApi) {
    this.articles = articles;
  }

  async getArticles(params: { page?: number } = {}): Promise<ArticlesResponseDTO> {
    const { page = 0 } = params;
    return this.articles.getArticles({ page });
  }

  async getArticleById(params: { id: number }): Promise<Article> {
    const { id } = params;
    return this.articles.getArticleById({ id });
  }

  async getArticleFullById(id: number): Promise<ArticleResponseDTO> {
    return this.articles.getArticleFullById(id);
  }

  async createNewArticle(data: NewArticleRequestDTO): Promise<ArticleResponseDTO> {
    return this.articles.createNewArticle(data);
  }

  async updateArticle(id: number, data: NewArticleRequestDTO) {
    return this.articles.updateArticle(id, data);
  }

  async createContentBlock(id: number, data: ContentBlockRequestDTO) {
    return this.articles.createContentBlock(id, data);
  }

  async updateContentBlock(id: number, data: ContentBlockRequestDTO) {
    return this.articles.updateContentBlock(id, data);
  }

  async deleteContentBlock(id: number) {
    return this.articles.deleteContentBlock(id);
  }

  async createContentBlockArray(id: number, data: ContentBlockArrayRequestDTO) {
    return this.articles.createContentBlockArray(id, data);
  }

  async updateContentBlockArray(id: number, data: ContentBlockArrayRequestDTO) {
    return this.articles.updateContentBlockArray(id, data);
  }

  async publishArticle(id: number, data: PublishArticleRequestDTO) {
    return this.articles.publishArticle(id, data);
  }

  async deleteArticle(id: number) {
    return this.articles.deleteArticle(id);
  }

}

export default ArticleService;
