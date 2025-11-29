import { useAppDispatch } from '@/store/hook';
import { FieldArray, Form, Formik } from 'formik';
import { PagesType } from './enum/types';
import Input from '@/components/shared/Input';
import TextEditor from '@/components/TextEditor/TextEditor';
import { useEffect, useMemo, useState } from 'react';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import Button from '@/components/shared/Button';
import ImageLoading from '../helperComponents/ImageLoading/ImageLoading';
import useHandleThunk from '@/utils/useHandleThunk';
import { getPages, updatePages } from '@/store/pages/action';
import { toast } from 'react-toastify';
import { IPagesResponseDTO } from '@/utils/pages/types/interfaces';
import { v4 as uuid } from 'uuid';
import useImageLoading from '../helperComponents/ImageLoading/hook/useImageLoading';

interface IHomePageValues {
  pageType: PagesType;
  contentBlocks: any[];
}

function HomeForm() {
  const dispatch = useAppDispatch();
  const { deleteFile } = useImageLoading({
    isAttach: true,
  });

  const [submitError, setSubmitError] = useState('');
  const [homePage, setHomePage] = useState<IPagesResponseDTO | null>(null);

  const [editorStates, setEditorStates] = useState<Record<string, EditorState>>({});
  const [editorKey, setEditorKey] = useState<Record<string, string>>({});

  const handleThunk = useHandleThunk();

  const isUpdate = Boolean(homePage?.id);

  const defaultFormValues = useMemo(
    () => ({
      pageType: PagesType.HOME,
      contentBlocks: [
        { id: uuid(), contentBlockType: 'SLIDER', title: '', description: '', link: '', files: [], editorState: null },
        { id: uuid(), contentBlockType: 'HOME_TITLE', title: '' },
        { id: uuid(), contentBlockType: 'HOME_DESCRIPTION', description: '', editorState: null },
        { id: uuid(), contentBlockType: 'VIDEO', video_url: '' },
        { id: uuid(), contentBlockType: 'JOIN_US', title: '', description: '', editorState: null },
        { id: uuid(), contentBlockType: 'JOIN_US', title: '', description: '', editorState: null },
        { id: uuid(), contentBlockType: 'JOIN_US', title: '', description: '', editorState: null },
        { id: uuid(), contentBlockType: 'PARTNERS', title: '', description: '', editorState: null },
      ],
    }),
    [],
  );

  const initialValues = {
    pageType: PagesType.HOME,
    contentBlocks: homePage?.contentBlocks?.length ? homePage.contentBlocks : defaultFormValues.contentBlocks,
  };

  const formatType = (str: string) =>
    str
      .replaceAll('_', ' ')
      .toLowerCase()
      .replace(/^\w/, c => c.toUpperCase());

  const handleEditorChange = (id: string, values: any, newState: EditorState, setFieldValue: any) => {
    setEditorStates(prev => ({ ...prev, [id]: newState }));

    const index = values.contentBlocks.findIndex(block => block.id === id);

    if (index === -1) return;

    const raw = convertToRaw(newState.getCurrentContent());

    setFieldValue(`contentBlocks.${index}.editorState`, raw);
    setFieldValue(`contentBlocks.${index}.description`, newState.getCurrentContent().getPlainText());
  };

  useEffect(() => {
    async function getPageByKey() {
      try {
        const result = await dispatch(getPages(PagesType.HOME)).unwrap();

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

        setHomePage({
          ...result,
          contentBlocks: blocksWithId,
        });
      } catch (error: any) {
        if (error.original.errors[0].includes('with key') || error.original.errors[0].includes('find page')) {
          console.log('Section does not exist yet → creating new one');
          setHomePage(null);
          return;
        }

        console.log('error', error);
        setHomePage(null);
        toast.error('Failed to fetch Home page');
      }
    }

    getPageByKey();
  }, [dispatch]);

  async function handleSubmit(values: IHomePageValues) {
    console.log('Submitted:', values);

    // ---- VALIDATION FOR FIRST SLIDER ----
    const firstSlider = values.contentBlocks.find(b => b.contentBlockType === 'SLIDER');

    if (!firstSlider) {
      toast.error('First slider block is missing!');
      return;
    }

    if (!firstSlider.title || firstSlider.title.trim() === '') {
      toast.error('First slider title is required!');
      return;
    }

    if (!firstSlider.files || !Array.isArray(firstSlider.files) || firstSlider.files.length === 0) {
      toast.error('First slider must contain image!');
      return;
    }

    try {
      const result = await handleThunk(updatePages, { id: homePage?.id, data: values }, setSubmitError);

      if (result) {
        setHomePage(result);
        setSubmitError('');
        toast.success(isUpdate ? 'Home page updated successfully!' : 'Home page created successfully!');
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
              const sliderBlocks = values.contentBlocks.filter(b => b.contentBlockType === 'SLIDER');
              const fixedBlocks = values.contentBlocks.filter(b => b.contentBlockType !== 'SLIDER');

              return (
                <div>
                  {/* SLIDERS FIRST */}
                  {/* FIRST SLIDER BLOCK — non removable */}
                  {sliderBlocks.length > 0 &&
                    (() => {
                      const block = sliderBlocks[0];
                      const realIndex = values.contentBlocks.indexOf(block);

                      return (
                        <div className="mb-8" key={realIndex}>
                          <div className="mb-3">
                            <div className="font-black text-lg">Slider #1</div>
                            <div className="text-admin-500 text-sm mt-1">
                              Required: fill in the <b>Title</b> and upload <b>one photo</b>.
                            </div>
                          </div>
                          <div className="mb-4">
                            <Input
                              id={`contentBlocks[${realIndex}].title`}
                              name={`contentBlocks[${realIndex}].title`}
                              type="text"
                              className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                              value={block.title}
                              onChange={handleChange}
                              label="Slider title"
                              labelClass="mb-2 !text-admin-700"
                              required={true}
                            />
                          </div>
                          <div className="mb-4">
                            <Input
                              id={`contentBlocks[${realIndex}].link`}
                              name={`contentBlocks[${realIndex}].link`}
                              type="text"
                              className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                              value={block.link}
                              onChange={handleChange}
                              label="Slider link"
                              labelClass="mb-2 !text-admin-700"
                            />
                          </div>
                          <div className="mb-4">
                            <div className="mb-2 !text-admin-700">Slider description</div>
                            <TextEditor key={editorKey[block.id]} value={editorStates[block.id] || EditorState.createEmpty()} onChange={newState => handleEditorChange(block.id, values, newState, setFieldValue)} />
                          </div>

                          <div>
                            <div className="mb-2 !text-admin-700">
                              Slider photo
                              <span className="text-status-danger-500 text-body"> *</span>
                            </div>
                            <ImageLoading classBlock="min-h-[300px]" isAttach={true} uploadedUrls={block.files || []} onFilesChange={files => setFieldValue(`contentBlocks.${realIndex}.files`, files)} required={true} />
                          </div>
                        </div>
                      );
                    })()}

                  {/* OTHER SLIDERS (can delete) */}
                  {sliderBlocks.slice(1).map((block, i) => {
                    const realIndex = values.contentBlocks.indexOf(block);
                    const sliderNumber = i + 2; // Because first is #1

                    return (
                      <div key={realIndex} className="mb-8">
                        <div className="mb-3 font-black text-lg">{`Slider #${sliderNumber}`}</div>

                        <div className="mb-4">
                          <Input
                            id={`contentBlocks[${realIndex}].title`}
                            name={`contentBlocks[${realIndex}].title`}
                            type="text"
                            value={block.title}
                            onChange={handleChange}
                            label="Slider title"
                            className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                            labelClass="mb-2 !text-admin-700"
                          />
                        </div>

                        <div className="mb-4">
                          <Input
                            id={`contentBlocks[${realIndex}].link`}
                            name={`contentBlocks[${realIndex}].link`}
                            type="text"
                            value={block.link}
                            onChange={handleChange}
                            label="Slider link"
                            className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                            labelClass="mb-2 !text-admin-700"
                          />
                        </div>

                        <div className="mb-4">
                          <div className="mb-2 !text-admin-700">Slider description</div>
                          <TextEditor key={editorKey[block.id]} value={editorStates[block.id] || EditorState.createEmpty()} onChange={newState => handleEditorChange(block.id, values, newState, setFieldValue)} />
                        </div>

                        <div className="mb-4">
                          <div className="mb-2 !text-admin-700">Slider photo</div>
                          <ImageLoading classBlock="min-h-[300px]" isAttach={true} uploadedUrls={block.files || []} onFilesChange={files => setFieldValue(`contentBlocks.${realIndex}.files`, files)} />
                        </div>

                        <button
                          type="button"
                          onClick={async () => {
                            const blockId = block.id;

                            if (block.files) {
                              for (const url of block.files) {
                                try {
                                  await deleteFile(url);
                                } catch (error) {
                                  toast.error(`Failed to delete file. Please save and reload page`);
                                  console.log('Failed to delete file', url, error);
                                }
                              }
                            }
                            const blockIndex = values.contentBlocks.findIndex(b => b.id === block.id);
                            if (blockIndex !== -1) remove(blockIndex);
                            // remove(realIndex);

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
                          className="mt-3 px-3 py-1 bg-red-700 text-white rounded-md hover:bg-red-500"
                        >
                          Remove slider
                        </button>
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => {
                      const blockId = uuid();

                      push({
                        id: blockId,
                        contentBlockType: 'SLIDER',
                        title: '',
                        description: '',
                        files: [],
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
                    className="mt-1 mb-7 px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Add new slider
                  </button>

                  {fixedBlocks.map(block => {
                    const realIndex = values.contentBlocks.indexOf(block);

                    if (block.contentBlockType === 'VIDEO') {
                      return (
                        <div key={realIndex} className="mb-8">
                          <Input
                            id={`contentBlocks[${realIndex}].video_url`}
                            name={`contentBlocks[${realIndex}].video_url`}
                            type="text"
                            value={block.video_url}
                            onChange={handleChange}
                            label="Video URL"
                            labelClass="mb-2 !text-admin-700"
                            className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                          />
                        </div>
                      );
                    }

                    return (
                      <div key={realIndex} className="mb-8">
                        {block.title !== undefined && (
                          <div className="mb-4">
                            <Input
                              id={`contentBlocks[${realIndex}].title`}
                              name={`contentBlocks[${realIndex}].title`}
                              type="text"
                              value={block.title}
                              onChange={handleChange}
                              label={block.contentBlockType === 'HOME_TITLE' ? formatType(block.contentBlockType) : `${formatType(block.contentBlockType)} title`}
                              labelClass="mb-2 !text-admin-700"
                              className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                            />
                          </div>
                        )}
                        {block.description !== undefined && (
                          <>
                            <div className="mb-2 text-admin-700">{block.contentBlockType === 'HOME_DESCRIPTION' ? formatType(block.contentBlockType) : `${formatType(block.contentBlockType)} description`}</div>
                            <TextEditor key={editorKey[block.id]} value={editorStates[block.id] || EditorState.createEmpty()} onChange={newState => handleEditorChange(block.id, values, newState, setFieldValue)} />
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            }}
          </FieldArray>

          {submitError && <div className="text-red-700 text-medium1 my-4"> {submitError}</div>}

          <Button type="submit" disabled={isSubmitting} className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-[0.8] duration-500">
            {isSubmitting ? 'Loading...' : 'Update'}
          </Button>
        </Form>
      )}
    </Formik>
  );
}

export default HomeForm;
