import { useAppDispatch } from '@/store/hook';
import { FieldArray, Form, Formik } from 'formik';
import { PagesType } from './enum/types';
import Input from '@/components/shared/Input';
import TextEditor from '@/components/TextEditor/TextEditor';
import { useEffect, useState } from 'react';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import Button from '@/components/shared/Button';
import ImageLoading from '../helperComponents/ImageLoading/ImageLoading';
import useHandleThunk from '@/utils/useHandleThunk';
import { createdPages, getPages, updatePages } from '@/store/pages/action';
import { toast } from 'react-toastify';
import { IPagesResponseDTO } from '@/utils/pages/types/interfaces';

interface IHomePageValues {
  pageType: PagesType;
  contentBlocks: any[];
}

const defaultFormValues = {
  pageType: PagesType.HOME,
  contentBlocks: [
    { contentBlockType: 'SLIDER', title: '', description: '', link: '', files: [], editorState: null },
    { contentBlockType: 'HOME_TITLE', title: '' },
    { contentBlockType: 'HOME_DESCRIPTION', description: '', editorState: null },
    { contentBlockType: 'VIDEO', video_url: '' },
    { contentBlockType: 'JOIN_US', title: '', description: '', editorState: null },
    { contentBlockType: 'JOIN_US', title: '', description: '', editorState: null },
    { contentBlockType: 'JOIN_US', title: '', description: '', editorState: null },
    { contentBlockType: 'PARTNERS', title: '', description: '', editorState: null },
  ],
};

function HomeForm() {
  const dispatch = useAppDispatch();

  const [submitError, setSubmitError] = useState('');
  const [editorStates, setEditorStates] = useState<Record<number, EditorState>>({});
  const [homePage, setHomePage] = useState<IPagesResponseDTO | null>(null);
  const [editorKey, setEditorKey] = useState('');

  const handleThunk = useHandleThunk();

  const isUpdate = Boolean(homePage?.id);

  const initialValues = {
    pageType: PagesType.HOME,
    contentBlocks: homePage?.contentBlocks?.length ? homePage.contentBlocks : defaultFormValues.contentBlocks,
  };

  const formatType = (str: string) =>
    str
      .replaceAll('_', ' ')
      .toLowerCase()
      .replace(/^\w/, c => c.toUpperCase());

  const handleEditorChange = (index: number, newState: EditorState, setFieldValue: any) => {
    setEditorStates(prev => ({ ...prev, [index]: newState }));
    const content = newState.getCurrentContent();
    const raw = convertToRaw(content);

    setFieldValue(`contentBlocks.${index}.editorState`, raw);
    setFieldValue(`contentBlocks.${index}.description`, content.getPlainText());
  };

  useEffect(() => {
    async function getPageByKey() {
      try {
        const result = await dispatch(getPages(PagesType.HOME)).unwrap();

        if (!result?.contentBlocks) return;

        const initialEditors: Record<number, EditorState> = {};

        result.contentBlocks.forEach((block, index) => {
          if (block.text || block.editorState) {
            try {
              if (block.editorState) {
                const content = convertFromRaw(block.editorState);
                initialEditors[index] = EditorState.createWithContent(content);
              } else {
                initialEditors[index] = EditorState.createEmpty();
              }
            } catch (err: any) {
              console.log('err', err);
              initialEditors[index] = EditorState.createEmpty();
            }
          }
        });

        setEditorStates(initialEditors);

        setEditorKey(prev => prev + 1);
        setHomePage(result);
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
      let result;

      if (isUpdate) {
        result = await handleThunk(updatePages, { id: homePage?.id, data: values }, setSubmitError);
      } else {
        result = await handleThunk(createdPages, values, setSubmitError);
      }

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
                            <TextEditor key={editorKey} value={editorStates[realIndex] || EditorState.createEmpty()} onChange={newState => handleEditorChange(realIndex, newState, setFieldValue)} />
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
                          <TextEditor key={editorKey} value={editorStates[realIndex] || EditorState.createEmpty()} onChange={newState => handleEditorChange(realIndex, newState, setFieldValue)} />
                        </div>

                        <div className="mb-4">
                          <div className="mb-2 !text-admin-700">Slider description</div>
                          <ImageLoading classBlock="min-h-[300px]" isAttach={true} uploadedUrls={block.files || []} onFilesChange={files => setFieldValue(`contentBlocks.${realIndex}.files`, files)} />
                        </div>

                        <button type="button" onClick={() => remove(realIndex)} className="mt-3 px-3 py-1 bg-red-700 text-white rounded-md hover:bg-red-500">
                          Remove slider
                        </button>
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() =>
                      push({
                        contentBlockType: 'SLIDER',
                        title: '',
                        description: '',
                        files: [],
                        editorState: null,
                      })
                    }
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
                            <TextEditor value={editorStates[realIndex] || EditorState.createEmpty()} onChange={newState => handleEditorChange(realIndex, newState, setFieldValue)} />
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
            {isSubmitting ? 'Loading...' : isUpdate ? 'Update' : 'Save'}
          </Button>
        </Form>
      )}
    </Formik>
  );
}

export default HomeForm;
