import { ApiEndpoint } from '../http/enums/api-endpoint';
import HttpMethod from '../http/enums/http-method';
import { request } from '../http/http-request-service';
import { IArticleApi } from './type/articles-api.interface';
import { ArticlesResponseDTO } from './type/interface';

class ArticleApi implements IArticleApi {
  async getArticles(params: { page: number }): Promise<ArticlesResponseDTO> {
    return request({
      method: HttpMethod.GET,
      url: ApiEndpoint.ALL_ARTICLES,
      params: { page: params.page, size: 10 },
    });
  }
}

export default ArticleApi;
