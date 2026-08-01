import { GlobalSectionsType } from '@/components/admin/GlobalSections/enum/types';
import { ArticleType } from '../ArticleType';
import { ApiEndpoint } from '../http/enums/api-endpoint';
import HttpMethod from '../http/enums/http-method';
import { request } from '../http/http-request-service';
import { API_BASE_URL } from '../http/api-base-url';
import { IPhotoApi } from './type/photo-api.interface';
import { PagesType } from '@/components/admin/Pages/enum/types';

// The photo endpoints sit under `/api/`, not the `/api/v1/` the rest of the
// REST surface uses, so each call overrides axiosInstance's baseURL. Both are
// derived from NEXT_PUBLIC_NEWWAVE_API_URL; these three used to hardcode
// staging, so production uploads would have written to the staging bucket
// (issue #446).
class PhotoApi implements IPhotoApi {
  async uploadPhoto(params: {
    entityReferenceId: number;
    articleType: ArticleType | GlobalSectionsType | PagesType;
    file: File;
  }): Promise<string> {
    const formData = new FormData();
    formData.append('file', params.file);

    return request({
      method: HttpMethod.POST,
      url: ApiEndpoint.UPLOAD_PHOTO,
      body: formData,
      params: {
        entityReferenceId: params.entityReferenceId,
        articleType: params.articleType,
      },
      config: {
        headers: { 'Content-Type': 'multipart/form-data' },
        baseURL: API_BASE_URL,
      },
    });
  }

  async uploadPhotoWithOutAttach(params: { file: File }): Promise<string> {
    const formData = new FormData();
    formData.append('file', params.file);

    return request({
      method: HttpMethod.POST,
      url: ApiEndpoint.UPLOAD_PHOTO_WITHOUT_ATTACH,
      body: formData,
      config: {
        headers: { 'Content-Type': 'multipart/form-data' },
        baseURL: API_BASE_URL,
      },
    });
  }

  async deletePhoto(url: string) {
    return request({
      method: HttpMethod.DELETE,
      url: `${ApiEndpoint.DELETE_PHOTO}`,
      params: {
        url,
      },
      config: {
        baseURL: API_BASE_URL,
      },
    });
  }
}

export default PhotoApi;
