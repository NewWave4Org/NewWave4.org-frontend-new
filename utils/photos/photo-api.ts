import { ApiEndpoint } from '../http/enums/api-endpoint';
import HttpMethod from '../http/enums/http-method';
import { request } from '../http/http-request-service';
import { IPhotoApi } from './type/photo-api.interface';

class PhotoApi implements IPhotoApi {
    async uploadPhoto(params: {
        entityReferenceId: number;
        articleType: 'NEWS' | 'EVENT' | 'PROGRAM';
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
                baseURL: 'https://api.stage.newwave4.org/api/',
            },
        });
    }

    async deletePhoto(url: string) {
        // return request({
        //     method: HttpMethod.DELETE,
        //     url: `${ApiEndpoint.DELETE_PHOTO}/${photoId}`,
        // });
    }
}

export default PhotoApi;
