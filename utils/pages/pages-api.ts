import { ApiEndpoint } from '../http/enums/api-endpoint';
import HttpMethod from '../http/enums/http-method';
import { request } from '../http/http-request-service';
import { IPagesRequestDTO } from './types/interfaces';
import IPagesAPI from './types/pages-api.interface';

class PagesAPI implements IPagesAPI {
  async createdPages(data: IPagesRequestDTO) {
    return request({
      method: HttpMethod.POST,
      url: ApiEndpoint.CREATE_PAGES,
      body: data,
    });
  }

  async getPages(pageType: string) {
    return request({
      method: HttpMethod.GET,
      url: ApiEndpoint.GET_PAGES(pageType),
    });
  }

  async updatePages(id: number, data: IPagesRequestDTO) {
    return request({
      method: HttpMethod.PUT,
      url: ApiEndpoint.UPDATE_PAGES(id),
      body: data,
    });
  }
}

export default PagesAPI;
