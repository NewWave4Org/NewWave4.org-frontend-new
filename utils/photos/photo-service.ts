import { ArticleType } from '../ArticleType';
import { IPhotoApi } from './type/photo-api.interface';

export interface UploadPhotoParams {
  entityReferenceId: number;
  articleType: ArticleType;
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
    return this.photos.deletePhoto(url);
  }
}

export default PhotoService;
