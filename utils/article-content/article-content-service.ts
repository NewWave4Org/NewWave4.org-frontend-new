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

  async getArticleById({ id }: { id: number; }): Promise<GetArticleByIdResponseDTO> {
    return this.articleApi.getArticleById({ id });
  }

  async getAllArticle({ page = 0, size = 10, articleType, articleStatus, relevantProjectId, sortByStatus, sortByCreatedAtDescending, excludeArticleId }: IGetAllArticleRequestDTO): Promise<IGetAllArticleResponseDTO> {
    return this.articleApi.getAllArticle({ page, size, articleType, articleStatus, relevantProjectId, sortByStatus, sortByCreatedAtDescending, excludeArticleId });
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
