'use client';

import { useAppDispatch } from '@/store/hook';
import { usePathname } from 'next/navigation';
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

export interface UpdateArticleFormValues {
  title: string;
  articleType: ArticleType;
  authorId?: number;
  articleStatus: string;
  contentBlocks: any[];
  dateOfWriting: any;
}

const validationSchema = Yup.object({
  title: Yup.string().required('Title field cannot be empty'),
  authorId: Yup.number().required('Author field cannot be empty'),
});

function ProjectContent({ projectId }: { projectId: number }) {
  const [project, setProject] = useState<GetArticleByIdResponseDTO | null>(
    null,
  );

  const dispatch = useAppDispatch();
  const handleThunk = useHandleThunk();
  const pathname = usePathname();

  const { deleteFile } = useImageLoading({
    articleId: project?.id,
    contentType: ArticleTypeEnum.PROJECT,
  });

  const [submitError, setSubmitError] = useState('');

  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);

  const [editorStates, setEditorStates] = useState<Record<string, EditorState>>(
    {},
  );
  const [editorKey, setEditorKey] = useState<Record<string, string>>({});

  const { usersList, currentAuthor } = useUsers(true);
  const [defaultAuthorId, setDefaultAuthorId] = useState<number>();

  useEffect(() => {
    setDefaultAuthorId(project?.authorId ?? currentAuthor?.id);
  }, [project?.authorId, currentAuthor]);

  const defaultFormValues: UpdateArticleFormValues = {
    title: '',
    articleType: ArticleTypeEnum.PROJECT,
    authorId: defaultAuthorId ? Number(defaultAuthorId) : undefined,
    dateOfWriting: convertFromISO(new Date()),
    articleStatus: '',
    contentBlocks: [
      { id: uuid(), contentBlockType: 'VIDEO', videoUrl: '' },
      {
        id: uuid(),
        contentBlockType: 'QUOTE',
        translatable_text_text: '',
        editorState: null,
      },
      { id: uuid(), contentBlockType: 'LINK_TO_SITE', siteUrl: '' },
      {
        id: uuid(),
        contentBlockType: 'SOCIAL_MEDIA',
        typeSocialMedia: '',
        socialMediaUrl: '',
      },
      {
        id: uuid(),
        contentBlockType: 'SECTION',
        sectionTitle: '',
        translatable_text_text: '',
        files: [],
        editorState: null,
      },
    ],
  };

  //GET project by id
  useEffect(() => {
    if (!projectId) return;

    async function fetchFullProjectById() {
      try {
        const result = await dispatch(
          getArticleById({
            id: projectId,
          }),
        ).unwrap();

        const editors: Record<string, EditorState> = {};
        const keys: Record<string, string> = {};

        const blocksWithId = (result?.contentBlocks ?? []).map(block => ({
          ...block,
          id: block.id ?? uuid(),
          isNew: false,
        }));

        blocksWithId.forEach(block => {
          let editor;

          try {
            if (block.editorState) {
              const content = convertFromRaw(block.editorState);
              editor = EditorState.createWithContent(content);
            } else {
              editor = EditorState.createEmpty();
            }
          } catch (err: any) {
            console.log('err', err);
            editor = EditorState.createEmpty();
          }

          editors[block.id] = editor;
          keys[block.id] = `${block.id}-init`;
        });

        setEditorStates(editors);

        setEditorKey(keys);

        setProject({
          ...result,
          contentBlocks: blocksWithId,
        });
      } catch (error) {
        console.log('error', error);
        toast.error('Failed to fetch project');
      }
    }
    fetchFullProjectById();
  }, [projectId, dispatch]);

  //Action for Save the project
  async function handleSubmit(
    values: UpdateArticleFormValues,
    { setSubmitting }: FormikHelpers<UpdateArticleFormValues>,
  ) {
    let payload = { ...values };

    for (const url of deletedFiles) {
      try {
        await deleteFile(url);
      } catch (error: any) {
        console.log('Failed to delete file', url, error);
      }
    }

    payload = {
      ...values,
      dateOfWriting: convertToISO(values.dateOfWriting),
    };

    try {
      const result = await handleThunk(
        updateArticle,
        { id: projectId, data: payload },
        setSubmitError,
      );
      setProject(result);

      if (result) {
        setSubmitError('');
        const message = pathname.includes('/edit')
          ? 'Your project was updated successfully!'
          : 'Your project was created successfully!';
        toast.success(message);
      }

      setDeletedFiles([]);
    } catch (error) {
      toast.error(`Something go wrong! ${error}`);
    } finally {
      setSubmitting(false);
    }
  }

  //Action for publish the project
  async function handlePublish(projectId: number) {
    const result = await handleThunk(publishArticle, projectId, errMsg => {
      toast.error(errMsg);
    });

    if (result) {
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

    setFieldValue(`contentBlocks.${index}.editorState`, raw);
    setFieldValue(
      `contentBlocks.${index}.translatable_text_text`,
      content.getPlainText(),
    );
  };

  return (
    <div>
      <Formik<UpdateArticleFormValues>
        enableReinitialize
        initialValues={{
          title: project?.title || defaultFormValues.title,
          authorId: defaultAuthorId ? Number(defaultAuthorId) : undefined,
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
        {({
          errors,
          touched,
          handleChange,
          isSubmitting,
          values,
          setFieldValue,
        }) => (
          <Form>
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
                validationText={
                  touched.title && errors.title ? errors.title : ''
                }
              />
            </div>

            <div className="mb-5">
              <div className="block text-medium2 mb-1 !text-admin-700">
                Choose the creation date
              </div>
              <DatePicker
                name="dateOfWriting"
                pickerId="project-creationDate"
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

            <FieldArray name="contentBlocks">
              {({ push, remove }) => {
                const initialBlocks = values.contentBlocks?.slice(0, 5) || [];
                const additionalBlocks = values.contentBlocks?.slice(5) || [];

                return (
                  <div className="mb-5">
                    {/* Base blocks */}
                    {initialBlocks.map(block => {
                      const blockIndex = values.contentBlocks.findIndex(
                        item => item.id === block.id,
                      );
                      return (
                        <React.Fragment key={block.id}>
                          {block?.contentBlockType === 'VIDEO' && (
                            <div className="mb-4">
                              <Input
                                id={`contentBlocks.${blockIndex}.videoUrl`}
                                name={`contentBlocks.${blockIndex}.videoUrl`}
                                label="Video link"
                                labelClass="!text-admin-700"
                                className="!bg-background-light w-full h-[70px] px-5 rounded-lg !ring-0"
                                value={block.videoUrl}
                                onChange={handleChange}
                              />
                            </div>
                          )}

                          {block.contentBlockType === 'QUOTE' && (
                            <div className="mb-4">
                              <div>
                                <label className="block mb-2 text-admin-700 font-medium">
                                  Quote text
                                </label>
                                <TextEditor
                                  key={editorKey[block.id]}
                                  value={
                                    editorStates[block.id] ||
                                    EditorState.createEmpty()
                                  }
                                  onChange={newState =>
                                    handleEditorChange(
                                      block.id,
                                      values,
                                      newState,
                                      setFieldValue,
                                    )
                                  }
                                />
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
                                className="!bg-background-light w-full h-[70px] px-5 rounded-lg !ring-0"
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
                                  parentClassname="h-[70px]"
                                />
                              </div>

                              <div className="w-1/2 mb-4">
                                <Input
                                  id={`contentBlocks.${blockIndex}.socialMediaUrl`}
                                  name={`contentBlocks.${blockIndex}.socialMediaUrl`}
                                  label="Link to social media"
                                  labelClass="!text-admin-700"
                                  className="!bg-background-light w-full h-[70px] px-5 rounded-lg !ring-0"
                                  value={block.socialMediaUrl}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          )}

                          {/* TEXT block */}
                          {block.contentBlockType === 'SECTION' && (
                            <div className="mb-5">
                              <Accordion
                                title={`Section #1 - ${block.sectionTitle}`}
                                classNameTop="min-h-14"
                              >
                                <div className="flex gap-4">
                                  <div className="w-1/2 h-[442px] flex flex-col flex-1">
                                    <div className="mb-4">
                                      <Input
                                        onChange={handleChange}
                                        id={`contentBlocks.${blockIndex}.sectionTitle`}
                                        name={`contentBlocks.${blockIndex}.sectionTitle`}
                                        type="text"
                                        className="!bg-background-light w-full h-[70px] px-5 rounded-lg !ring-0"
                                        value={block.sectionTitle}
                                        label="Section title"
                                        labelClass="!text-admin-700"
                                      />
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                      <div className="block text-medium2 mb-1 text-admin-700 ">
                                        Text block
                                      </div>
                                      <TextEditor
                                        key={editorKey[block.id]}
                                        value={
                                          editorStates[block.id] ||
                                          EditorState.createEmpty()
                                        }
                                        onChange={newState =>
                                          handleEditorChange(
                                            block.id,
                                            values,
                                            newState,
                                            setFieldValue,
                                          )
                                        }
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
                                        setFieldValue(
                                          `contentBlocks.${blockIndex}.files`,
                                          files,
                                        );
                                        setDeletedFiles(prev => [
                                          ...prev,
                                          ...(deleted || []),
                                        ]);
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
                      const index = pairIndex + 5;
                      const blockIndex = values.contentBlocks.findIndex(
                        item => item.id === block.id,
                      );

                      if (block.contentBlockType !== 'SECTION') {
                        return null;
                      }

                      return (
                        <div key={index} className="mb-5">
                          <Accordion
                            title={`Section #${pairIndex + 2} - ${
                              block.sectionTitle
                            }`}
                            initState={block.isNew || false}
                            actions={
                              <button
                                type="button"
                                onClick={() => {
                                  const blockId = block.id;
                                  // remove(index);
                                  if (block.files) {
                                    setDeletedFiles(prev => [
                                      ...prev,
                                      ...block.files,
                                    ]);
                                  }

                                  const blockIndex =
                                    values.contentBlocks.findIndex(
                                      b => b.id === block.id,
                                    );
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
                            <div
                              className={`flex gap-4 mb-3 ${
                                pairIndex % 2 === 0
                                  ? 'flex-row-reverse'
                                  : 'flex-row'
                              }`}
                            >
                              <div className="w-1/2 h-[442px] flex flex-col">
                                <div className="mb-4">
                                  <Input
                                    onChange={handleChange}
                                    id={`contentBlocks.${blockIndex}.sectionTitle`}
                                    name={`contentBlocks.${blockIndex}.sectionTitle`}
                                    type="text"
                                    className="!bg-background-light w-full h-[70px] px-5 rounded-lg !ring-0"
                                    value={block.sectionTitle}
                                    label="Section title"
                                    labelClass="!text-admin-700"
                                  />
                                </div>

                                <div className="flex-1 flex flex-col">
                                  <div className="block text-medium2 mb-1 text-admin-700 ">
                                    Text block
                                  </div>
                                  <TextEditor
                                    key={editorKey[block.id]}
                                    value={
                                      editorStates[block.id] ||
                                      EditorState.createEmpty()
                                    }
                                    onChange={newState =>
                                      handleEditorChange(
                                        block.id,
                                        values,
                                        newState,
                                        setFieldValue,
                                      )
                                    }
                                  />
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
                                    setFieldValue(
                                      `contentBlocks.${blockIndex}.files`,
                                      files,
                                    );
                                    setDeletedFiles(prev => [
                                      ...prev,
                                      ...(deleted || []),
                                    ]);
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
                          sectionTitle: '',
                          text: '',
                          files: [],
                          isNew: true,
                        });

                        setEditorStates(prev => ({
                          ...prev,
                          [blockId]: EditorState.createEmpty(),
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

            {submitError && (
              <div className="text-red-700 text-medium1 mt-4">
                {' '}
                {submitError}
              </div>
            )}

            <div className="mt-10">
              <sup className="font-bold text-red-600 text-small2">*</sup>
              <em>
                You must save the page before you can preview or publish it
              </em>
            </div>

            <div className="my-4">
              <sup className="font-bold text-red-600 text-small2">*</sup>
              After any changes you need to click the <strong>Save</strong>{' '}
              button
            </div>

            <div className="flex gap-x-6 mt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-[0.8] duration-500"
              >
                Save
              </Button>

              <LinkBtn
                href={`/admin/projects/preview?id=${projectId}`}
                targetLink="_self"
                className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-80 duration-300"
              >
                Preview
              </LinkBtn>

              {project?.articleStatus !== 'PUBLISHED' && (
                <Button
                  onClick={() => handlePublish(projectId)}
                  type="button"
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
  );
}

export default ProjectContent;
