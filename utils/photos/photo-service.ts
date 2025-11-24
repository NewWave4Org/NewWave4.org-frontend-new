import { GlobalSectionsType } from '@/components/admin/GlobalSections/enum/types';
import { ArticleType } from '../ArticleType';
import { IPhotoApi } from './type/photo-api.interface';
import { PagesType } from '@/components/admin/Pages/enum/types';

export interface UploadPhotoParams {
  entityReferenceId: number;
  articleType: ArticleType | GlobalSectionsType | PagesType;
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
