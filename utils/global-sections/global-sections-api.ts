import { ApiEndpoint } from '../http/enums/api-endpoint';
import HttpMethod from '../http/enums/http-method';
import { request } from '../http/http-request-service';
import IGlobalSectionsAPI from './type/global-sections-api.interface';
import { IGlobalSectionRequestPutDTO, IGlobalSectionsRequestDTO } from './type/interfaces';

class GlobalSectionAPI implements IGlobalSectionsAPI {
  async createdGlobalSections(data: IGlobalSectionsRequestDTO) {
    return request({
      method: HttpMethod.POST,
      url: ApiEndpoint.CREATE_GLOBAL_SECTIONS,
      body: data,
    });
  }

  async getAllGlobalSections() {
    return request({
      method: HttpMethod.GET,
      url: ApiEndpoint.GET_ALL_GLOBAL_SECTIONS,
    });
  }

  async getGlobalSectionByKey(key: string) {
    return request({
      method: HttpMethod.GET,
      url: ApiEndpoint.GET_GLOBAL_SECTION_BY_KEY(key),
    });
  }

  async updateGlobalSection(id: number, data: IGlobalSectionRequestPutDTO) {
    return request({
      method: HttpMethod.PUT,
      url: ApiEndpoint.UPDATE_GLOBAL_SECTION(id),
      body: data,
    });
  }
}

export default GlobalSectionAPI;
