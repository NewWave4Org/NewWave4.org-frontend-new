'use client';
import EditIcon from '@/components/icons/symbolic/EditIcon';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import TextArea from '@/components/shared/TextArea';
import {
  createNewArticle,
  getArticleById,
  publishArticle,
  updateArticle,
} from '@/store/article-content/action';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { ContentBlockType } from '@/utils/articles/type/contentBlockType';
import { ArticleResponseDTO } from '@/utils/articles/type/interface';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { UploadPhotoParams } from '@/utils/photos/photo-service';
import PhotoUploader from '@/components/ui/PhotoUploader';
import { deletePhoto, uploadPhoto } from '@/store/photos/action';
import { extractErrorMessage } from '@/utils/apiErrors';
import { GetArticleByIdResponseDTO } from '@/utils/article-content/type/interfaces';
import { ArticleType } from '@/utils/ArticleType';

interface ArticleContentDTO {
  textblock1: string;
  textblock2: string;
  quote: string;
  video: string;
  mainPhoto?: string | null;
  photosList?: string[];
  sliderPhotos?: string[];
}

export interface UpdateArticleFormValues {
  title: string;
  articleType: ArticleType;
  authorId: string;
  articleStatus: string;
  contentBlocks: any[];
}

interface IArticleContent {
  articleId?: number;
}

