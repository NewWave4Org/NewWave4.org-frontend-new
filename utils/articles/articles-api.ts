import { ApiEndpoint } from '../http/enums/api-endpoint';
import HttpMethod from '../http/enums/http-method';
import { request } from '../http/http-request-service';
import { IArticleApi } from './type/articles-api.interface';
import { ArticlesResponseDTO, ContentBlock, ContentBlockRequestDTO, NewArticleRequestDTO } from './type/interface';

class ArticleApi implements IArticleApi {

  async getArticleById(params: { id: number; }) {
    return request({
      method: HttpMethod.GET,
      url: ApiEndpoint.GET_ARTICLE(params.id),
      params: { id: params.id },
    });
  }

  async getArticleFullById(id: number) {
    return request({
      method: HttpMethod.GET,
      url: ApiEndpoint.GET_FULL_ARTICLE(id),
      params: { id },
    });
  }

  async getArticles(params: { page: number }): Promise<ArticlesResponseDTO> {
    return request({
      method: HttpMethod.GET,
      url: ApiEndpoint.ALL_ARTICLES,
      params: { page: params.page, size: 10 },
    });
  }

  async createNewArticle(data: NewArticleRequestDTO) {
    return request({
      method: HttpMethod.POST,
      url: ApiEndpoint.ADD_ARTICLE,
      body: data,
    });
  }

  async updateArticle(id: number, data: NewArticleRequestDTO) {
    return request({
      method: HttpMethod.PUT,
      url: ApiEndpoint.UPDATE_ARTICLE(id),
      body: data,
    });
  }

  async createContentBlock(articleId: number, data: ContentBlockRequestDTO) {
    return request({
      method: HttpMethod.POST,
      url: ApiEndpoint.ADD_NEWS_CONTENT_BLOCK(articleId),
      body: data,
    });
  }

  async updateContentBlock(id: number, data: ContentBlockRequestDTO) {
    return request({
      method: HttpMethod.PUT,
      url: ApiEndpoint.UPDATE_NEWS_CONTENT_BLOCK(id),
      body: data,
    });
  }

  async deleteContentBlock(id: number) {
    return request({
      method: HttpMethod.DELETE,
      url: ApiEndpoint.DELETE_CONTENT_BLOCK(id),
      params: { id },
    });
  }
}

export default ArticleApi;
