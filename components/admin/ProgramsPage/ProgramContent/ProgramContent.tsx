'use client';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import LinkBtn from '@/components/shared/LinkBtn';
import Select from '@/components/shared/Select';
import { getArticleById, publishArticle, updateArticle } from '@/store/article-content/action';
import { useAppDispatch } from '@/store/hook';
import { GetArticleByIdResponseDTO } from '@/utils/article-content/type/interfaces';
import { ArticleType, ArticleTypeEnum } from '@/utils/ArticleType';
import useHandleThunk from '@/utils/useHandleThunk';
import { FieldArray, Form, Formik, FormikHelpers } from 'formik';
import { usePathname } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import DatePicker from '../../helperComponents/DatePicker/DatePicker';
import ImageLoading from '../../helperComponents/ImageLoading/ImageLoading';
import TimePicker from '../../helperComponents/TimePicker/TimePicker';
import { useUsers } from '@/utils/hooks/useUsers';
import { convertFromISO } from '../../helperComponents/DatePicker/utils/convertFromISO';
import { convertToISO } from '../../helperComponents/DatePicker/utils/convertToISO';
import { v4 as uuid } from 'uuid';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import TextEditor from '@/components/TextEditor/TextEditor';

export interface UpdateArticleFormValues {
  title: string;
  articleType: ArticleType;
  authorId?: number;
  articleStatus: string;
  contentBlocks: any[];
  customCreationDate: any;
}

const validationSchema = Yup.object({
  title: Yup.string().required('Title field cannot be empty'),
  authorId: Yup.number().required('Author field cannot be empty'),

  contentBlocks: Yup.array().of(
    Yup.object({
      contentBlockType: Yup.string().required(),

      startTime: Yup.object({
        hour: Yup.string().nullable(),
        minute: Yup.string().nullable(),
        period: Yup.string().oneOf(['AM', 'PM']).nullable(),
      }).nullable(),

      endTime: Yup.object({
        hour: Yup.string().nullable(),
        minute: Yup.string().nullable(),
        period: Yup.string().oneOf(['AM', 'PM']).nullable(),
      })
        .nullable()
        .when(['startTime', 'contentBlockType'], ([startTime, contentBlockType], schema) => {
          if (contentBlockType !== 'SCHEDULE_INFO') return schema;

          return schema.test('is-after-start', 'End time must be later than start time', endTime => {
            if (!startTime?.hour || !endTime?.hour) return true;

            const toMinutes = (t: any) => {
              let hours = Number(t.hour);
              const minutes = Number(t.minute) || 0;
              if (t.period === 'PM' && hours !== 12) hours += 12;
              if (t.period === 'AM' && hours === 12) hours = 0;
              return hours * 60 + minutes;
            };

            const start = toMinutes(startTime);
            const end = toMinutes(endTime);

            return end > start;
          });
        }),
    }),
  ),
});

