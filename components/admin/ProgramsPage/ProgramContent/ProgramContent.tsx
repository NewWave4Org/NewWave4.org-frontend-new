'use client';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import LinkBtn from '@/components/shared/LinkBtn';
import Select from '@/components/shared/Select';
import TextArea from '@/components/shared/TextArea';
import { getArticleById, publishArticle, updateArticle } from '@/store/article-content/action';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { getUsers } from '@/store/users/actions';
import { GetArticleByIdResponseDTO } from '@/utils/article-content/type/interfaces';
import { ArticleType, ArticleTypeEnum } from '@/utils/ArticleType';
import useHandleThunk from '@/utils/useHandleThunk';
import { FieldArray, Form, Formik, FormikHelpers } from 'formik';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import DatePicker from '../../helperComponents/DatePicker/DatePicker';
import ImageLoading from '../../helperComponents/ImageLoading/ImageLoading';
import TimePicker from '../../helperComponents/TimePicker/TimePicker';

export interface UpdateArticleFormValues {
  title: string;
  articleType: ArticleType;
  authorId: number;
  articleStatus: string;
  contentBlocks: any[];
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

  const currentUser = useAppSelector(state => state.authUser.user);
  const allUsers = useAppSelector(state => state.users.users);
  const currentAuthor = allUsers.find(user => user.name === currentUser?.name);

  const usersList = allUsers.map(user => ({
    value: user.id.toString(),
    label: user.name,
  }));

  const defaultFormValues: UpdateArticleFormValues = {
    title: '',
    articleType: ArticleTypeEnum.PROGRAM,
    authorId: currentAuthor?.id!,
    articleStatus: '',
    contentBlocks: [
      { contentBlockType: 'SUB_TITLE_PROGRAM', text: '' },
      { contentBlockType: 'DESCRIPTION_PROGRAM', text: '' },
      { contentBlockType: 'DATE_PROGRAM', date: '' },
      { contentBlockType: 'VIDEO', videoUrl: '' },
      { contentBlockType: 'SECTION_WITH_PHOTO', sectionTitle: '', text: '', files: [] },
      { contentBlockType: 'SECTION_WITH_TEXT', sectionTitle: '', text1: '', text2: '' },
      { contentBlockType: 'SCHEDULE_TITLE', title: '' },
      { contentBlockType: 'SCHEDULE_POSTER', files: [] },
      { contentBlockType: 'SCHEDULE_INFO', date: '', startTime: { hour: '', minute: '', period: 'AM' }, endTime: { hour: '', minute: '', period: 'AM' }, title: '', location: '' },
    ],
  };

  //GET project by id
  useEffect(() => {
    if (!programId) return;

    async function fetchFullProgramById() {
      try {
        const result = await dispatch(
          getArticleById({
            id: programId,
            articleType: ArticleTypeEnum.PROGRAM,
          }),
        ).unwrap();
        setProgram(result);
      } catch (error) {
        console.log('error', error);
        toast.error('Failed to fetch program');
      }
    }

    fetchFullProgramById();
  }, [programId, dispatch]);

  //GET all users for dropdown Change Author
  useEffect(() => {
    if (programId) {
      dispatch(getUsers());
    }
  }, [dispatch, programId]);

