'use client';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import TextEditor from '@/components/TextEditor/TextEditor';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import {
  getAllArticle,
  getArticleById,
  publishArticle,
  updateArticle,
} from '@/store/article-content/action';
import * as Yup from 'yup';
import { useAppDispatch } from '@/store/hook';
import { ContentBlockType } from '@/utils/articles/type/contentBlockType';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { extractErrorMessage } from '@/utils/apiErrors';
import { GetArticleByIdResponseDTO } from '@/utils/article-content/type/interfaces';
import { ArticleStatusEnum, ArticleTypeEnum } from '@/utils/ArticleType';
import ImageLoading from '../helperComponents/ImageLoading/ImageLoading';
import Select from '@/components/shared/Select';
import WarningIcon from '@/components/icons/status/WarningIcon';
import { useUsers } from '@/utils/hooks/useUsers';
import DatePicker from '../helperComponents/DatePicker/DatePicker';
import { convertFromISO } from '../helperComponents/DatePicker/utils/convertFromISO';
import { convertToISO } from '../helperComponents/DatePicker/utils/convertToISO';

const getTypeName = (type: ArticleTypeEnum) =>
  type === ArticleTypeEnum.EVENT ? 'Event' : 'Article';

const getTypePath = (type: ArticleTypeEnum) =>
  type === ArticleTypeEnum.EVENT ? 'events' : 'articles';

interface IArticleContent {
  articleId?: number;
  articleType: ArticleTypeEnum;
}

const getDefaultContentBlocks = () => [
  { contentBlockType: 'TRANSLATE', translateStatus: 'no' },
  { contentBlockType: ContentBlockType.MAIN_NEWS_BLOCK, translatable_text_editorState: null },
  { contentBlockType: ContentBlockType.TEXT, translatable_text_editorState: null },
  { contentBlockType: ContentBlockType.QUOTE, translatable_text_editorState: null },
  { contentBlockType: ContentBlockType.VIDEO, data: '' },
  { contentBlockType: ContentBlockType.PHOTO, data: [] },
  { contentBlockType: ContentBlockType.PHOTOS_LIST, data: [] },
  { contentBlockType: ContentBlockType.PHOTOS_SLIDER, data: [] },
];

