import { GlobalSectionsType } from '@/components/admin/GlobalSections/enum/types';
import { PagesType } from '@/components/admin/Pages/enum/types';
import { ArticleType } from '@/utils/ArticleType';

interface IPhotoApi {
  uploadPhoto: (params: { entityReferenceId: number; articleType: ArticleType | GlobalSectionsType | PagesType; file: File }) => Promise<string>;

  deletePhoto: (url: string) => Promise<void>;
}

export { type IPhotoApi };
