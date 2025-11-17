import Input from '@/components/shared/Input';
import { FieldArray, Form, Formik } from 'formik';
import { GlobalSectionsType } from './enum/types';
import TextEditor from '@/components/TextEditor/TextEditor';
import { useState } from 'react';
import { convertToRaw, EditorState } from 'draft-js';
import Button from '@/components/shared/Button';

interface IMissionFormValues {
  title: string;
  key: string;
  contentBlocks: any[];
}

function MissionForm() {
  const [editorStates, setEditorStates] = useState<Record<number, EditorState>>({});

  const initialValues = {
    title: 'Our mission',
    key: GlobalSectionsType.OUR_MISSION,
    contentBlocks: [
      { contentBlockType: 'MISSION_BLOCK_1', title: '', description: '', editorState: '' },
      { contentBlockType: 'MISSION_BLOCK_2', title: '', description: '', editorState: '' },
      { contentBlockType: 'MISSION_BLOCK_3', title: '', description: '', editorState: '' },
    ],
  };

  function handleSubmit(values: IMissionFormValues) {
    console.log('Submitted:', values);
  }

  const handleEditorChange = (index: number, newState: EditorState, setFieldValue: any) => {
    setEditorStates(prev => ({ ...prev, [index]: newState }));
    const content = newState.getCurrentContent();
    const raw = convertToRaw(content);

    setFieldValue(`contentBlocks.${index}.editorState`, raw);
    setFieldValue(`contentBlocks.${index}.description`, content.getPlainText());
  };

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ errors, touched, handleChange, isSubmitting, values, setFieldValue }) => (
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
                    <TextEditor value={editorStates[index]} onChange={newState => handleEditorChange(index, newState, setFieldValue)} />
                  </div>
                ))
              }
            </FieldArray>

            <Button type="submit" disabled={isSubmitting} className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-[0.8] duration-500">
              {isSubmitting ? 'Loading...' : 'Save'}
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default MissionForm;
