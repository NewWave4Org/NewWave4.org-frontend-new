import { useAppDispatch } from '@/store/hook';
import { PagesType } from './enum/types';
import React, { useEffect, useMemo, useState } from 'react';
import { IPagesResponseDTO } from '@/utils/pages/types/interfaces';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import useHandleThunk from '@/utils/useHandleThunk';
import { FieldArray, Form, Formik } from 'formik';
import TextEditor from '@/components/TextEditor/TextEditor';
import Input from '@/components/shared/Input';
import ImageLoading from '../helperComponents/ImageLoading/ImageLoading';
import Button from '@/components/shared/Button';
import { getPages, updatePages } from '@/store/pages/action';
import { toast } from 'react-toastify';
import { v4 as uuid } from 'uuid';
import useImageLoading from '../helperComponents/ImageLoading/hook/useImageLoading';
import Accordion from '@/components/ui/Accordion/Accordion';
import BasketIcon from '@/components/icons/symbolic/BasketIcon';
import Select from '@/components/shared/Select';
import { createTranslationPage } from '@/store/translation/action';

interface IAboutUsPageValues {
  pageType: PagesType;
  contentBlocks: any[];
}

function AboutUsForm() {
  const dispatch = useAppDispatch();

  const { deleteFile } = useImageLoading({
    isAttach: true,
  });

  const [submitError, setSubmitError] = useState('');
  const [submitErrorTranslate, setSubmitErrorTranslate] = useState('');
  const [aboutUsPage, setAboutUsPage] = useState<IPagesResponseDTO | null>(null);

  const [editorStates, setEditorStates] = useState<Record<string, EditorState>>({});
  const [editorKey, setEditorKey] = useState<Record<string, string>>({});

  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);

  const handleThunk = useHandleThunk();

  const isUpdate = Boolean(aboutUsPage?.id);

  const defaultFormValues = useMemo(
    () => ({
      pageType: PagesType.ABOUT_US,
      contentBlocks: [
        { id: uuid(), contentBlockType: 'TRANSLATE', translateStatus: 'no' },
        { id: uuid(), contentBlockType: 'MISSION_BLOCK', translatable_text_title: '', translatable_text_text: '', translatable_text_editorState: null },
        { id: uuid(), contentBlockType: 'MISSION_BLOCK', translatable_text_title: '', translatable_text_text: '', translatable_text_editorState: null },
        { id: uuid(), contentBlockType: 'MISSION_BLOCK', translatable_text_title: '', translatable_text_text: '', translatable_text_editorState: null },
        { id: uuid(), contentBlockType: 'QUOTE', translatable_text_text: '', translatable_text_editorState: null },
        { id: uuid(), contentBlockType: 'OUR_HISTORY_TITLE', translatable_text_title: '' },
        { id: uuid(), contentBlockType: 'OUR_HISTORY_DESCRIPTION', translatable_text_text: '', translatable_text_editorState: null },
        { id: uuid(), contentBlockType: 'PHOTOS', files: [] },
        { id: uuid(), contentBlockType: 'HISTORY_OF_FORMATION', year: '', translatable_text_title: '', translatable_text_text: '', translatable_text_editorState: null },
      ],
    }),
    [],
  );

  const initialValues = {
    pageType: PagesType.ABOUT_US,
    contentBlocks: aboutUsPage?.contentBlocks && aboutUsPage?.contentBlocks.length 
      ? aboutUsPage?.contentBlocks 
      : defaultFormValues.contentBlocks,
  };

  const handleEditorChange = (id: string, values: any, newState: EditorState, setFieldValue: any) => {
    setEditorStates(prev => ({ ...prev, [id]: newState }));

    const index = values.contentBlocks.findIndex(block => block.id === id);

    if (index === -1) return;

    const content = newState.getCurrentContent();
    const raw = convertToRaw(content);

    setFieldValue(`contentBlocks.${index}.translatable_text_editorState`, raw);
    setFieldValue(`contentBlocks.${index}.translatable_text_text`, content.getPlainText());
  };

  useEffect(() => {
    async function getPageByKey() {
      try {
        const result = await dispatch(getPages(PagesType.ABOUT_US)).unwrap();

        const serverBlocks = (result?.contentBlocks ?? []).map(block => ({
          ...block,
          id: block.id ?? uuid(),
          ...(block.contentBlockType === 'HISTORY_OF_FORMATION' ? {isNew: false} : {})
        }));

        // Add default blocks
        const mergedBlocks = [
          ...serverBlocks,
          ...defaultFormValues.contentBlocks.filter(
            defBlock => !serverBlocks.some(b => b.contentBlockType === defBlock.contentBlockType)
          )
        ];

        const editors: Record<string, EditorState> = {};
        const keys: Record<string, string> = {};

        mergedBlocks.forEach(block => {
          let editor: EditorState;
          try {
            if (block.translatable_text_editorState) {
              editor = EditorState.createWithContent(convertFromRaw(block.translatable_text_editorState));
            } else {
              editor = EditorState.createEmpty();
            }
          } catch (err) {
            editor = EditorState.createEmpty();
          }

          editors[block.id] = editor;
          keys[block.id] = `${block.id}-init`;
        });

        setEditorStates(editors);
        setEditorKey(keys);

        setAboutUsPage({
          ...result,
          contentBlocks: mergedBlocks,
        });

      } catch (error: any) {
        console.log('error', error);
        setAboutUsPage(null);
        toast.error('Failed to fetch About us page');
      }
    }

    getPageByKey();
  }, [dispatch]);


  //SAVE
  async function handleSubmit(values: IAboutUsPageValues) {
    console.log('Submited', values);
    console.log('deletedFiles', deletedFiles);
    

    const translateStatusVal = values.contentBlocks.find(block => block.contentBlockType === 'TRANSLATE')?.translateStatus ?? 'no'

    try {
      for (const url of deletedFiles) {
        await deleteFile(url);
      }

      if(translateStatusVal == 'yes') {
        try {
          const responce = await handleThunk(createTranslationPage, aboutUsPage?.id, setSubmitErrorTranslate);

          console.log('translation responce', responce)
          toast.success(`The translation was successfully created`);
        } catch (error) {
          console.log('error translate', error);
          toast.error(`Something go wrong with translation! ${error}`);
        }
      }


      const result = await handleThunk(updatePages, { id: aboutUsPage?.id, data: values }, setSubmitError);

      if (result) {
        setAboutUsPage(result);
        setSubmitError('');
        setDeletedFiles([]);
        toast.success(isUpdate ? 'About us page updated successfully!' : 'About us page created successfully!');
      }
    } catch (error) {
      toast.error(`Something went wrong! ${error}`);
    }
  }
  

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
      {({ handleChange, isSubmitting, values, setFieldValue }) => {
        const translateBlockIndex = values.contentBlocks.findIndex(b => b.contentBlockType === 'TRANSLATE');
        const photosBlock = values.contentBlocks.find(b => b.contentBlockType === 'PHOTOS');
        const photosIndex = values.contentBlocks.findIndex(b => b.contentBlockType === 'PHOTOS');

        return(
          <Form>
            <div className='mb-5'>
              <Select label="Do you want translate this program info English language?" adminSelectClass={true} 
                name={`contentBlocks.${translateBlockIndex}.translateStatus`}
                labelClass="!text-admin-700" 
                onChange={handleChange} options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ]} />
            </div>

            <FieldArray name="contentBlocks">
              {({ push, remove }) => {
                const historyLine = values.contentBlocks.filter(cb => cb.contentBlockType === 'HISTORY_OF_FORMATION');
                const firstHistoryBlock = historyLine[0];
                const restHistoryBlocks = historyLine.slice(1);

                const historyTitleBlockIndex = values.contentBlocks.findIndex(block => block.contentBlockType === 'OUR_HISTORY_TITLE');
                const historyTitleBlock = values.contentBlocks[historyTitleBlockIndex];

                return (
                  <>
                    <div className="mb-4">
                      <div className="mb-2 !text-admin-700 font-black text-2xl">Mission blocks</div>
                    </div>

                    {/* Mission blocks */}
                    {values.contentBlocks
                      .filter(block => block.contentBlockType === 'MISSION_BLOCK')
                      .map((block, index) => {
                        const realIndex = values.contentBlocks.findIndex(b => b.id === block.id);
                        return (
                          <div key={block.id} className="mb-6">
                            <div className="mb-2 !text-admin-700 font-black text-lg">Mission block #{index + 1}</div>

                            {/* Title */}
                            <Input
                              id={`contentBlocks.${realIndex}.translatable_text_title`}
                              name={`contentBlocks.${realIndex}.translatable_text_title`}
                              type="text"
                              className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                              value={block.translatable_text_title ?? ''}
                              onChange={handleChange}
                              label="Mission title"
                              labelClass="mb-2 !text-admin-700"
                            />

                            {/* Text */}
                            <div className="mt-2 mb-4">
                              <div className="mb-2 !text-admin-700">Mission text</div>
                              <TextEditor key={block.id} value={editorStates[block.id] || EditorState.createEmpty()} onChange={newState => handleEditorChange(block.id, values, newState, setFieldValue)} />
                            </div>
                          </div>
                        );
                      })}

                    <div className="mb-4">
                      <div className="mb-2 !text-admin-700">Quote</div>
                      {values.contentBlocks.map(block => (
                        <React.Fragment key={block.id}>
                          {block.contentBlockType === 'QUOTE' && (
                            <TextEditor key={editorKey[block.id]} value={editorStates[block.id] || EditorState.createEmpty()} onChange={newState => handleEditorChange(block.id, values, newState, setFieldValue)} />
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    <div className="mb-4">
                      <Input
                        id={`contentBlocks.${historyTitleBlockIndex}.translatable_text_title`}
                        name={`contentBlocks.${historyTitleBlockIndex}.translatable_text_title`}
                        type="text"
                        className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                        value={historyTitleBlock.translatable_text_title ?? ''}
                        onChange={handleChange}
                        label="Our history title"
                        labelClass="mb-2 !text-admin-700"
                      />
                    </div>

                    <div className="mb-4">
                      <div className="mb-2 !text-admin-700">Our history description</div>
                      {values.contentBlocks.map(block => (
                        <React.Fragment key={block.id}>
                          {block.contentBlockType === 'OUR_HISTORY_DESCRIPTION' && (
                            <TextEditor key={editorKey[block.id]} value={editorStates[block.id] || EditorState.createEmpty()} onChange={newState => handleEditorChange(block.id, values, newState, setFieldValue)} />
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    <div className=" mb-4">
                      <div className="mb-2 !text-admin-700">Our history photos</div>
                      <ImageLoading
                        classBlock="min-h-[300px]"
                        maxFiles={10}
                        isAttach={true}
                        uploadedUrls={photosBlock.files ?? []}
                        onFilesChange={(files, deleted) => {
                          setFieldValue(`contentBlocks.${photosIndex}.files`, files);
                          setDeletedFiles(prev => [...prev, ...(deleted || [])]);
                        }}
                      />
                    </div>

                    <div className="mt-9 mb-4">
                      <div className="mb-2 !text-admin-700mb-3 font-black text-2xl">Our history formation (Maximum 6 blocks)</div>
                    </div>

                    {firstHistoryBlock && (
                      <div className="mb-4">
                        <Accordion title={`Block #1 - ${firstHistoryBlock.translatable_text_title}`} classNameTop="min-h-14">
                          <div className="mb-4">
                            <Input
                              id={`contentBlocks.${values.contentBlocks.findIndex(b => b.id === firstHistoryBlock.id)}.year`}
                              name={`contentBlocks.${values.contentBlocks.findIndex(b => b.id === firstHistoryBlock.id)}.year`}
                              type="text"
                              className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                              value={firstHistoryBlock.year ?? ''}
                              onChange={handleChange}
                              label="Our history formation year"
                              labelClass="mb-2 !text-admin-700"
                            />
                          </div>

                          <div className="mb-4">
                            <Input
                              id={`contentBlocks.${values.contentBlocks.findIndex(b => b.id === firstHistoryBlock.id)}.translatable_text_title`}
                              name={`contentBlocks.${values.contentBlocks.findIndex(b => b.id === firstHistoryBlock.id)}.translatable_text_title`}
                              type="text"
                              className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                              value={firstHistoryBlock.translatable_text_title ?? ''}
                              onChange={handleChange}
                              label="Our history formation title"
                              labelClass="mb-2 !text-admin-700"
                            />
                          </div>

                          <div className="mb-4">
                            <div className="mb-2 !text-admin-700">Our history formation description</div>

                            <TextEditor
                              key={editorKey[firstHistoryBlock.id]}
                              value={editorStates[firstHistoryBlock.id] || EditorState.createEmpty()}
                              onChange={newState => handleEditorChange(firstHistoryBlock.id, values, newState, setFieldValue)}
                            />
                          </div>
                        </Accordion>
                      </div>
                    )}

                    {restHistoryBlocks.map((block, pairIndex) => {
                      const blockNumber = pairIndex + 2;
                      const blockIndex = values.contentBlocks.findIndex(b => b.id === block.id);

                      if (block.contentBlockType !== 'HISTORY_OF_FORMATION') {
                        return null;
                      }

                      return (
                        <div key={block.id} className=" mb-4">
                          <Accordion
                            title={`Block #${blockNumber} - ${values.contentBlocks[blockIndex].translatable_text_title}`}
                            initState={block.isNew || false}
                            actions={
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

                                  setEditorKey(prev => {
                                    const newKey = { ...prev };
                                    delete newKey[blockId];
                                    return newKey;
                                  });

                                  toast.success(`Block #${blockNumber} was successfully removed.`);
                                }}
                                className="my-1 mr-3 p-3 bg-red-700 text-white rounded-md self-start hover:bg-red-500 duration-500"
                              >
                                <BasketIcon color="white" />
                              </button>
                            }
                          >
                            <div>
                              <div className="mb-4">
                                <Input
                                  id={`contentBlocks[${blockIndex}].year`}
                                  name={`contentBlocks[${blockIndex}].year`}
                                  type="text"
                                  className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                                  value={values.contentBlocks[blockIndex].year ?? ''}
                                  onChange={handleChange}
                                  label="Our history formation year"
                                  labelClass="mb-2 !text-admin-700"
                                />
                              </div>
                              <div className="mb-4">
                                <Input
                                  id={`contentBlocks[${blockIndex}].translatable_text_title`}
                                  name={`contentBlocks[${blockIndex}].translatable_text_title`}
                                  type="text"
                                  className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                                  value={values.contentBlocks[blockIndex].translatable_text_title ?? ''}
                                  onChange={handleChange}
                                  label="Our history formation title"
                                  labelClass="mb-2 !text-admin-700"
                                />
                              </div>
                              <div className="mb-4">
                                <div className="mb-2 !text-admin-700">Our history formation description</div>
                                <TextEditor key={editorKey[block.id]} value={editorStates[block.id] || EditorState.createEmpty()} onChange={newState => handleEditorChange(block.id, values, newState, setFieldValue)} />
                              </div>
                            </div>
                          </Accordion>
                        </div>
                      );
                    })}

                    {/* Added blocks */}
                    {restHistoryBlocks.length < 5 && (
                      <button
                        type="button"
                        onClick={() => {
                          const blockId = uuid();
                          push({
                            id: blockId,
                            contentBlockType: 'HISTORY_OF_FORMATION',
                            year: '',
                            translatable_text_title: '',
                            translatable_text_text: '',
                            translatable_text_editorState: null,
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
                        Add new block our history formation
                      </button>
                    )}
                  </>
                );
              }}
            </FieldArray>

            {submitError && <div className="text-red-700 text-medium1 my-4"> {submitError}</div>}

            <div className="my-4">
              <sup className="font-bold text-red-600 text-small2">*</sup>
              After any changes, you need to click the <strong>Update</strong> button
            </div>

            <div className="mt-6">
              <Button type="submit" disabled={isSubmitting} className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-[0.8] duration-500">
                {isSubmitting ? 'Loading...' : 'Update'}
              </Button>
            </div>
          </Form>
        )
      }}
    </Formik>
  );
}

export default AboutUsForm;
