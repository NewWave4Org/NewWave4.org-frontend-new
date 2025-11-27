import { useAppDispatch } from '@/store/hook';
import { PagesType } from './enum/types';
import { useEffect, useState } from 'react';
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

interface IAboutUsPageValues {
  pageType: PagesType;
  contentBlocks: any[];
}

const defaultFormValues = {
  pageType: PagesType.ABOUT_US,
  contentBlocks: [
    { id: uuid(), contentBlockType: 'QUOTE', text: '', editorState: null },
    { id: uuid(), contentBlockType: 'OUR_HISTORY_TITLE', title: '' },
    { id: uuid(), contentBlockType: 'OUR_HISTORY_DESCRIPTION', text: '', editorState: null },
    { id: uuid(), contentBlockType: 'PHOTOS', files: [] },
    { id: uuid(), contentBlockType: 'HISTORY_OF_FORMATION', year: '', title: '', text: '', editorState: null },
  ],
};

function AboutUsForm() {
  const dispatch = useAppDispatch();

  const [submitError, setSubmitError] = useState('');
  const [aboutUsPage, setAboutUsPage] = useState<IPagesResponseDTO | null>(null);

  const [editorStates, setEditorStates] = useState<Record<string, EditorState>>({});
  const [editorKey, setEditorKey] = useState<Record<string, string>>({});

  const handleThunk = useHandleThunk();

  const isUpdate = Boolean(aboutUsPage?.id);

  const initialValues = {
    pageType: PagesType.ABOUT_US,
    contentBlocks: aboutUsPage?.contentBlocks && aboutUsPage?.contentBlocks.length ? aboutUsPage?.contentBlocks : defaultFormValues.contentBlocks,
  };

  const handleEditorChange = (id: string, values: any, newState: EditorState, setFieldValue: any) => {
    setEditorStates(prev => ({ ...prev, [id]: newState }));

    const index = values.contentBlocks.findIndex(block => block.id === id);

    if (index === -1) return;

    const content = newState.getCurrentContent();
    const raw = convertToRaw(content);

    setFieldValue(`contentBlocks.${index}.editorState`, raw);
    setFieldValue(`contentBlocks.${index}.text`, content.getPlainText());
  };

  useEffect(() => {
    async function getPageByKey() {
      try {
        const result = await dispatch(getPages(PagesType.ABOUT_US)).unwrap();

        const editors: Record<string, EditorState> = {};
        const keys: Record<string, string> = {};

        const blocksWithId = (result?.contentBlocks ?? []).map(block => ({
          ...block,
          id: block.id ?? uuid(),
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

        setAboutUsPage({
          ...result,
          contentBlocks: blocksWithId,
        });
      } catch (error: any) {
        if (error.original.errors[0].includes('with key') || error.original.errors[0].includes('find page')) {
          console.log('Section does not exist yet → creating new one');
          setAboutUsPage(null);
          return;
        }

        console.log('error', error);
        setAboutUsPage(null);
        toast.error('Failed to fetch About us page');
      }
    }

    getPageByKey();
  }, [dispatch]);

  async function handleSubmit(values: IAboutUsPageValues) {
    console.log('Submited', values);

    try {
      const result = await handleThunk(updatePages, { id: aboutUsPage?.id, data: values }, setSubmitError);

      // if (isUpdate) {
      //   result = await handleThunk(updatePages, { id: aboutUsPage?.id, data: values }, setSubmitError);
      // } else {
      //   result = await handleThunk(createdPages, values, setSubmitError);
      // }

      if (result) {
        setAboutUsPage(result);
        setSubmitError('');
        toast.success(isUpdate ? 'About us page updated successfully!' : 'About us page created successfully!');
      }
    } catch (error) {
      toast.error(`Something went wrong! ${error}`);
    }
  }

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
      {({ handleChange, isSubmitting, values, setFieldValue }) => (
        <Form>
          <FieldArray name="contentBlocks">
            {({ push, remove }) => {
              const historyLine = values.contentBlocks?.slice(5) || [];
              return (
                <>
                  <div className="mb-4">
                    <div className="mb-2 !text-admin-700">Quote</div>
                    {values.contentBlocks.map(block => {
                      if (block.contentBlockType === 'QUOTE') {
                        return <TextEditor key={editorKey[block.id]} value={editorStates[block.id] || EditorState.createEmpty()} onChange={newState => handleEditorChange(block.id, values, newState, setFieldValue)} />;
                      }

                      return null;
                    })}
                  </div>

                  <div className="mb-4">
                    <Input
                      id="contentBlocks[1].title"
                      name="contentBlocks[1].title"
                      type="text"
                      className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                      value={values.contentBlocks[1].title}
                      onChange={handleChange}
                      label="Our history title"
                      labelClass="mb-2 !text-admin-700"
                    />
                  </div>

                  <div className="mb-4">
                    <div className="mb-2 !text-admin-700">Our history description</div>
                    {values.contentBlocks.map(block => {
                      if (block.contentBlockType === 'OUR_HISTORY_DESCRIPTION') {
                        return <TextEditor key={editorKey[block.id]} value={editorStates[block.id] || EditorState.createEmpty()} onChange={newState => handleEditorChange(block.id, values, newState, setFieldValue)} />;
                      }

                      return null;
                    })}
                  </div>

                  <div className=" mb-4">
                    <div className="mb-2 !text-admin-700">Our history photos</div>
                    <ImageLoading classBlock="min-h-[300px]" isAttach={true} uploadedUrls={values.contentBlocks[3].files || []} onFilesChange={files => setFieldValue(`contentBlocks[3].files`, files)} />
                  </div>

                  <div className=" mb-4">
                    <div className="mb-2 !text-admin-700mb-3 font-black text-2xl">Our history formation (You can add up to 7 blocks)</div>
                  </div>

                  <div className=" mb-4">
                    <div className="mb-2 !text-admin-700 font-black text-lg">Block #1</div>
                    <div>
                      <div className="mb-4">
                        <Input
                          id="contentBlocks[4].year"
                          name="contentBlocks[4].year"
                          type="text"
                          className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                          value={values.contentBlocks[4].year}
                          onChange={handleChange}
                          label="Our history formation year"
                          labelClass="mb-2 !text-admin-700"
                        />
                      </div>
                      <div className="mb-4">
                        <Input
                          id="contentBlocks[4].title"
                          name="contentBlocks[4].title"
                          type="text"
                          className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                          value={values.contentBlocks[4].title}
                          onChange={handleChange}
                          label="Our history formation title"
                          labelClass="mb-2 !text-admin-700"
                        />
                      </div>
                      <div className="mb-4">
                        <div className="mb-2 !text-admin-700">Our history formation description</div>
                        {values.contentBlocks.map(block => {
                          if (block.contentBlockType === 'HISTORY_OF_FORMATION') {
                            return (
                              <TextEditor key={editorKey[block.id]} value={editorStates[block.id] || EditorState.createEmpty()} onChange={newState => handleEditorChange(block.id, values, newState, setFieldValue)} />
                            );
                          }

                          return null;
                        })}
                      </div>
                    </div>
                  </div>

                  {historyLine.map((block, pairIndex) => {
                    const index = pairIndex + 5;
                    const blockNumber = pairIndex + 2;

                    if (block.contentBlockType !== 'HISTORY_OF_FORMATION') {
                      return null;
                    }

                    return (
                      <div key={index} className=" mb-4">
                        <div className="mb-2 !text-admin-700 font-black text-lg">Block #{blockNumber}</div>
                        <div>
                          <div className="mb-4">
                            <Input
                              id={`contentBlocks[${index}].year`}
                              name={`contentBlocks[${index}].year`}
                              type="text"
                              className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                              value={values.contentBlocks[index].year}
                              onChange={handleChange}
                              label="Our history formation year"
                              labelClass="mb-2 !text-admin-700"
                            />
                          </div>
                          <div className="mb-4">
                            <Input
                              id={`contentBlocks[${index}].title`}
                              name={`contentBlocks[${index}].title`}
                              type="text"
                              className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                              value={values.contentBlocks[index].title}
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

                        <button
                          type="button"
                          onClick={() => {
                            const blockId = block.id;

                            remove(index);

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
                          className="px-3 py-1 bg-red-700 text-white rounded-md self-start hover:bg-red-500 duration-500"
                        >
                          Remove block our history formation
                        </button>
                      </div>
                    );
                  })}

                  {/* Added blocks */}
                  {historyLine.length < 6 && (
                    <button
                      type="button"
                      onClick={() => {
                        const blockId = uuid();
                        push({
                          id: blockId,
                          contentBlockType: 'HISTORY_OF_FORMATION',
                          year: '',
                          title: '',
                          text: '',
                          editorState: null,
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

          <div className="mt-6">
            <Button type="submit" disabled={isSubmitting} className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-[0.8] duration-500">
              {isSubmitting ? 'Loading...' : 'Update'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default AboutUsForm;
