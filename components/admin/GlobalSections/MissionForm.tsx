import Input from '@/components/shared/Input';
import { FieldArray, Form, Formik } from 'formik';
import { GlobalSectionsType } from './enum/types';
import TextEditor from '@/components/TextEditor/TextEditor';
import { useEffect, useState } from 'react';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import Button from '@/components/shared/Button';
import { useAppDispatch } from '@/store/hook';
import { createdGlobalSection, getGlobalSectionByKey, updateGlobalSection } from '@/store/global-sections/action';
import { toast } from 'react-toastify';
import { IGlobalSectionsResponseDTO } from '@/utils/global-sections/type/interfaces';
import useHandleThunk from '@/utils/useHandleThunk';
import { v4 as uuid } from 'uuid';

interface IMissionFormValues {
  title: string;
  key: string;
  contentBlocks: any[];
}

const defaultFormValues = {
  title: 'Our mission',
  pageType: GlobalSectionsType.OUR_MISSION,
  contentBlocks: [
    { id: uuid(), contentBlockType: 'MISSION_BLOCK_1', title: '', description: '', editorState: '' },
    { id: uuid(), contentBlockType: 'MISSION_BLOCK_2', title: '', description: '', editorState: '' },
    { id: uuid(), contentBlockType: 'MISSION_BLOCK_3', title: '', description: '', editorState: '' },
  ],
};

function MissionForm() {
  const dispatch = useAppDispatch();

  const [submitError, setSubmitError] = useState('');
  const [ourMission, setOurMission] = useState<IGlobalSectionsResponseDTO | null>(null);

  const [editorStates, setEditorStates] = useState<Record<number, EditorState>>({});
  const [editorKey, setEditorKey] = useState<Record<string, string>>({});

  const handleThunk = useHandleThunk();

  const isUpdate = Boolean(ourMission?.key);

  const initialValues = {
    title: 'Our mission',
    key: GlobalSectionsType.OUR_MISSION,
    contentBlocks: ourMission?.contentBlocks && ourMission?.contentBlocks.length ? ourMission?.contentBlocks : defaultFormValues.contentBlocks,
  };

  const handleEditorChange = (id: string, values: any, newState: EditorState, setFieldValue: any) => {
    setEditorStates(prev => ({ ...prev, [id]: newState }));

    const index = values.contentBlocks.findIndex(block => block.id === id);

    if (index === -1) return;

    const content = newState.getCurrentContent();
    const raw = convertToRaw(content);

    setFieldValue(`contentBlocks.${index}.editorState`, raw);
    setFieldValue(`contentBlocks.${index}.description`, content.getPlainText());
  };

  useEffect(() => {
    async function getBlockByKey() {
      try {
        const result = await dispatch(getGlobalSectionByKey(GlobalSectionsType.OUR_MISSION)).unwrap();

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

        setOurMission({
          ...result,
          contentBlocks: blocksWithId,
        });
      } catch (error: any) {
        if (error.original.errors[0].includes('with key') || error.original.errors[0].includes('find page')) {
          console.log('Section does not exist yet → creating new one');
          setOurMission(null);
          return;
        }

        console.log('error', error);
        setOurMission(null);
        toast.error('Failed to fetch partners');
      }
    }

    getBlockByKey();
  }, [dispatch]);

  async function handleSubmit(values: IMissionFormValues) {
    console.log('Submitted:', values);

    try {
      let result;

      if (isUpdate) {
        // UPDATE
        result = await handleThunk(updateGlobalSection, { id: ourMission!.id, data: values }, setSubmitError);
      } else {
        // CREATE
        result = await handleThunk(createdGlobalSection, values, setSubmitError);
      }

      if (result) {
        setOurMission(result);
        setSubmitError('');
        toast.success(isUpdate ? 'Section updated successfully!' : 'Section created successfully!');
      }
    } catch (error) {
      toast.error(`Something went wrong! ${error}`);
    }
  }

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
        {({ handleChange, isSubmitting, values, setFieldValue }) => (
          <Form>
            <FieldArray name="contentBlocks">
              {() =>
                values.contentBlocks.map((block, index) => (
                  <div key={block.contentBlockType} className="mb-8">
                    <div className="mb-3 font-black text-lg">{`Block ${index + 1}`}</div>
                    <div className="mb-3">
                      <Input
                        id={`contentBlocks[${index}].title`}
                        name={`contentBlocks[${index}].title`}
                        type="text"
                        value={block.title}
                        onChange={handleChange}
                        label="Mission block title"
                        className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                        labelClass="!text-admin-700"
                      />
                    </div>
                    <TextEditor key={editorKey[block.id]} value={editorStates[block.id]} onChange={newState => handleEditorChange(block.id, values, newState, setFieldValue)} />
                  </div>
                ))
              }
            </FieldArray>

            {submitError && <div className="text-red-700 text-medium1 my-4"> {submitError}</div>}

            <Button type="submit" disabled={isSubmitting} className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-[0.8] duration-500">
              {isSubmitting ? 'Loading...' : isUpdate ? 'Update' : 'Save'}
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default MissionForm;
