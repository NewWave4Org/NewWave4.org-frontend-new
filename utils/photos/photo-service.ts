import { IPhotoApi } from './type/photo-api.interface';

export interface UploadPhotoParams {
    entityReferenceId: number;
    articleType: 'NEWS' | 'EVENT' | 'PROGRAM';
    file: File;
}

class PhotoService {
    private photos: IPhotoApi;

    constructor(photos: IPhotoApi) {
        this.photos = photos;
    }

    async uploadPhoto(params: UploadPhotoParams) {
        return this.photos.uploadPhoto(params);
    }

    async deletePhoto(url: string) {
        // return this.photos.deletePhoto(photoId);
    }
}

export default PhotoService;