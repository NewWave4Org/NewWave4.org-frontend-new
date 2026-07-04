'use client';

import { useAppDispatch } from '@/store/hook';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';

import { toast } from 'react-toastify';

import { FieldArray, Form, Formik, FormikHelpers } from 'formik';
import Button from '@/components/shared/Button';
import ImageLoading from '../../helperComponents/ImageLoading/ImageLoading';
import LinkBtn from '@/components/shared/LinkBtn';
import {
  getArticleById,
  publishArticle,
  updateArticle,
} from '@/store/article-content/action';
import Input from '@/components/shared/Input';
import { GetArticleByIdResponseDTO } from '@/utils/article-content/type/interfaces';
import { ArticleType, ArticleTypeEnum } from '@/utils/ArticleType';
import useHandleThunk from '@/utils/useHandleThunk';
import Select from '@/components/shared/Select';
import { typeSocialMediaList } from '@/data/projects/typeSocialMediaList';
import { useUsers } from '@/utils/hooks/useUsers';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import TextEditor from '@/components/TextEditor/TextEditor';
import DatePicker from '../../helperComponents/DatePicker/DatePicker';
import { convertFromISO } from '../../helperComponents/DatePicker/utils/convertFromISO';
import { convertToISO } from '../../helperComponents/DatePicker/utils/convertToISO';
import { v4 as uuid } from 'uuid';
import useImageLoading from '../../helperComponents/ImageLoading/hook/useImageLoading';
import Accordion from '@/components/ui/Accordion/Accordion';
import BasketIcon from '@/components/icons/symbolic/BasketIcon';
import { createTranslation } from '@/store/translation/action';
import Loading from '../../helperComponents/Loading/Loading';
import { decorator } from '@/components/TextEditor/toolBar/Link/Link';
import AuthorField from '../../helperComponents/AuthorField/AuthorField';
import TranslateSection from '../../helperComponents/TranslateSection/TranslateSection';
import { TranslateDirection, TranslateDirectionEnum } from '../../Pages/enum/types';

export interface UpdateArticleFormValues {
  title: string;
  articleType: ArticleType;
  authorName?: string | undefined;
  articleStatus: string;
  contentBlocks: any[];
  dateOfWriting: any;
  translateDirection: TranslateDirection;
}

const validationSchema = Yup.object({
  title: Yup.string().required('Title field cannot be empty'),
  authorName: Yup.string().required('Author field cannot be empty'),
  translateDirection: Yup.string().test(
    'required-if-translate',
    'Translation direction is required',
    function(value) {
      const contentBlocks = this.parent.contentBlocks;
      const translateBlock = contentBlocks?.find(
        (b: any) => b.contentBlockType === 'TRANSLATE'
      );
      if (translateBlock?.translateStatus === 'yes') {
        return !!value;
      }
      return true;
    }
  ),
});