const ArticleContent = ({ articleId, articleType }: IArticleContent) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [article, setArticle] = useState<GetArticleByIdResponseDTO | null>(null);
  const [projects, setProjects] = useState<{ value: string | number; label: string }[]>([]);
  const [sliderPhotosChanged, setSliderPhotosChanged] = useState(false);

  const [editorStates, setEditorStates] = useState<{
    textblock1: EditorState;
    textblock2: EditorState;
    quote: EditorState;
  }>({
    textblock1: EditorState.createEmpty(),
    textblock2: EditorState.createEmpty(),
    quote: EditorState.createEmpty(),
  });

  const [editorKey, setEditorKey] = useState({
    textblock1: 'textblock1-init',
    textblock2: 'textblock2-init',
    quote: 'quote-init',
  });

  const { usersList, currentAuthor } = useUsers(true);
  const [defaultAuthorId, setDefaultAuthorId] = useState<number>();

  const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  relevantProjectId: Yup.number().required('Please select a project'),
  authorId: Yup.number().required('Author field cannot be empty'),
  contentBlocks: Yup.array().of(
    Yup.lazy((block: any) => {
      switch (block?.contentBlockType) {
        case ContentBlockType.MAIN_NEWS_BLOCK:
          return Yup.object({
            translatable_text_editorState: Yup.mixed()
              .required('Text block 1 is required')
              .test('not-empty', 'Text block 1 is required', value => {
                if (!value) return false;
                try {
                  return convertFromRaw(value).hasText();
                } catch {
                  return false;
                }
              }),
          });

        case ContentBlockType.VIDEO:
          return Yup.object({
            data: Yup.string().url('Must be a valid URL').nullable(),
          });

        case ContentBlockType.PHOTO:
          return Yup.object({
            data: Yup.array()
              .of(Yup.string().url('Main photo must be a valid URL'))
              .min(1, 'Main photo is required'),
          });

        case ContentBlockType.PHOTOS_SLIDER:
          return Yup.object({
            data: Yup.array().of(Yup.string().url('Invalid image URL')),
          });

        default:
          return Yup.object();
      }
    }),
  ),
});

  useEffect(() => {
    if (article?.authorId) setDefaultAuthorId(article.authorId);
    else if (currentAuthor?.id) setDefaultAuthorId(currentAuthor.id);
  }, [article?.authorId, currentAuthor]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await dispatch(
          getAllArticle({
            articleType: ArticleTypeEnum.PROJECT,
            articleStatus: ArticleStatusEnum.PUBLISHED,
          }),
        ).unwrap();
        setProjects(
          (data.content ?? []).map((p: any) => ({ value: p.id, label: p.title })),
        );
      } catch {
        toast.error('Failed to fetch projects');
      }
    };
    fetchProjects();
  }, [dispatch]);

  useEffect(() => {
    if (!articleId) return;

    const fetchArticle = async () => {
      try {
        const data = await dispatch(getArticleById(articleId)).unwrap();
        setArticle(data);

        const getState = (blockType: ContentBlockType): EditorState => {
          const block = data.contentBlocks?.find((b: any) => b.contentBlockType === blockType);
          try {
            return block?.translatable_text_editorState
              ? EditorState.createWithContent(convertFromRaw(block.translatable_text_editorState))
              : EditorState.createEmpty();
          } catch {
            return EditorState.createEmpty();
          }
        };

        setEditorStates({
          textblock1: getState(ContentBlockType.MAIN_NEWS_BLOCK),
          textblock2: getState(ContentBlockType.TEXT),
          quote: getState(ContentBlockType.QUOTE),
        });

        setEditorKey({
          textblock1: `textblock1-${Date.now()}`,
          textblock2: `textblock2-${Date.now()}`,
          quote: `quote-${Date.now()}`,
        });
      } catch {
        toast.error(`Failed to fetch ${getTypeName(articleType)}`);
      }
    };

    fetchArticle();
  }, [articleId, articleType, dispatch]);

  const handleEditorChange = (
    blockType: ContentBlockType,
    newState: EditorState,
    values: any,
    setFieldValue: (field: string, value: any) => void,
    setFieldTouched: (field: string, touched: boolean) => void,
  ) => {
    const stateKey = blockType === ContentBlockType.MAIN_NEWS_BLOCK
      ? 'textblock1'
      : blockType === ContentBlockType.TEXT
      ? 'textblock2'
      : 'quote';

    setEditorStates(prev => ({ ...prev, [stateKey]: newState }));

    const index = values.contentBlocks.findIndex(
      (b: any) => b.contentBlockType === blockType,
    );
    if (index === -1) return;

    const raw = convertToRaw(newState.getCurrentContent());

    setFieldValue(`contentBlocks.${index}.translatable_text_editorState`, raw);
    setFieldTouched(`contentBlocks.${index}.translatable_text_editorState`, true);
  };

  async function handleSubmit(values: any) {
    console.log('values', values);
    try {
      if(articleId) {
         const textblock1Block = values.contentBlocks.find(
          (b: any) => b.contentBlockType === ContentBlockType.MAIN_NEWS_BLOCK,
        );
        const isTextblock1Empty = !textblock1Block?.translatable_text_editorState
          || (() => {
            try {
              return !convertFromRaw(textblock1Block.translatable_text_editorState).hasText();
            } catch {
              return true;
            }
          })();

        if (isTextblock1Empty) {
          toast.error('Text block 1 is required');
          return;
        }

        // Checking mainPhoto
        const mainPhotoBlock = values.contentBlocks.find(
          (b: any) => b.contentBlockType === ContentBlockType.PHOTO,
        );
        if (!mainPhotoBlock?.data?.length) {
          toast.error('Main photo is required');
          return;
        }

        await dispatch(
          updateArticle({
            id: articleId,
            data: {
              title: values.title,
              dateOfWriting: convertToISO(values.dateOfWriting),
              articleType,
              authorId: Number(values.authorId),
              relevantProjectId: Number(values.relevantProjectId),
              contentBlocks: values.contentBlocks,
            },
          }),
        ).unwrap();
      }

      toast.success(`${getTypeName(articleType)} content saved successfully!`);
    } catch {
      toast.error(`Failed to save ${getTypeName(articleType)}`);
    }
  }

  async function handlePublish(values: any) {
    if (!articleId) return;

    const mainPhotoBlock = values.contentBlocks.find(
      (b: any) => b.contentBlockType === ContentBlockType.PHOTO,
    );
    const textblock1Block = values.contentBlocks.find(
      (b: any) => b.contentBlockType === ContentBlockType.MAIN_NEWS_BLOCK,
    );

    if (!mainPhotoBlock?.data?.length) {
      toast.error('Main photo is required to publish');
      return;
    }

    if (!textblock1Block?.translatable_text_editorState) {
      toast.error('Text block 1 cannot be empty');
      return;
    }

    try {
      const result = await dispatch(publishArticle(articleId));
      if (publishArticle.rejected.match(result)) {
        toast.error(extractErrorMessage(result.payload));
        return;
      }
      toast.success(`${getTypeName(articleType)} published successfully!`);
      router.push(`/admin/${getTypePath(articleType)}`);
    } catch (err: any) {
      toast.error(extractErrorMessage(err?.errors ?? err?.message ?? err) || `Failed to publish ${getTypeName(articleType)}`);
    }
  }

  return (
    <div className="modal__body">
      {defaultAuthorId !== undefined && (
        <Formik
          enableReinitialize
          initialValues={{
            title: article?.title || '',
            dateOfWriting: article?.dateOfWriting
              ? convertFromISO(article.dateOfWriting)
              : convertFromISO(new Date()),
            authorId: defaultAuthorId ? Number(defaultAuthorId) : undefined,
            relevantProjectId: article?.relevantProjectId,
            contentBlocks: article?.contentBlocks?.length
              ? article.contentBlocks
              : getDefaultContentBlocks(),
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            await handleSubmit(values);
            setSliderPhotosChanged(false);
            resetForm({ values });
          }}
        >
          {({ handleChange, isSubmitting, dirty, values, setFieldValue, setFieldTouched, errors, touched, validateForm, handleSubmit }) => {
            const mainNewsIndex = values.contentBlocks.findIndex(
              (b: any) => b.contentBlockType === ContentBlockType.MAIN_NEWS_BLOCK,
            );
            const photoIndex = values.contentBlocks.findIndex(
              (b: any) => b.contentBlockType === ContentBlockType.PHOTO,
            );
            const photosListIndex = values.contentBlocks.findIndex(
              (b: any) => b.contentBlockType === ContentBlockType.PHOTOS_LIST,
            );
            const sliderIndex = values.contentBlocks.findIndex(
              (b: any) => b.contentBlockType === ContentBlockType.PHOTOS_SLIDER,
            );
            const videoIndex = values.contentBlocks.findIndex(
              (b: any) => b.contentBlockType === ContentBlockType.VIDEO,
            );

            const translateBlockIndex = values.contentBlocks.findIndex(b => b.contentBlockType === 'TRANSLATE');

            const mainPhotoData = values.contentBlocks[photoIndex]?.data;
            const mainPhotoUrls = Array.isArray(mainPhotoData) ? mainPhotoData : mainPhotoData ? [mainPhotoData] : [];

            const photosListData = values.contentBlocks[photosListIndex]?.data;
            const photosListUrls = Array.isArray(photosListData) ? photosListData : [];

            const sliderData = values.contentBlocks[sliderIndex]?.data;
            const sliderUrls = Array.isArray(sliderData) ? sliderData : [];

            return (
              <Form
                onSubmit={async e => {
                  e.preventDefault();
                  const formErrors = await validateForm();

                  if (Object.keys(formErrors).length > 0) {
                    Object.keys(formErrors).forEach(field => setFieldTouched(field, true));
                    
                    values.contentBlocks.forEach((_: any, index: number) => {
                      setFieldTouched(`contentBlocks.${index}.translatable_text_editorState`, true);
                      setFieldTouched(`contentBlocks.${index}.data`, true);
                    });

                    toast.error('Please fix validation errors highlighted in the form.');
                    return;
                  }

                  handleSubmit();
                }}
              >
                <div className='mb-5'>
                  <Select label="Do you want translate this program info English language?" adminSelectClass={true} 
                    name={`contentBlocks.${translateBlockIndex}.translateStatus`}
                    labelClass="!text-admin-700" 
                    onChange={handleChange} options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                  ]} />
                </div>

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
                        : [{ value: '', label: 'No published projects available', disabled: true }]
                    }
                  />
                </div>

                <div className="mb-5">
                  <div className="block text-medium2 mb-1 !text-admin-700">Choose the creation date</div>
                  <DatePicker
                    name="dateOfWriting"
                    pickerId="article-creationDate"
                    pickerWithTime={false}
                    pickerType="single"
                    pickerPlaceholder="Choose date"
                    pickerValue={values?.dateOfWriting}
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
                  <label className="block mb-2 text-admin-700 font-medium">
                    Text block 1 <sup className="font-bold text-red-600 text-small2">*</sup>
                  </label>
                  <TextEditor
                    key={editorKey.textblock1}
                    value={editorStates.textblock1}
                    onChange={newState =>
                      handleEditorChange(ContentBlockType.MAIN_NEWS_BLOCK, newState, values, setFieldValue, setFieldTouched)
                    }
                  />
                  {(touched.contentBlocks as any)?.[mainNewsIndex]?.translatable_text_editorState &&
                    (errors.contentBlocks as any)?.[mainNewsIndex]?.translatable_text_editorState && (
                      <div className="text-red-700 text-small2 mt-1">
                        {(errors.contentBlocks as any)[mainNewsIndex].translatable_text_editorState}
                      </div>
                  )}
                </div>

                <div className="w-full mb-2">
                  <label className="block mb-2 text-admin-700 font-medium">Quote</label>
                  <TextEditor
                    key={editorKey.quote}
                    value={editorStates.quote}
                    onChange={newState =>
                      handleEditorChange(ContentBlockType.QUOTE, newState, values, setFieldValue, setFieldTouched)
                    }
                  />
                </div>

                <div className="w-full mb-2">
                  <label className="block mb-2 text-admin-700 font-medium">Text block 2</label>
                  <TextEditor
                    key={editorKey.textblock2}
                    value={editorStates.textblock2}
                    onChange={newState =>
                      handleEditorChange(ContentBlockType.TEXT, newState, values, setFieldValue, setFieldTouched)
                    }
                  />
                </div>

                <div className="mb-5">
                  <Input
                    onChange={handleChange}
                    id={`contentBlocks.${videoIndex}.data`}
                    name={`contentBlocks.${videoIndex}.data`}
                    type="text"
                    className="!bg-background-light w-full h-[70px] px-5 rounded-lg !ring-0"
                    value={values.contentBlocks[videoIndex]?.data || ''}
                    label="Video"
                    labelClass="!text-admin-700"
                  />
                </div>

                <div>
                  <div className="w-1/2 h-[442px]">
                    <ImageLoading
                      label="Main Photo"
                      required
                      contentType={articleType}
                      articleId={articleId!}
                      maxFiles={1}
                      uploadedUrls={mainPhotoUrls}
                      onFilesChange={urls => {
                        setFieldValue(`contentBlocks.${photoIndex}.data`, urls);
                        setFieldTouched(`contentBlocks.${photoIndex}.data`, true, false);
                      }}
                      previewSize={300}
                    />
                    
                  </div>
                  {(touched.contentBlocks as any)?.[photoIndex]?.data &&
                    (errors.contentBlocks as any)?.[photoIndex]?.data && (
                      <div className="text-red-700 text-small2 my-1">
                        {(errors.contentBlocks as any)[photoIndex].data}
                      </div>
                  )}
                </div>
                

                <div className="w-full h-[442px] my-2">
                  <ImageLoading
                    label="Photo List"
                    note="You can upload 1 or 2 photos here."
                    contentType={articleType}
                    articleId={articleId!}
                    maxFiles={2}
                    uploadedUrls={photosListUrls}
                    onFilesChange={urls => setFieldValue(`contentBlocks.${photosListIndex}.data`, urls)}
                    previewSize={200}
                  />
                  
                </div>

                <div className="w-full h-[442px]">
                  <ImageLoading
                    label="Photo Slider"
                    note="Minimum 3 and maximum 5 photos."
                    contentType={articleType}
                    articleId={articleId!}
                    maxFiles={5}
                    uploadedUrls={sliderUrls}
                    onFilesChange={urls => {
                      setSliderPhotosChanged(urls.length < sliderUrls.length);
                      setFieldValue(`contentBlocks.${sliderIndex}.data`, urls);
                    }}
                    previewSize={200}
                  />
                  {sliderPhotosChanged && (
                    <div className="mt-2 flex gap-x-1">
                      <WarningIcon />
                      <em className="text-red-600">Warning: Click "Save" to permanently delete the photo.</em>
                    </div>
                  )}
                </div>

                <div className="mt-10">
                  <sup className="font-bold text-red-600 text-small2">*</sup>
                  <em>You must save the page before you can preview or publish it</em>
                </div>

                <div className="flex gap-x-6 mt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-[0.8] duration-500"
                  >
                    {isSubmitting ? 'Submitting...' : 'Save'}
                  </Button>

                  <Button
                    type="button"
                    disabled={dirty || isSubmitting}
                    title={dirty ? 'Please save the changes' : ''}
                    onClick={() => router.push(`/admin/${getTypePath(articleType)}/preview?id=${articleId}`)}
                    className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-80 duration-300"
                  >
                    Preview
                  </Button>

                  {article?.articleStatus !== 'PUBLISHED' && (
                    <Button
                      type="button"
                      disabled={dirty || isSubmitting}
                      title={dirty ? 'Please save the changes' : ''}
                      onClick={() => handlePublish(values)}
                      className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-80 duration-300"
                    >
                      Publish
                    </Button>
                  )}
                </div>
              </Form>
            );
          }}
        </Formik>
      )}
    </div>
  );
};

export default ArticleContent;