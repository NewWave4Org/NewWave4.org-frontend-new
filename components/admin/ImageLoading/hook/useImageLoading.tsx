import { useAppDispatch } from '@/store/hook';
import { deletePhoto, uploadPhoto } from '@/store/photos/action';
import { ArticleType } from '@/utils/ArticleType';
import { UploadPhotoParams } from '@/utils/photos/photo-service';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

interface IImageLoadingProps {
  articleId: number;
  contentType: ArticleType;
}

function useImageLoading({ articleId, contentType }: IImageLoadingProps) {
  const dispatch = useAppDispatch();

  const uploadFiles = useCallback(
    async (files: File[]): Promise<string[]> => {
      const urls: string[] = [];

      for (const file of files) {
        const params: UploadPhotoParams = {
          file,
          entityReferenceId: articleId,
          articleType: contentType,
        };

        try {
          const response = await dispatch(uploadPhoto(params)).unwrap();
          urls.push(response);
        } catch (error) {
          console.log('error', error);
          toast.error('Failed to upload files');
        }
      }
      return urls;
    },
    [dispatch, articleId, contentType],
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