function ProjectContent({ projectId }: { projectId: number }) {
  const [project, setProject] = useState<GetArticleByIdResponseDTO | null>(null);
  const [loadingProject, setLoadingProgect] = useState(false);
  const [projectStatus, setProjectsStatus] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'saving' | 'translating'>('idle');

  const router = useRouter();

  const dispatch = useAppDispatch();
  const handleThunk = useHandleThunk();
  const pathname = usePathname();

  const [submitErrorTranslate, setSubmitErrorTranslate] = useState('');

  const { deleteFile } = useImageLoading({
    articleId: project?.id,
    contentType: ArticleTypeEnum.PROJECT,
  });

  const [submitError, setSubmitError] = useState('');

  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);

  const [editorStates, setEditorStates] = useState<Record<string, EditorState>>({});
  const [editorKey, setEditorKey] = useState<Record<string, string>>({});

  const { usersList, currentAuthor } = useUsers(true);

  const Spinner = () => (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
  );

  const defaultFormValues: UpdateArticleFormValues = {
    title: '',
    articleType: ArticleTypeEnum.PROJECT,
    authorName: currentAuthor?.name || undefined,
    translateDirection: (project?.translateDirection as TranslateDirection) || undefined,
    dateOfWriting: convertFromISO(new Date()),
    articleStatus: '',
    contentBlocks: [
      { id: uuid(), contentBlockType: 'TRANSLATE', translateStatus: 'no' },
      { id: uuid(), contentBlockType: 'VIDEO', videoUrl: '' },
      { id: uuid(), contentBlockType: 'QUOTE', translatable_text_text: '', translatable_text_editorState: null },
      { id: uuid(), contentBlockType: 'LINK_TO_SITE', siteUrl: '' },
      { id: uuid(), contentBlockType: 'SOCIAL_MEDIA', typeSocialMedia: '', socialMediaUrl: '' },
      { id: uuid(), contentBlockType: 'SECTION', translatable_text_sectionTitle: '', translatable_text_text: '', files: [], translatable_text_editorState: null },
    ],
  };

  //GET project by id
  useEffect(() => {
    if (!projectId) return;

    async function fetchFullProjectById() {
      try {
        setLoadingProgect(true);

        const result = await dispatch(getArticleById(projectId)).unwrap();

        const isEngDirection = result?.translateDirection === TranslateDirectionEnum.EN_TO_UK.toLocaleUpperCase();
        const sourceBlocks = isEngDirection
          ? (result?.contentBlocksEng ?? [])
          : (result?.contentBlocks ?? []);

        const editors: Record<string, EditorState> = {};
        const keys: Record<string, string> = {};

        const serverBlocks = sourceBlocks.map(block => ({
          ...block,
          id: block.id ?? uuid(),
          ...(block.contentBlockType === 'SECTION' ? { isNew: false } : {}),
        }));

        const mergedBlocks = [
          ...serverBlocks,
          ...defaultFormValues.contentBlocks.filter(
            defBlock => !serverBlocks.some(b => b.contentBlockType === defBlock.contentBlockType)
          ),
        ];

        mergedBlocks.forEach(block => {
          let editor;
          try {
            editor = block.translatable_text_editorState
              ? EditorState.createWithContent(convertFromRaw(block.translatable_text_editorState), decorator)
              : EditorState.createEmpty(decorator);
          } catch (err: any) {
            console.log('err', err);
            editor = EditorState.createEmpty(decorator);
          }

          editors[block.id] = editor;
          keys[block.id] = `${block.id}-init`;
        });

        setEditorStates(editors);
        setEditorKey(keys);

        setProject({
          ...result,
          title: isEngDirection ? result.titleEng : result.title,
          contentBlocks: mergedBlocks,
        });
      } catch (error) {
        console.log('error', error);
        router.push(`/admin/projects`);
        toast.error('Failed to fetch project');
      } finally {
        setLoadingProgect(false);
      }
    }
    fetchFullProjectById();
  }, [projectId, dispatch]);

  //Action for Save the project
  async function handleSubmit(
      values: UpdateArticleFormValues,
      { setSubmitting }: FormikHelpers<UpdateArticleFormValues>,
    ) {
      for (const url of deletedFiles) {
        try {
          await deleteFile(url);
        } catch (error: any) {
          console.log('Failed to delete file', url, error);
        }
      }

      const translateStatus = values.contentBlocks?.find(
        block => block.contentBlockType === 'TRANSLATE'
      )?.translateStatus ?? 'no';

      const isEngDirection = translateStatus === 'yes' && values.translateDirection === TranslateDirectionEnum.EN_TO_UK.toLocaleUpperCase();

      const { translateDirection, contentBlocks, ...rest } = values;

      const preparedData = isEngDirection
        ? {
            ...rest,
            titleEng: values.title,
            title: '',
            translateDirection: translateStatus === 'yes' ? translateDirection?.toUpperCase() : undefined,
            englishPublished: translateStatus === 'yes',
            contentBlocksEng: contentBlocks,
            contentBlocks: [],
            dateOfWriting: convertToISO(values.dateOfWriting),
          }
        : {
            ...rest,
            title: values.title,
            titleEng: '',
            translateDirection: translateStatus === 'yes' ? translateDirection?.toUpperCase() : undefined,
            englishPublished: translateStatus === 'yes',
            contentBlocks,
            contentBlocksEng: [],
            dateOfWriting: convertToISO(values.dateOfWriting),
          };

      setSubmitStatus('saving');

      try {
        const result = await handleThunk(
          updateArticle,
          { id: projectId, data: preparedData },
          setSubmitError,
        );
        // setProject(result);

        const translateFrom = values.translateDirection;

        if (result) {
          // ---- TRANSLATION ----
          if (translateStatus === 'yes') {
            setSubmitStatus('translating');
            try {
              await handleThunk(createTranslation, {id: projectId, translateFrom: translateFrom?.toUpperCase()}, setSubmitErrorTranslate);
              toast.success(`The translation was successfully created`);
            } catch (error) {
              setSubmitStatus('idle');
              console.log('error translate', error);
              toast.error(`Something go wrong with translation! ${error}`);
            } finally {
              setSubmitStatus('idle');
            }
          }

          setSubmitError('');
          setDeletedFiles([]);
          const message = pathname.includes('/edit')
            ? 'Your project was updated successfully!'
            : 'Your project was created successfully!';
          toast.success(message);
        }
      } catch (error) {
        setSubmitStatus('idle');
        toast.error(`Something go wrong! ${error}`);
      } finally {
        setSubmitStatus('idle');
        setSubmitting(false);
      }
    }

  //Action for publish the project
  async function handlePublish(projectId: number) {
    const result = await handleThunk(publishArticle, projectId, errMsg => {
      toast.error(errMsg);
    });

    if (result) {
      setProjectsStatus(true);
      toast.success(
        'Congratulations! Your project has been published successfully.',
      );
    }
  }

  const handleEditorChange = (
    id: string,
    values: any,
    newState: EditorState,
    setFieldValue: any,
  ) => {
    setEditorStates(prev => ({ ...prev, [id]: newState }));

    const content = newState.getCurrentContent();
    const raw = convertToRaw(content);

    const index = values.contentBlocks.findIndex(block => block.id === id);

    if (index === -1) return;

    setFieldValue(`contentBlocks.${index}.translatable_text_editorState`, raw);
    setFieldValue(`contentBlocks.${index}.translatable_text_text`, content.getPlainText());
  };

  if (loadingProject) {
    return (
      <div className="relative h-full">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <Formik<UpdateArticleFormValues>
        enableReinitialize
        initialValues={{
          title: project?.title || defaultFormValues.title,
          translateDirection: (project?.translateDirection as TranslateDirection) || undefined,
          authorName: project?.authorName || defaultFormValues.authorName,
          dateOfWriting:
            convertFromISO(project?.dateOfWriting) ||
            defaultFormValues.dateOfWriting,
          articleType: project?.articleType || defaultFormValues.articleType,
          articleStatus:
            project?.articleStatus || defaultFormValues.articleStatus,
          contentBlocks:
            Array.isArray(project?.contentBlocks) &&
            project.contentBlocks.length
              ? project.contentBlocks
              : defaultFormValues.contentBlocks,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, handleChange, isSubmitting, values, setFieldValue }) => {
          const translateBlockIndex = values.contentBlocks.findIndex(b => b.contentBlockType === 'TRANSLATE');

          return(
            <Form>
              <div className='mb-5'>
                <TranslateSection
                  translateBlockIndex={translateBlockIndex}
                  translateStatus={values.contentBlocks[translateBlockIndex]?.translateStatus ?? 'no'}
                  handleChange={handleChange}
                />
              </div>

              <div className="mb-5">
                <Input
                  onChange={handleChange}
                  required
                  id="title"
                  name="title"
                  type="text"
                  maxLength={undefined}
                  className="!bg-background-light w-full !h-[50px] px-5 rounded-lg !ring-0"
                  value={values?.title || ''}
                  label="Project title"
                  labelClass="!text-admin-700"
                  validationText={touched.title && errors.title ? errors.title : ''}
                />
              </div>

              <div className="mb-5">
                <div className="block text-medium2 mb-1 !text-admin-700">Choose the creation date</div>
                <DatePicker name="dateOfWriting" pickerId="project-creationDate" pickerWithTime={false} pickerType="single" pickerPlaceholder="Choose date" pickerValue={values?.dateOfWriting} />
              </div>

              <div className="mb-5">
                <AuthorField usersList={usersList} defaultValue={project?.authorName}  />
              </div>

              <FieldArray name="contentBlocks">
                {({ push, remove }) => {
                  const initialBlocks = values.contentBlocks?.slice(0, 6) || [];
                  const additionalBlocks = values.contentBlocks?.slice(6) || [];

                  return (
                    <div className="mb-5">
                      {/* Base blocks */}
                      {initialBlocks.map(block => {
                        const blockIndex = values.contentBlocks.findIndex(item => item.id === block.id);
                        return (
                          <React.Fragment key={block.id}>
                            {block?.contentBlockType === 'VIDEO' && (
                              <div className="mb-4">
                                <Input
                                  id={`contentBlocks.${blockIndex}.videoUrl`}
                                  name={`contentBlocks.${blockIndex}.videoUrl`}
                                  label="Video link"
                                  labelClass="!text-admin-700"
                                  className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                                  value={block.videoUrl}
                                  onChange={handleChange}
                                />
                              </div>
                            )}

                            {block.contentBlockType === 'QUOTE' && (
                              <div className="mb-4">
                                <div>
                                  <label className="block mb-2 text-admin-700 font-medium">Quote text</label>
                                  <TextEditor key={editorKey[block.id]} value={editorStates[block.id] || EditorState.createEmpty(decorator)} onChange={newState => handleEditorChange(block.id, values, newState, setFieldValue)} />
                                </div>
                              </div>
                            )}

                            {block.contentBlockType === 'LINK_TO_SITE' && (
                              <div className="mb-4">
                                <Input
                                  id={`contentBlocks.${blockIndex}.siteUrl`}
                                  name={`contentBlocks.${blockIndex}.siteUrl`}
                                  label="Link to web-site"
                                  labelClass="!text-admin-700"
                                  className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                                  value={block.siteUrl}
                                  onChange={handleChange}
                                />
                              </div>
                            )}

                            {block.contentBlockType === 'SOCIAL_MEDIA' && (
                              <div className="flex gap-4">
                                <div className="w-1/2 mb-4">
                                  <Select
                                    label="Change type social media (if needed)"
                                    adminSelectClass={true}
                                    name={`contentBlocks.${blockIndex}.typeSocialMedia`}
                                    labelClass="!text-admin-700"
                                    placeholder="Media types"
                                    onChange={handleChange}
                                    options={typeSocialMediaList}
                                    parentClassname="h-[50px]"
                                  />
                                </div>

                                <div className="w-1/2 mb-4">
                                  <Input
                                    id={`contentBlocks.${blockIndex}.socialMediaUrl`}
                                    name={`contentBlocks.${blockIndex}.socialMediaUrl`}
                                    label="Link to social media"
                                    labelClass="!text-admin-700"
                                    className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                                    value={block.socialMediaUrl}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                            )}

                            {/* TEXT block */}
                            {block.contentBlockType === 'SECTION' && (
                              <div className="mb-5">
                                <Accordion title={`Section #1 - ${block.translatable_text_sectionTitle}`} classNameTop="min-h-14">
                                  <div className="flex gap-4">
                                    <div className="w-1/2 h-[442px] flex flex-col flex-1 block-with-photo">
                                      <div className="mb-4">
                                        <Input
                                          onChange={handleChange}
                                          id={`contentBlocks.${blockIndex}.translatable_text_sectionTitle`}
                                          name={`contentBlocks.${blockIndex}.translatable_text_sectionTitle`}
                                          type="text"
                                          className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                                          value={block.translatable_text_sectionTitle}
                                          label="Section title"
                                          labelClass="!text-admin-700"
                                        />
                                      </div>
                                      <div className="flex-1 flex flex-col block-with-editor">
                                        <div className="block text-medium2 mb-1 text-admin-700 ">Text block</div>
                                        <TextEditor
                                          key={editorKey[block.id]}
                                          value={editorStates[block.id] || EditorState.createEmpty(decorator)}
                                          onChange={newState => handleEditorChange(block.id, values, newState, setFieldValue)}
                                        />
                                      </div>
                                    </div>
                                    <div className="w-1/2 h-[442px]">
                                      <ImageLoading
                                        articleId={projectId}
                                        label="Add photo"
                                        classBlock="h-[100px]"
                                        contentType={ArticleTypeEnum.PROJECT}
                                        uploadedUrls={block.files || []}
                                        positionBlockImg={true}
                                        onFilesChange={(files, deleted) => {
                                          setFieldValue(`contentBlocks.${blockIndex}.files`, files);
                                          setDeletedFiles(prev => [...prev, ...(deleted || [])]);
                                        }}
                                      />
                                    </div>
                                  </div>
                                </Accordion>
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}

                      {additionalBlocks.map((block, pairIndex) => {
                        const index = pairIndex + 6;
                        const blockIndex = values.contentBlocks.findIndex(item => item.id === block.id);

                        if (block.contentBlockType !== 'SECTION') {
                          return null;
                        }

                        return (
                          <div key={index} className="mb-5">
                            <Accordion
                              title={`Section #${pairIndex + 2} - ${block.translatable_text_sectionTitle}`}
                              initState={block.isNew || false}
                              actions={
                                <button
                                  type="button"
                                  onClick={() => {
                                    const blockId = block.id;
                                    // remove(index);
                                    if (block.files) {
                                      setDeletedFiles(prev => [...prev, ...block.files]);
                                    }

                                    const blockIndex = values.contentBlocks.findIndex(b => b.id === block.id);
                                    if (blockIndex !== -1) remove(blockIndex);

                                    setEditorStates(prev => {
                                      const newState = { ...prev };
                                      delete newState[blockId];
                                      return newState;
                                    });

                                    setEditorKey(prev => {
                                      const newKey = { ...prev };
                                      delete newKey[blockId];
                                      return newKey;
                                    });
                                  }}
                                  className="my-1 mr-3 p-3 bg-red-700 text-white rounded-md self-start hover:bg-red-500 duration-500"
                                >
                                  <BasketIcon color="white" />
                                </button>
                              }
                            >
                              <div className={`flex gap-4 mb-3 ${pairIndex % 2 === 0 ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className="w-1/2 h-[442px] flex flex-col">
                                  <div className="mb-4">
                                    <Input
                                      onChange={handleChange}
                                      id={`contentBlocks.${blockIndex}.translatable_text_sectionTitle`}
                                      name={`contentBlocks.${blockIndex}.translatable_text_sectionTitle`}
                                      type="text"
                                      className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                                      value={block.translatable_text_sectionTitle}
                                      label="Section title"
                                      labelClass="!text-admin-700"
                                    />
                                  </div>

                                  <div className="flex-1 flex flex-col">
                                    <div className="block text-medium2 mb-1 text-admin-700 ">Text block</div>
                                    <TextEditor key={editorKey[block.id]} value={editorStates[block.id] || EditorState.createEmpty(decorator)} onChange={newState => handleEditorChange(block.id, values, newState, setFieldValue)} />
                                  </div>
                                </div>

                                <div className="w-1/2 h-[442px]">
                                  <ImageLoading
                                    articleId={projectId}
                                    maxFiles={1}
                                    label="Add photo"
                                    classBlock="h-[100px]"
                                    contentType={ArticleTypeEnum.PROJECT}
                                    uploadedUrls={block?.files || []}
                                    positionBlockImg={true}
                                    onFilesChange={(files, deleted) => {
                                      setFieldValue(`contentBlocks.${blockIndex}.files`, files);
                                      setDeletedFiles(prev => [...prev, ...(deleted || [])]);
                                    }}
                                  />
                                </div>
                              </div>
                            </Accordion>
                          </div>
                        );
                      })}

                      {/* Added blocks */}
                      <button
                        type="button"
                        onClick={() => {
                          const blockId = uuid();
                          push({
                            id: blockId,
                            contentBlockType: 'SECTION',
                            translatable_text_sectionTitle: '',
                            translatable_text_text: '',
                            files: [],
                            isNew: true,
                          });

                          setEditorStates(prev => ({
                            ...prev,
                            [blockId]: EditorState.createEmpty(decorator),
                          }));

                          setEditorKey(prev => ({
                            ...prev,
                            [blockId]: `${blockId}-${Date.now()}`,
                          }));
                        }}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                      >
                        Add new block pair
                      </button>
                    </div>
                  );
                }}
              </FieldArray>

              {submitError && <div className="text-red-700 text-medium1 mt-4"> {submitError}</div>}

              <div className="mt-10">
                <sup className="font-bold text-red-600 text-small2">*</sup>
                <em>You must save the page before you can preview or publish it</em>
              </div>

              <div className="my-4">
                <sup className="font-bold text-red-600 text-small2">*</sup>
                After any changes you need to click the <strong>Save</strong> button
              </div>

              <div className="flex gap-x-6 mt-2">
                <Button type="submit" disabled={isSubmitting || submitStatus !== 'idle'} 
                className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-[0.8] duration-500">
                  {submitStatus === 'saving' && (
                    <div className='flex items-center'>
                      <Spinner />
                      <span className='ml-2'>Saving...</span>
                    </div>
                  )}
                  {submitStatus === 'translating' && (
                    <div className='flex items-center'>
                      <Spinner />
                      <span className='ml-2'>Translating...</span>
                    </div>
                  )}
                  {submitStatus === 'idle' && 'Save'}
                </Button>

                <LinkBtn href={`/admin/projects/preview?id=${projectId}`} targetLink="_self" className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-80 duration-300">
                  Preview
                </LinkBtn>

                {(project?.articleStatus !== 'PUBLISHED' && !projectStatus) && (
                  <Button onClick={() => handlePublish(projectId)} type="button" className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-80 duration-300">
                    Publish
                  </Button>
                )}
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default ProjectContent;
