import { ArticleType } from '../ArticleType';
import { ApiEndpoint } from '../http/enums/api-endpoint';
import HttpMethod from '../http/enums/http-method';
import { request } from '../http/http-request-service';
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

class ArticleApi implements IArticleApi {
  async deleteArticle({ id, articleType }: { id: number; articleType: ArticleType }) {
    return request({
      method: HttpMethod.DELETE,
      url: ApiEndpoint.DELETE_ARTICLE_CONTENT(id),
      params: { articleType },
    });
  }

  async getArticleById({ id, articleType }: { id: number; articleType: ArticleType }): Promise<GetArticleByIdResponseDTO> {
    return request({
      method: HttpMethod.GET,
      url: ApiEndpoint.GET_ARTICLE_CONTENT_BY_ID(id),
      params: { articleType },
    });
  }

  async getAllArticle({ page = 0, size = 10, articleType, articleStatus, relevantProjectId }: IGetAllArticleRequestDTO): Promise<IGetAllArticleResponseDTO> {
    const params: Record<string, string | number> = {
      page,
      size,
      ...(articleType !== undefined && { articleType }),
      ...(articleStatus !== undefined && { articleStatus }),
      ...(relevantProjectId !== null && { relevantProjectId }),
    };

    return request({
      method: HttpMethod.GET,
      url: ApiEndpoint.GET_ARTICLE_CONTENT_ALL,
      params,
    });
  }

  async createNewArticle(data: CreateNewArticleRequestDTO): Promise<CreateNewArticleResponseDTO> {
    return request({
      method: HttpMethod.POST,
      url: ApiEndpoint.CREATE_ARTICLE_CONTENT,
      body: data,
    });
  }

  async publishArticle(id: number): Promise<UpdateArticleResponseDTO> {
    return request({
      method: HttpMethod.POST,
      url: ApiEndpoint.PUBLISH_ARTICLE_CONTENT(id),
    });
  }

  async updateArticle({ id, data }: UpdateArticleRequestDTO): Promise<UpdateArticleResponseDTO> {
    return request({
      method: HttpMethod.PUT,
      url: ApiEndpoint.UPDATE_ARTICLE_CONTENT(id),
      body: data,
    });
  }

  async archivedArticle({ id, articleType }: { id: number; articleType: ArticleType }) {
    return request({
      method: HttpMethod.POST,
      url: ApiEndpoint.ARCHIVE_ARTICLE(id),
      params: { articleType },
    });
  }
}

export default ArticleApi;
