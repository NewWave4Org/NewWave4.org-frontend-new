import { GlobalSectionsType } from '@/components/admin/GlobalSections/enum/types';
import { PagesType } from '@/components/admin/Pages/enum/types';
import { useAppDispatch } from '@/store/hook';
import { deletePhoto, uploadPhoto, uploadPhotoWithOutAttach } from '@/store/photos/action';
import { ArticleType } from '@/utils/ArticleType';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

interface IImageLoadingProps {
  articleId?: number;
  contentType?: ArticleType | GlobalSectionsType | PagesType;
  isAttach?: boolean;
}

function useImageLoading({ articleId, contentType, isAttach = false }: IImageLoadingProps) {
  const dispatch = useAppDispatch();

  const uploadFiles = useCallback(
    async (files: File[]): Promise<string[]> => {
      const urls: string[] = [];

      for (const file of files) {
        try {
          let response: string;

          if (isAttach) {
            response = await dispatch(uploadPhotoWithOutAttach({ file })).unwrap();
          } else {
            if (!articleId || !contentType) {
              console.error('articleId и contentType are required, when isAttach = false');
              continue;
            }

            response = await dispatch(
              uploadPhoto({
                file,
                entityReferenceId: articleId,
                articleType: contentType,
              }),
            ).unwrap();
          }

          urls.push(response);
        } catch (error) {
          console.log('error', error);
          toast.error('Failed to upload files');
        }
      }

      return urls;
    },
    [dispatch, articleId, contentType, isAttach],
  );

  const deleteFile = useCallback(
    async (url: string) => {
      await dispatch(deletePhoto(url)).unwrap();
    },
    [dispatch],
  );

  return { uploadFiles, deleteFile };
}

export default useImageLoading;
