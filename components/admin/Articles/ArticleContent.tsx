'use client';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import TextArea from '@/components/shared/TextArea';
import {
  getAllArticle,
  getArticleById,
  publishArticle,
  updateArticle,
} from '@/store/article-content/action';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { ContentBlockType } from '@/utils/articles/type/contentBlockType';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { extractErrorMessage } from '@/utils/apiErrors';
import { GetArticleByIdResponseDTO } from '@/utils/article-content/type/interfaces';
import {
  ArticleStatusEnum,
  ArticleType,
  ArticleTypeEnum,
} from '@/utils/ArticleType';
import ImageLoading from '../ImageLoading/ImageLoading';
import Select from '@/components/shared/Select';
import { getUsers } from '@/store/users/actions';

interface ArticleContentDTO {
  title: string;
  relevantProjectId?: number;
  authorId?: number;
  textblock1: string;
  textblock2: string;
  quote: string;
  video: string;
  mainPhoto: string[];
  photosList?: string[];
  sliderPhotos?: string[];
}

interface ProjectOption {
  value: string | number;
  label: string;
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
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const router = useRouter();

  const currentUser = useAppSelector(state => state.authUser.user);
  const allUsers = useAppSelector(state => state.users.users);
  const currentAuthor = allUsers.find(user => user.name === currentUser?.name);

