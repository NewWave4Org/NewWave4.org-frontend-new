import IArticleService from './type/article-content-service.interface';
import IArticleApi from './type/article-content-api.interface';
import {
  CreateNewArticleRequestDTO,
  CreateNewArticleResponseDTO,
  GetArticleByIdResponseDTO,
  IGetAllArticleRequestDTO,
  IGetAllArticleResponseDTO,
  UpdateArticleRequestDTO,
  UpdateArticleResponseDTO,
} from './type/interfaces';
import { ArticleType } from '../ArticleType';

class ArticleService implements IArticleService {
  private articleApi: IArticleApi;

  constructor(articleApi: IArticleApi) {
    this.articleApi = articleApi;
  }

  async deleteArticle({ id, articleType }: { id: number; articleType: ArticleType }) {
    return this.articleApi.deleteArticle({ id, articleType });
  }

  async getArticleById({ id, articleType }: { id: number; articleType: ArticleType }): Promise<GetArticleByIdResponseDTO> {
    return this.articleApi.getArticleById({ id, articleType });
  }

  async getAllArticle({ page = 0, size = 10, articleType, articleStatus, relevantProjectId }: IGetAllArticleRequestDTO): Promise<IGetAllArticleResponseDTO> {
    return this.articleApi.getAllArticle({ page, size, articleType, articleStatus, relevantProjectId });
  }

  async createNewArticle(data: CreateNewArticleRequestDTO): Promise<CreateNewArticleResponseDTO> {
    return this.articleApi.createNewArticle(data);
  }

  async publishArticle(id: number): Promise<UpdateArticleResponseDTO> {
    return this.articleApi.publishArticle(id);
  }

  async updateArticle({ id, data }: UpdateArticleRequestDTO): Promise<UpdateArticleResponseDTO> {
    return this.articleApi.updateArticle({ id, data });
  }

  async archivedArticle({ id, articleType }: { id: number; articleType: ArticleType }) {
    return this.articleApi.archivedArticle({ id, articleType });
  }
}

export default ArticleService;