const ArticleContent = ({ articleId }: IArticleContent) => {
  const dispatch = useAppDispatch();
  const [article, setArticle] = useState<GetArticleByIdResponseDTO | null>(
    null,
  );
  const router = useRouter();
  const pathname = usePathname();
  const isEdit = pathname.includes('/edit');

  const validationSchema = Yup.object({
    textblock1: Yup.string(),
    textblock2: Yup.string(),
    quote: Yup.string(),
    video: Yup.string().url('Must be a valid URL').nullable(),
  });

  useEffect(() => {
    if (!articleId) return;

    const fetchArticle = async () => {
      try {
        const data = await dispatch(
          getArticleById({ id: articleId, articleType: 'NEWS' }),
        ).unwrap();
        setArticle(data);
      } catch {
        toast.error('Failed to fetch article');
      }
    };

    fetchArticle();
  }, [articleId, dispatch]);

  async function handleSaveArticleContent(values: ArticleContentDTO) {
    const saveSuccess = await saveArticleContent(values);
    if (!saveSuccess) return;
  }

  async function saveArticleContent(
    values: ArticleContentDTO,
  ): Promise<boolean> {
    const blocks = [
      {
        contentBlockType: ContentBlockType.MAIN_NEWS_BLOCK,
        data: values.textblock1,
      },
      {
        contentBlockType: ContentBlockType.TEXT,
        data: values.textblock2,
      },
      {
        contentBlockType: ContentBlockType.QUOTE,
        data: values.quote,
      },
      {
        contentBlockType: ContentBlockType.VIDEO,
        data: values.video,
      },
      {
        contentBlockType: ContentBlockType.PHOTO,
        data: values.mainPhoto || '',
      },
      {
        contentBlockType: ContentBlockType.PHOTOS_LIST,
        data: values.photosList || [],
      },
      {
        contentBlockType: ContentBlockType.PHOTOS_SLIDER,
        data: values.sliderPhotos || [],
      },
    ];

    try {
      if (articleId) {
        await dispatch(
          updateArticle({
            id: articleId,
            data: {
              title: article?.title || 'Untitled',
              articleType: 'NEWS',
              contentBlocks: blocks,
              relevantProjectId: article?.relevantProjectId,
            },
          }),
        ).unwrap();
      } else {
        await dispatch(
          createNewArticle({
            title: article?.title || 'Untitled',
            articleType: 'NEWS',
            contentBlocks: blocks,
            relevantProjectId: article?.relevantProjectId,
            authorId: article?.authorId,
          }),
        ).unwrap();
      }

      toast.success('Article content saved successfully!');
      return true;
    } catch (err) {
      toast.error('Failed to save article');
      console.error(err);
      return false;
    }
  }

  async function saveArticleContent2(
    values: ArticleContentDTO,
  ): Promise<boolean> {
    const blocks: {
      type: ContentBlockType;
      data: string | string[];
      label: string;
      orderIndex: number;
    }[] = [
      {
        type: ContentBlockType.MAIN_NEWS_BLOCK,
        data: values.textblock1,
        label: 'Text block 1',
        orderIndex: 1,
      },
      {
        type: ContentBlockType.TEXT,
        data: values.textblock2,
        label: 'Text block 2',
        orderIndex: 2,
      },
      {
        type: ContentBlockType.QUOTE,
        data: values.quote,
        label: 'Quote',
        orderIndex: 3,
      },
      {
        type: ContentBlockType.VIDEO,
        data: values.video,
        label: 'Video',
        orderIndex: 4,
      },
      {
        type: ContentBlockType.PHOTO,
        data: typeof values.mainPhoto === 'string' ? values.mainPhoto : '',
        label: 'Main Photo',
        orderIndex: 5,
      },
      {
        type: ContentBlockType.PHOTOS_LIST,
        data: values.photosList || [],
        label: 'Photo List',
        orderIndex: 6,
      },
      {
        type: ContentBlockType.PHOTOS_SLIDER,
        data: values.sliderPhotos || [],
        label: 'Photo Slider',
        orderIndex: 7,
      },
    ];

    const isArrayBlock = (type: ContentBlockType) =>
      type === ContentBlockType.PHOTOS_LIST ||
      type === ContentBlockType.PHOTOS_SLIDER;

    const results = await Promise.all(
      blocks.map(async block => {
        try {
          const existingBlock = article?.contentBlocks?.find(
            b => b.contentBlockType === block.type,
          );

          if (isArrayBlock(block.type)) {
            if (existingBlock) {
              if ((block.data as string[]).length === 0) {
                // await dispatch(deleteContentBlock(existingBlock.id)).unwrap();
              } else {
                // await dispatch(
                //   updateContentBlockArray({
                //     id: existingBlock.id,
                //     data: {
                //       contentBlockType: block.type,
                //       data: block.data as string[],
                //       orderIndex: block.orderIndex,
                //     },
                //   }),
                // ).unwrap();
              }
            } else if ((block.data as string[]).length > 0) {
              // await dispatch(
              //   createContentBlockArray({
              //     id: articleId!,
              //     data: {
              //       contentBlockType: block.type,
              //       data: block.data as string[],
              //       orderIndex: block.orderIndex,
              //     },
              //   }),
              // ).unwrap();
            }
          } else {
            const dataStr = block.data as string;
            if (existingBlock) {
              if (!dataStr) {
                //   await dispatch(deleteContentBlock(existingBlock.id)).unwrap();
              } else {
                // await dispatch(
                //   updateContentBlock({
                //     id: existingBlock.id,
                //     data: {
                //       contentBlockType: block.type,
                //       data: dataStr,
                //       orderIndex: block.orderIndex,
                //     },
                //   }),
                // ).unwrap();
              }
            } else if (dataStr) {
              // await dispatch(
              //   createContentBlock({
              //     id: articleId!,
              //     data: {
              //       contentBlockType: block.type,
              //       data: dataStr,
              //       orderIndex: block.orderIndex,
              //     },
              //   }),
              // ).unwrap();
            }
          }

          return { label: block.label, success: true };
        } catch (err) {
          return { label: block.label, success: false, error: err };
        }
      }),
    );

    const failedBlocks = results.filter(r => !r.success);

    if (failedBlocks.length === 0) {
      toast.success('All content blocks saved successfully!');
      return true;
    } else {
      const failedNames = failedBlocks.map(b => b.label).join(', ');
      toast.error(`Failed to save: ${failedNames}`);
      return false;
    }
  }

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    const urls: string[] = [];

    for (const file of files) {
      const params: UploadPhotoParams = {
        file,
        entityReferenceId: articleId!,
        articleType: 'NEWS',
      };

      const response = await dispatch(uploadPhoto(params)).unwrap();
      urls.push(response);
    }
    return urls;
  };

  const deleteFile = async (url: string) => {
    await dispatch(deletePhoto(url)).unwrap();
  };

  async function handlePublish(values: ArticleContentDTO) {
    if (!articleId) return;

    const saveSuccess = await saveArticleContent(values);
    if (!saveSuccess) {
      toast.error('Failed to save article before publishing');
      return;
    }

    if (!values.mainPhoto) {
      toast.error('Main photo is required to publish');
      return;
    }

    if (!values.textblock1 || values.textblock1.trim() === '') {
      toast.error('Text block 1 cannot be empty');
      return;
    }

    const nonEmptyBlocks = [
      values.textblock1,
      values.textblock2,
      values.quote,
      values.video,
      values.mainPhoto,
      ...(values.photosList || []),
      ...(values.sliderPhotos || []),
    ]
      .flatMap(block => (Array.isArray(block) ? block : [block]))
      .filter(block => block && block.toString().trim() !== '');

    if (nonEmptyBlocks.length < 3) {
      toast.error('Article must have at least 3 content blocks');
      return;
    }

    try {
      const result = await dispatch(publishArticle(articleId));

      if (publishArticle.rejected.match(result)) {
        const message = extractErrorMessage(result.payload);
        toast.error(message);
        return;
      }

      toast.success('Article published successfully!');
      router.push('/admin/articles');
    } catch (err: any) {
      const message = extractErrorMessage(err?.errors ?? err?.message ?? err);
      toast.error(message || 'Failed to publish article');
    }
  }

  async function handlePreview() {
    router.push(`/admin/articles/preview?id=${articleId}`);
  }

  return (
    <>
      <div className="modal__body">
        {!isEdit && (
          <div className="flex mb-3">
            <EditIcon />
            <h4 className="text-h5 pl-2">{article?.title}</h4>
          </div>
        )}

        <Formik
          enableReinitialize
          initialValues={{
            textblock1:
              article?.contentBlocks?.find(
                b => b.contentBlockType === ContentBlockType.MAIN_NEWS_BLOCK,
              )?.data || '',
            textblock2:
              article?.contentBlocks?.find(
                b => b.contentBlockType === ContentBlockType.TEXT,
              )?.data || '',
            quote:
              article?.contentBlocks?.find(
                b => b.contentBlockType === ContentBlockType.QUOTE,
              )?.data || '',
            video:
              article?.contentBlocks?.find(
                b => b.contentBlockType === ContentBlockType.VIDEO,
              )?.data || '',
            mainPhoto:
              article?.contentBlocks?.find(
                b => b.contentBlockType === ContentBlockType.PHOTO,
              )?.data || '',
            photosList: (() => {
              const data = article?.contentBlocks?.find(
                b => b.contentBlockType === ContentBlockType.PHOTOS_LIST,
              )?.data;
              return Array.isArray(data) ? data : [];
            })(),

            sliderPhotos: (() => {
              const data = article?.contentBlocks?.find(
                b => b.contentBlockType === ContentBlockType.PHOTOS_SLIDER,
              )?.data;
              return Array.isArray(data) ? data : [];
            })(),
          }}
          validationSchema={validationSchema}
          onSubmit={async (values: ArticleContentDTO) => {
            await handleSaveArticleContent(values);
          }}
        >
          {({ errors, touched, handleChange, isSubmitting, values }) => (
            <Form>
              <div className="w-full mb-2">
                <TextArea
                  id="textblock1"
                  label="Text block 1"
                  className="!bg-background-light w-full h-[100px] px-5 rounded-lg !ring-0 !max-w-full"
                  labelClass=" !text-admin-700"
                  value={values.textblock1}
                  onChange={handleChange}
                />
              </div>

              <div className="w-full mb-2">
                <TextArea
                  id="quote"
                  label="Quote"
                  className="!bg-background-light w-full h-[100px] px-5 rounded-lg !ring-0 !max-w-full"
                  labelClass=" !text-admin-700"
                  value={values.quote}
                  onChange={handleChange}
                />
              </div>

              <div className="w-full mb-2">
                <TextArea
                  id="textblock2"
                  label="Text block 2"
                  className="!bg-background-light w-full h-[100px] px-5 rounded-lg !ring-0 !max-w-full"
                  labelClass=" !text-admin-700"
                  value={values.textblock2}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-5">
                <Input
                  onChange={handleChange}
                  id="video"
                  type="text"
                  className="!bg-background-light w-full h-[70px] px-5 rounded-lg !ring-0"
                  value={values.video}
                  label="Video"
                  labelClass="!text-admin-700"
                  validationText={
                    touched.video && errors.video ? errors.video : ''
                  }
                />
              </div>

              <PhotoUploader
                label="Main Photo"
                name="mainPhoto"
                maxFiles={1}
                onUpload={files => uploadFiles(files)}
                onDelete={deleteFile}
              />

              <PhotoUploader
                label="Photo List"
                name="photosList"
                maxFiles={2}
                onUpload={files => uploadFiles(files)}
                onDelete={deleteFile}
              />

              <PhotoUploader
                label="Photo Slider"
                name="sliderPhotos"
                maxFiles={5}
                onUpload={files => uploadFiles(files)}
                onDelete={deleteFile}
              />

              <div className="mt-10">
                <sup className="font-bold text-red-600 text-small2">*</sup>
                <em>
                  You must save the page before you can preview or publish it
                </em>
              </div>
              <div className="flex gap-x-6 mt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-[0.8] duration-500"
                >
                  Save
                </Button>

                <Button
                  type="button"
                  onClick={handlePreview}
                  className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-80 duration-300"
                >
                  Preview
                </Button>

                {article?.articleStatus !== 'PUBLISHED' && (
                  <Button
                    type="button"
                    onClick={() => handlePublish(values)}
                    className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-80 duration-300"
                  >
                    Publish
                  </Button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default ArticleContent;