  const usersList = allUsers.map(user => ({
    value: user.id,
    label: user.name,
  }));

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    relevantProjectId: Yup.number().required('Please select a project'),
    authorId: Yup.number().required('Author field cannot be empty'),
    textblock1: Yup.string().required('Text block 1 is required'),
    textblock2: Yup.string(),
    quote: Yup.string(),
    video: Yup.string().url('Must be a valid URL').nullable(),
    mainPhoto: Yup.array()
      .of(Yup.string().url('Main photo must be a valid URL'))
      .min(1, 'Main photo is required'),
    sliderPhotos: Yup.array()
      .of(Yup.string().url('Invalid image URL'))
      .test(
        'min-files-if-any',
        'You must upload at least 3 images for slider',
        value => {
          if (!value) return true;
          if (value.length === 0) return true;
          return value.length >= 3;
        },
      ),
  });

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await dispatch(
          getAllArticle({
            articleType: ArticleTypeEnum.PROJECT,
            articleStatus: ArticleStatusEnum.PUBLISHED,
          }),
        ).unwrap();

        const mappedProjects = (data.content ?? []).map((project: any) => ({
          value: project.id,
          label: project.title,
        }));
        setProjects(mappedProjects);
      } catch (err) {
        toast.error('Failed to fetch projects');
        console.error(err);
      }
    };

    fetchProjects();
  }, [dispatch]);

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
    if (!values.textblock1 || values.textblock1.trim() === '') {
      toast.error('Text block 1 is required');
      return;
    }
    if (!values.mainPhoto || values.mainPhoto.length === 0) {
      toast.error('Main photo is required');
      return;
    }

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
              title: values.title,
              articleType: ArticleTypeEnum.NEWS,
              authorId: Number(values.authorId),
              relevantProjectId: Number(values.relevantProjectId),
              contentBlocks: blocks,
            },
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

  async function handlePublish(values: ArticleContentDTO) {
    if (!articleId) return;

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
        <Formik
          validateOnMount
          enableReinitialize
          initialValues={{
            title: article?.title || '',
            authorId: currentAuthor?.id,
            relevantProjectId: article?.relevantProjectId,
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
            mainPhoto: (() => {
              const data = article?.contentBlocks?.find(
                b => b.contentBlockType === ContentBlockType.PHOTO,
              )?.data;
              return Array.isArray(data) ? data : data ? [data] : [];
            })(),
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
          {({
            errors,
            touched,
            handleChange,
            isSubmitting,
            isValid,
            values,
            setFieldValue,
            setFieldTouched,
          }) => (
            <Form>
              <div className="mb-5">
                <Input
                  required
                  onChange={handleChange}
                  id="title"
                  name="title"
                  type="text"
                  className="!bg-background-light w-full h-[70px] px-5 rounded-lg !ring-0"
                  value={values.title}
                  label="Title"
                  labelClass="!text-admin-700"
                  validationText={
                    touched.title && errors.title ? errors.title : ''
                  }
                />
              </div>

              <div className="mb-5">
                <Select
                  label="Relevant Project"
                  labelClass="!text-admin-700"
                  adminSelectClass={true}
                  name="relevantProjectId"
                  required
                  placeholder="Choose project"
                  onChange={handleChange}
                  options={
                    projects.length > 0
                      ? projects
                      : [
                          {
                            value: '',
                            label: 'No published projects available',
                            disabled: true,
                          },
                        ]
                  }
                />
              </div>

              <div className="mb-5">
                <Select
                  label="Change Author (if needed)"
                  adminSelectClass={true}
                  name="authorId"
                  required
                  labelClass="!text-admin-700"
                  onChange={handleChange}
                  options={usersList}
                />
              </div>

              <div className="w-full mb-2">
                <TextArea
                  id="textblock1"
                  label="Text block 1"
                  required
                  className="!bg-background-light w-full h-[100px] px-5 rounded-lg !ring-0 !max-w-full"
                  labelClass=" !text-admin-700"
                  value={values.textblock1}
                  onChange={handleChange}
                  validationText={
                    touched.textblock1 && errors.textblock1
                      ? errors.textblock1
                      : ''
                  }
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

              <div className="w-1/2 h-[442px]">
                <ImageLoading
                  label="Main Photo"
                  required
                  contentType={ArticleTypeEnum.NEWS}
                  articleId={articleId!}
                  maxFiles={1}
                  uploadedUrls={values.mainPhoto || []}
                  onFilesChange={urls => {
                    setFieldValue('mainPhoto', urls);
                    setFieldTouched('mainPhoto', true, false);
                  }}
                  previewSize={300}
                  validationText={
                    touched.mainPhoto && errors.mainPhoto
                      ? (errors.mainPhoto as string)
                      : ''
                  }
                />
              </div>

              <div className="w-full h-[442px] my-2">
                <ImageLoading
                  label="Photo List"
                  note=" You can upload 1 or 2 photos here."
                  contentType={ArticleTypeEnum.NEWS}
                  articleId={articleId!}
                  maxFiles={2}
                  uploadedUrls={values.photosList || []}
                  onFilesChange={urls => setFieldValue('photosList', urls)}
                  previewSize={200}
                />
              </div>

              <div className="w-full h-[442px]">
                <ImageLoading
                  label="Photo Slider"
                  note="Minimum 3 and maximum 5 photos."
                  contentType={ArticleTypeEnum.NEWS}
                  articleId={articleId!}
                  maxFiles={5}
                  uploadedUrls={values.sliderPhotos || []}
                  onFilesChange={urls => {
                    setFieldValue('sliderPhotos', urls);
                    setFieldTouched('sliderPhotos', true, false);
                  }}
                  previewSize={200}
                  validationText={
                    touched.sliderPhotos && errors.sliderPhotos
                      ? (errors.sliderPhotos as string)
                      : ''
                  }
                />
              </div>

              <div className="mt-10">
                <sup className="font-bold text-red-600 text-small2">*</sup>
                <em>
                  You must save the page before you can preview or publish it
                </em>
              </div>
              <div className="flex gap-x-6 mt-6">
                <Button
                  type="submit"
                  title={
                    !isValid
                      ? 'Please fill in all required fields correctly'
                      : isSubmitting
                      ? 'Submitting...'
                      : ''
                  }
                  disabled={!isValid || isSubmitting}
                  className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-[0.8] duration-500"
                >
                  Save
                </Button>

                <Button
                  type="button"
                  disabled={!isValid || isSubmitting}
                  title={
                    !isValid
                      ? 'Please fill in all required fields correctly'
                      : isSubmitting
                      ? 'Submitting...'
                      : ''
                  }
                  onClick={handlePreview}
                  className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-80 duration-300"
                >
                  Preview
                </Button>

                {article?.articleStatus !== 'PUBLISHED' && (
                  <Button
                    type="button"
                    title={
                      !isValid
                        ? 'Please fill in all required fields correctly'
                        : isSubmitting
                        ? 'Submitting...'
                        : ''
                    }
                    disabled={!isValid || isSubmitting}
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
