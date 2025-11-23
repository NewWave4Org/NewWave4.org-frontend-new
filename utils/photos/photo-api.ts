import { GlobalSectionsType } from '@/components/admin/GlobalSections/enum/types';
import { ArticleType } from '../ArticleType';
import { ApiEndpoint } from '../http/enums/api-endpoint';
import HttpMethod from '../http/enums/http-method';
import { request } from '../http/http-request-service';
import { IPhotoApi } from './type/photo-api.interface';
import { PagesType } from '@/components/admin/Pages/enum/types';

class PhotoApi implements IPhotoApi {
  async uploadPhoto(params: { entityReferenceId: number; articleType: ArticleType | GlobalSectionsType | PagesType; file: File }): Promise<string> {
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
        baseURL: 'https://api.stage.newwave4.org/api/',
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
        baseURL: 'https://api.stage.newwave4.org/api/',
      },
    });
  }
}

export default PhotoApi;