  async function handleSubmit(values: UpdateArticleFormValues, { setSubmitting }: FormikHelpers<UpdateArticleFormValues>) {
    console.log('values', values);

    const filteredBlocks = values.contentBlocks.filter(block => {
      if (block.contentBlockType === 'SECTION_WITH_PHOTO') {
        return !(block.sectionTitle === '' || block.text === '' || block.files.length === 0);
      }

      if (block.contentBlockType === 'SECTION_WITH_TEXT') {
        return !(block.sectionTitle === '' || block.text1 === '' || block.text2 === '');
      }

      return true;
    });

    const normalized = {
      ...values,
      contentBlocks: filteredBlocks.map(block => {
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
          authorId: program?.authorId ?? defaultFormValues.authorId,
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
              <Select label="Change Author (if needed)" adminSelectClass={true} name="authorId" required labelClass="!text-admin-700" onChange={handleChange} options={usersList} />
            </div>

            <FieldArray name="contentBlocks">
              {({ push, remove, insert }) => {
                const sectionIndexes = values.contentBlocks.map((b, i) => (b.contentBlockType === 'SECTION_WITH_PHOTO' || b.contentBlockType === 'SECTION_WITH_TEXT' ? i : -1)).filter(i => i !== -1);

                const dateProgramIndex = values.contentBlocks.findIndex(b => b.contentBlockType === 'DATE_PROGRAM');
                const insertPosition = sectionIndexes.length > 0 ? sectionIndexes[sectionIndexes.length - 1] : dateProgramIndex !== -1 ? dateProgramIndex : values.contentBlocks.length - 1;

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
                        <React.Fragment key={index}>
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
                            <TextArea
                              id={`contentBlocks.${index}.text`}
                              name={`contentBlocks.${index}.text`}
                              label="Description program"
                              labelClass="!text-admin-700"
                              className="!bg-background-light !w-full !max-w-full px-5 rounded-lg !ring-0 mb-5 "
                              rows={6}
                              value={block.text}
                              onChange={handleChange}
                            />
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
                            <div key={index} className="mb-5">
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

                                  <TextArea
                                    id={`contentBlocks.${index}.text`}
                                    name={`contentBlocks.${index}.text`}
                                    label="Text block"
                                    value={block.text}
                                    labelClass="!text-admin-700"
                                    className="!bg-background-light w-full h-[300px] px-5 rounded-lg !ring-0 !max-w-full"
                                    onChange={handleChange}
                                  />
                                </div>

                                <div className="w-1/2">
                                  <ImageLoading
                                    articleId={programId}
                                    maxFiles={1}
                                    label="Add photo"
                                    classBlock="h-[100px]"
                                    previewSize={200}
                                    positionBlockImg={true}
                                    contentType={ArticleTypeEnum.PROGRAM}
                                    uploadedUrls={block?.files || []}
                                    onFilesChange={files => setFieldValue(`contentBlocks.${index}.files`, files)}
                                  />
                                </div>
                              </div>

                              <button type="button" onClick={() => remove(index)} className="px-3 py-1 bg-red-700 text-white rounded-md self-start hover:bg-red-500 duration-500">
                                Remove block pair with photo
                              </button>
                            </div>
                          )}

                          {block.contentBlockType === 'SECTION_WITH_TEXT' && (
                            <div key={index} className="mb-5">
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
                                    <TextArea
                                      id={`contentBlocks.${index}.text1`}
                                      name={`contentBlocks.${index}.text1`}
                                      label="Text block left"
                                      labelClass="!text-admin-700"
                                      value={block.text1}
                                      className="!bg-background-light w-full h-[300px] px-5 rounded-lg !ring-0 !max-w-full"
                                      onChange={handleChange}
                                    />
                                  </div>
                                </div>
                                <div className="w-1/2">
                                  <TextArea
                                    id={`contentBlocks.${index}.text2`}
                                    name={`contentBlocks.${index}.text2`}
                                    label="Text block right"
                                    labelClass="!text-admin-700"
                                    value={block.text2}
                                    className="!bg-background-light w-full h-[300px] px-5 rounded-lg !ring-0 !max-w-full"
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>

                              <button type="button" onClick={() => remove(index)} className="px-3 py-1 bg-red-700 text-white rounded-md self-start hover:bg-red-500 duration-500">
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
                                  <button type="button" onClick={() => remove(index)} className="px-3 py-1 bg-red-700 text-white rounded-md self-start hover:bg-red-500 duration-500">
                                    Remove block schedule info
                                  </button>
                                </div>
                              )}
                            </>
                          )}

                          {lastPerformanceBlock === index && (
                            <button
                              type="button"
                              onClick={() =>
                                push({
                                  contentBlockType: 'SCHEDULE_INFO',
                                  date: '',
                                  title: '',
                                  location: '',
                                })
                              }
                              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                            >
                              Add block with performance info
                            </button>
                          )}

                          {insertPosition === index && (
                            <div className="flex gap-3 mt-6 mb-8">
                              <button
                                type="button"
                                onClick={() =>
                                  insert(insertPosition + 1, {
                                    contentBlockType: 'SECTION_WITH_PHOTO',
                                    sectionTitle: '',
                                    text: '',
                                    files: [],
                                  })
                                }
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                              >
                                Add block with photo
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  insert(insertPosition + 1, {
                                    contentBlockType: 'SECTION_WITH_TEXT',
                                    sectionTitle: '',
                                    text1: '',
                                    text2: '',
                                  })
                                }
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