function ProgramContent({ programId }: { programId: number }) {
  const dispatch = useAppDispatch();
  const handleThunk = useHandleThunk();
  const pathname = usePathname();

  const [program, setProgram] = useState<GetArticleByIdResponseDTO | null>(null);
  const [submitError, setSubmitError] = useState('');

  const { usersList, currentAuthor } = useUsers(true);
  const [defaultAuthorId, setDefaultAuthorId] = useState<number>();

  const [editorStates, setEditorStates] = useState<Record<string, EditorState>>({});
  const [editorKey, setEditorKey] = useState<Record<string, string>>({});

  const defaultFormValues: UpdateArticleFormValues = useMemo(
    () => ({
      title: '',
      articleType: ArticleTypeEnum.PROGRAM,
      customCreationDate: convertFromISO(new Date()),
      authorId: defaultAuthorId ? Number(defaultAuthorId) : undefined,
      articleStatus: '',
      contentBlocks: [
        { id: uuid(), contentBlockType: 'SUB_TITLE_PROGRAM', text: '' },
        { id: uuid(), contentBlockType: 'DESCRIPTION_PROGRAM', text: '', editorState: null },
        { id: uuid(), contentBlockType: 'DATE_PROGRAM', date: '' },
        { id: uuid(), contentBlockType: 'VIDEO', videoUrl: '' },
        { id: uuid(), contentBlockType: 'SECTION_WITH_PHOTO', sectionTitle: '', text: '', files: [], editorState: null },
        { id: uuid(), contentBlockType: 'SECTION_WITH_TEXT', sectionTitle: '', text1: '', text2: '', editorState1: null, editorState2: null },
        { id: uuid(), contentBlockType: 'SCHEDULE_TITLE', title: '' },
        { id: uuid(), contentBlockType: 'SCHEDULE_POSTER', files: [] },
        { id: uuid(), contentBlockType: 'SCHEDULE_INFO', date: '', startTime: { hour: '', minute: '', period: 'AM' }, endTime: { hour: '', minute: '', period: 'AM' }, title: '', location: '' },
      ],
    }),
    [defaultAuthorId],
  );

  // Handle editor changes
  const handleEditorChange = (blockIndex: number, blockId: string, field: 'editorState1' | 'editorState2' | 'editorState', rawField: 'text1' | 'text2' | 'text', newState: EditorState, setFieldValue: any) => {
    const editorKey = `${blockId}_${rawField}`;

    setEditorStates(prev => ({
      ...prev,
      [editorKey]: newState,
    }));

    const content = newState.getCurrentContent();
    const raw = convertToRaw(content);

    // Update Formik field value
    setFieldValue(`contentBlocks.${blockIndex}.${field}`, raw);

    setFieldValue(`contentBlocks.${blockIndex}.${rawField}`, content.getPlainText());
  };

  useEffect(() => {
    if (program?.authorId) {
      setDefaultAuthorId(program.authorId);
    } else if (currentAuthor?.id) {
      setDefaultAuthorId(currentAuthor.id);
    }
  }, [program?.authorId, currentAuthor]);

  //GET program by id
  useEffect(() => {
    if (!programId) return;

    async function fetchFullProgramById() {
      try {
        const result = await dispatch(
          getArticleById({
            id: programId,
          }),
        ).unwrap();

        const editors: Record<string, EditorState> = {};
        const keys: Record<string, string> = {};

        const blocksWithId = result.contentBlocks?.map(block => ({ ...block, id: block.id || uuid() })) || [];

        blocksWithId.forEach(block => {
          if (block.contentBlockType === 'DESCRIPTION_PROGRAM' || block.contentBlockType === 'SECTION_WITH_PHOTO') {
            let editor;

            try {
              const rawContent = block.editorState;
              if (rawContent) {
                const content = convertFromRaw(rawContent);
                editor = EditorState.createWithContent(content);
              } else {
                editor = EditorState.createEmpty();
              }
            } catch (err: any) {
              console.error('Error loading single editor state:', err);
              editor = EditorState.createEmpty();
            }
            editors[`${block.id}_text`] = editor;
            keys[`${block.id}_text`] = `${block.id}_text-init`;
          }

          if (block.contentBlockType === 'SECTION_WITH_TEXT') {
            // --- 1. init Text 1 ---
            let editor1 = EditorState.createEmpty();
            try {
              const rawContent1 = block.editorState1;
              if (rawContent1) {
                const content = convertFromRaw(rawContent1);
                editor1 = EditorState.createWithContent(content);
              }
            } catch (err) {
              console.error('Error loading text1 editor state:', err);
            }
            editors[`${block.id}_text1`] = editor1;
            keys[`${block.id}_text1`] = `${block.id}_text1-init`;

            // --- 2. init Text 2 ---
            let editor2 = EditorState.createEmpty();
            try {
              const rawContent2 = block.editorState2;
              if (rawContent2) {
                const content = convertFromRaw(rawContent2);
                editor2 = EditorState.createWithContent(content);
              }
            } catch (err) {
              console.error('Error loading text2 editor state:', err);
            }
            editors[`${block.id}_text2`] = editor2;
            keys[`${block.id}_text2`] = `${block.id}_text2-init`;
          }
        });

        setEditorStates(editors);

        setEditorKey(keys);

        setProgram({ ...result, contentBlocks: blocksWithId });
      } catch (error) {
        console.log('error', error);
        toast.error('Failed to fetch program');
      }
    }

    fetchFullProgramById();
  }, [programId, dispatch]);

  async function handleSubmit(values: UpdateArticleFormValues, { setSubmitting }: FormikHelpers<UpdateArticleFormValues>) {
    console.log('values', values);
    const normalized = {
      ...values,
      customCreationDate: convertToISO(values.customCreationDate),
      contentBlocks: values.contentBlocks.map(block => {
        if (block.contentBlockType === 'SCHEDULE_INFO') {
          const fixTime = (t: any) => ({
            hour: t?.hour || '',
            minute: t?.minute || '00',
            period: t?.period || 'AM',
          });

          return {
            ...block,
            startTime: fixTime(block.startTime),
            endTime: fixTime(block.endTime),
          };
        }
        return block;
      }),
    };

    // console.log('normalized', normalized);

    try {
      const result = await handleThunk(updateArticle, { id: programId, data: normalized }, setSubmitError);
      setProgram(result);
      if (result) {
        setSubmitError('');
        const message = pathname.includes('/edit') ? 'Your program was updated successfully!' : 'Your program was created successfully!';
        toast.success(message);
      }
    } catch (error) {
      toast.error(`Something go wrong! ${error}`);
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePublish(programId: number) {
    const result = await handleThunk(publishArticle, programId, errMsg => {
      toast.error(errMsg);
    });

    if (result) {
      toast.success('Congratulations! Your program has been published successfully.');
    }
  }

  return (
    <div>
      <Formik<UpdateArticleFormValues>
        enableReinitialize
        initialValues={{
          title: program?.title || defaultFormValues.title,
          customCreationDate: program?.customCreationDate || defaultFormValues.customCreationDate,
          authorId: defaultAuthorId ? Number(defaultAuthorId) : undefined,
          articleType: program?.articleType || defaultFormValues.articleType,
          articleStatus: program?.articleStatus || defaultFormValues.articleStatus,
          contentBlocks: Array.isArray(program?.contentBlocks) && program.contentBlocks.length ? program.contentBlocks : defaultFormValues.contentBlocks,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, handleChange, isSubmitting, values, setFieldValue }) => (
          <Form>
            <div className="mb-5">
              <Input
                onChange={handleChange}
                required
                id="title"
                name="title"
                type="text"
                maxLength={undefined}
                className="!bg-background-light w-full h-[70px] px-5 rounded-lg !ring-0"
                value={values?.title || ''}
                label="Program title"
                labelClass="!text-admin-700"
                validationText={touched.title && errors.title ? errors.title : ''}
              />
            </div>

            <div className="mb-5">
              <div className="block text-medium2 mb-1 !text-admin-700">Choose the creation date</div>
              <DatePicker name="customCreationDate" pickerId="project-creationDate" pickerWithTime={false} pickerType="single" pickerPlaceholder="Choose date" pickerValue={values?.customCreationDate} />
            </div>

            <div className="mb-5">
              <Select label="Change Author (if needed)" adminSelectClass={true} name="authorId" required labelClass="!text-admin-700" onChange={handleChange} options={usersList} />
            </div>

            <FieldArray name="contentBlocks">
              {({ push, remove, insert }) => {
                const sectionIndexes = values.contentBlocks.map((b, i) => (b.contentBlockType === 'SECTION_WITH_PHOTO' || b.contentBlockType === 'SECTION_WITH_TEXT' ? i : -1)).filter(i => i !== -1);

                const videoIndex = values.contentBlocks.findIndex(b => b.contentBlockType === 'VIDEO');
                const insertPosition = sectionIndexes.length > 0 ? sectionIndexes[sectionIndexes.length - 1] : videoIndex !== -1 ? videoIndex : values.contentBlocks.length - 1;

                const lastPerformanceBlock = [...values.contentBlocks]
                  .map((b, i) => (b.contentBlockType === 'SCHEDULE_INFO' ? i : -1))
                  .filter(i => i !== -1)
                  .pop();

                return (
                  <div className="mb-5">
                    {values.contentBlocks.map((block, index) => {
                      const photoBlocksBefore = values.contentBlocks.slice(0, index).filter(b => b.contentBlockType === 'SECTION_WITH_PHOTO').length;
                      const isEven = photoBlocksBefore % 2 === 0;

                      return (
                        <React.Fragment key={block.id}>
                          {block.contentBlockType === 'SUB_TITLE_PROGRAM' && (
                            <Input
                              id={`contentBlocks.${index}.text`}
                              name={`contentBlocks.${index}.text`}
                              label="Second title"
                              labelClass="!text-admin-700"
                              className="!bg-background-light w-full h-[70px] px-5 rounded-lg !ring-0 mb-5"
                              value={block.text}
                              onChange={handleChange}
                            />
                          )}

                          {block.contentBlockType === 'DESCRIPTION_PROGRAM' && (
                            <div>
                              <div className="mb-2 !text-admin-700">Description program</div>
                              <TextEditor
                                key={editorKey[`${block.id}_text`]}
                                value={editorStates[`${block.id}_text`] || EditorState.createEmpty()}
                                onChange={newState => handleEditorChange(index, block.id, 'editorState', 'text', newState, setFieldValue)}
                              />
                            </div>
                          )}

                          {block.contentBlockType === 'DATE_PROGRAM' && (
                            <div className="mb-5">
                              <label htmlFor={`contentBlocks.${index}.date`} className="block text-medium2 mb-1 !text-admin-700">
                                Choose the date of the event
                              </label>
                              <DatePicker name={`contentBlocks.${index}.date`} pickerId={`dateProgram-${index}`} pickerWithTime={false} pickerType="range" pickerPlaceholder="Choose date" pickerValue={block.date} />
                            </div>
                          )}

                          {block.contentBlockType === 'VIDEO' && (
                            <Input
                              id={`contentBlocks.${index}.videoUrl`}
                              name={`contentBlocks.${index}.videoUrl`}
                              label="Video URL"
                              labelClass="!text-admin-700"
                              className="!bg-background-light w-full px-5 rounded-lg !ring-0 mb-5"
                              value={block.videoUrl}
                              onChange={handleChange}
                            />
                          )}

                          {block.contentBlockType === 'SECTION_WITH_PHOTO' && (
                            <div className="mb-5">
                              <div className={`flex gap-4 mb-3 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
                                <div className="w-1/2">
                                  <Input
                                    onChange={handleChange}
                                    id={`contentBlocks.${index}.sectionTitle`}
                                    name={`contentBlocks.${index}.sectionTitle`}
                                    type="text"
                                    className="!bg-background-light w-full h-[70px] px-5 rounded-lg !ring-0"
                                    value={block.sectionTitle}
                                    label="Section title"
                                    labelClass="!text-admin-700"
                                  />

                                  <div>
                                    <div className="mb-2 !text-admin-700">Text block</div>
                                    <TextEditor
                                      key={editorKey[`${block.id}_text`]}
                                      value={editorStates[`${block.id}_text`] || EditorState.createEmpty()}
                                      onChange={newState => handleEditorChange(index, block.id, 'editorState', 'text', newState, setFieldValue)}
                                    />
                                  </div>
                                </div>

                                <div className="w-1/2">
                                  <ImageLoading
                                    articleId={programId}
                                    maxFiles={1}
                                    label="Add photo (This photo will be the main photo in the program card)"
                                    classBlock="h-[100px]"
                                    previewSize={200}
                                    positionBlockImg={true}
                                    contentType={ArticleTypeEnum.PROGRAM}
                                    uploadedUrls={block?.files || []}
                                    onFilesChange={files => setFieldValue(`contentBlocks.${index}.files`, files)}
                                  />
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  const blockIndex = values.contentBlocks.findIndex(b => b.id === block.id);
                                  if (blockIndex !== -1) {
                                    remove(blockIndex);
                                  }
                                  setEditorStates(prev => {
                                    const newState = { ...prev };
                                    delete newState[`${block.id}_text`];
                                    return newState;
                                  });

                                  setEditorKey(prev => {
                                    const newKeys = { ...prev };
                                    delete newKeys[block.id];
                                    return newKeys;
                                  });
                                }}
                                className="px-3 py-1 bg-red-700 text-white rounded-md self-start hover:bg-red-500 duration-500"
                              >
                                Remove block pair with photo
                              </button>
                            </div>
                          )}

                          {block.contentBlockType === 'SECTION_WITH_TEXT' && (
                            <div className="mb-5">
                              <div className="mb-3">
                                <Input
                                  onChange={handleChange}
                                  id={`contentBlocks.${index}.sectionTitle`}
                                  name={`contentBlocks.${index}.sectionTitle`}
                                  type="text"
                                  className="!bg-background-light w-full h-[70px] px-5 rounded-lg !ring-0"
                                  value={block.sectionTitle}
                                  label="Section title"
                                  labelClass="!text-admin-700"
                                />
                              </div>
                              <div className="flex gap-5">
                                <div className="w-1/2">
                                  <div className="mb-3">
                                    <div>
                                      <div className="mb-2 !text-admin-700">Text block left</div>
                                      <TextEditor
                                        key={editorKey[`${block.id}_text1`]}
                                        value={editorStates[`${block.id}_text1`] || EditorState.createEmpty()}
                                        onChange={newState => handleEditorChange(index, block.id, 'editorState1', 'text1', newState, setFieldValue)}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="w-1/2">
                                  <div>
                                    <div className="mb-2 !text-admin-700">Text block right</div>
                                    <TextEditor
                                      key={editorKey[`${block.id}_text2`]}
                                      value={editorStates[`${block.id}_text2`] || EditorState.createEmpty()}
                                      onChange={newState => handleEditorChange(index, block.id, 'editorState2', 'text2', newState, setFieldValue)}
                                    />
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  const blockIndex = values.contentBlocks.findIndex(b => b.id === block.id);
                                  if (blockIndex !== -1) {
                                    remove(blockIndex);
                                  }

                                  setEditorStates(prev => {
                                    const newState = { ...prev };
                                    delete newState[`${block.id}_text1`];
                                    delete newState[`${block.id}_text2`];
                                    return newState;
                                  });

                                  setEditorKey(prev => {
                                    const newKeys = { ...prev };
                                    delete newKeys[`${block.id}_text1`];
                                    delete newKeys[`${block.id}_text2`];
                                    return newKeys;
                                  });
                                }}
                                className="px-3 py-1 bg-red-700 text-white rounded-md self-start hover:bg-red-500 duration-500"
                              >
                                Remove block pair with text
                              </button>
                            </div>
                          )}

                          {block.contentBlockType === 'SCHEDULE_TITLE' && (
                            <div className="mb-4">
                              <Input
                                onChange={handleChange}
                                id={`contentBlocks.${index}.title`}
                                name={`contentBlocks.${index}.title`}
                                type="text"
                                className="!bg-background-light w-full h-[70px] px-5 rounded-lg !ring-0"
                                value={block.title}
                                label="Schedule title"
                                labelClass="!text-admin-700"
                                placeholder="Графік виступу, Програма заходів..."
                              />
                            </div>
                          )}

                          {block.contentBlockType === 'SCHEDULE_POSTER' && (
                            <div className="mb-4 w-1/2 h-[500px]">
                              <ImageLoading
                                articleId={programId}
                                maxFiles={1}
                                label="Add schedule photo"
                                classBlock="min-h-[300px]"
                                positionBlockImg={true}
                                contentType={ArticleTypeEnum.PROGRAM}
                                uploadedUrls={block?.files || []}
                                onFilesChange={files => setFieldValue(`contentBlocks.${index}.files`, files)}
                              />
                            </div>
                          )}

                          {block.contentBlockType === 'SCHEDULE_INFO' && (
                            <>
                              <div className="mb-4">
                                <div className="block text-medium2 mb-1 !text-admin-700">Performance date</div>
                                <DatePicker name={`contentBlocks.${index}.date`} pickerId={`performance-${index}`} pickerType="single" pickerPlaceholder="Choose date and time" pickerValue={block.date} />
                              </div>

                              <div className="mb-4">
                                <div className="flex gap-8">
                                  <TimePicker
                                    name={`contentBlocks.${index}.startTime`}
                                    label="Start time"
                                    value={block?.startTime}
                                    classBlock="bg-background-light rounded-lg h-[56px] text-medium2 text-font-primary"
                                    setFieldValue={setFieldValue}
                                  />
                                  <TimePicker
                                    name={`contentBlocks.${index}.endTime`}
                                    label="End time"
                                    value={block?.endTime}
                                    classBlock="bg-background-light rounded-lg h-[56px] text-medium2 text-font-primary"
                                    setFieldValue={setFieldValue}
                                  />
                                </div>
                                {(touched.contentBlocks as any)?.[index]?.endTime && (errors.contentBlocks as any)?.[index]?.endTime && (
                                  <div className="text-red-600 text-sm mt-1">{(errors.contentBlocks as any)[index].endTime}</div>
                                )}
                              </div>
                              <div className="mb-4">
                                <Input
                                  onChange={handleChange}
                                  id={`contentBlocks.${index}.title`}
                                  name={`contentBlocks.${index}.title`}
                                  type="text"
                                  className="!bg-background-light w-full px-5 !ring-0"
                                  value={block.title}
                                  label="Performance topic"
                                  labelClass="!text-admin-700"
                                />
                              </div>
                              <div className="mb-4">
                                <Input
                                  onChange={handleChange}
                                  id={`contentBlocks.${index}.location`}
                                  name={`contentBlocks.${index}.location`}
                                  type="text"
                                  className="!bg-background-light w-full px-5 !ring-0"
                                  value={block.location}
                                  label="Performance location"
                                  labelClass="!text-admin-700"
                                />
                              </div>

                              {values.contentBlocks.findIndex(b => b.contentBlockType === 'SCHEDULE_INFO') !== index && (
                                <div className="mb-4">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const blockId = block.id;

                                      const blockIndex = values.contentBlocks.findIndex(b => b.id === block.id);
                                      if (blockIndex !== -1) remove(blockIndex);
                                      // remove(index);

                                      setEditorStates(prev => {
                                        const newState = { ...prev };
                                        delete newState[blockId];
                                        return newState;
                                      });
                                    }}
                                    className="px-3 py-1 bg-red-700 text-white rounded-md self-start hover:bg-red-500 duration-500"
                                  >
                                    Remove block schedule info
                                  </button>
                                </div>
                              )}
                            </>
                          )}

                          {lastPerformanceBlock === index && (
                            <button
                              type="button"
                              onClick={() => {
                                const blockId = uuid();
                                push({
                                  id: blockId,
                                  contentBlockType: 'SCHEDULE_INFO',
                                  date: '',
                                  title: '',
                                  location: '',
                                });
                              }}
                              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                            >
                              Add block with performance info
                            </button>
                          )}

                          {insertPosition === index && (
                            <div className="flex gap-3 mt-6 mb-8">
                              <button
                                type="button"
                                onClick={() => {
                                  const blockId = uuid();
                                  insert(insertPosition + 1, {
                                    id: blockId,
                                    contentBlockType: 'SECTION_WITH_PHOTO',
                                    sectionTitle: '',
                                    text: '',
                                    files: [],
                                    editorStates: null,
                                  });
                                }}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                              >
                                Add block with photo
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  const blockId = uuid();
                                  insert(insertPosition + 1, {
                                    id: blockId,
                                    contentBlockType: 'SECTION_WITH_TEXT',
                                    sectionTitle: '',
                                    text1: '',
                                    text2: '',
                                    editorStates1: null,
                                    editorStates2: null,
                                  });
                                }}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                              >
                                Add block with text
                              </button>
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                );
              }}
            </FieldArray>

            {submitError && <div className="text-red-700 text-medium1 mt-4"> {submitError}</div>}

            <div className="mt-10">
              <sup className="font-bold text-red-600 text-small2">*</sup>
              <em>You must save the page before you can preview or publish it</em>
            </div>

            <div className="flex gap-x-6 mt-2">
              <Button type="submit" disabled={isSubmitting} className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-[0.8] duration-500">
                Save
              </Button>

              <LinkBtn href={`/admin/programs/preview?id=${programId}`} targetLink="_self" className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-80 duration-300">
                Preview
              </LinkBtn>

              {program?.articleStatus !== 'PUBLISHED' && (
                <Button onClick={() => handlePublish(programId)} type="button" className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-80 duration-300">
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

export default ProgramContent;
