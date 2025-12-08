'use client';

import Input from '@/components/shared/Input';
import { FieldArray, Form, Formik } from 'formik';
import { GlobalSectionsType } from './enum/types';
import Button from '@/components/shared/Button';
import useHandleThunk from '@/utils/useHandleThunk';
import { useEffect, useState } from 'react';
import { createdGlobalSection, getGlobalSectionByKey, updateGlobalSection } from '@/store/global-sections/action';
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/store/hook';
import { IGlobalSectionsResponseDTO } from '@/utils/global-sections/type/interfaces';

interface ISocialLinksValues {
  title: string;
  key: string;
  contentBlocks: any[];
}

const defaultFormValues = {
  title: 'Our social links',
  pageType: GlobalSectionsType.OUR_SOCIAL_LINKS,
  contentBlocks: [
    { contentBlockType: 'FACEBOOK', link: '', isActive: false },
    { contentBlockType: 'INSTAGRAM', link: '', isActive: false },
    { contentBlockType: 'YOUTUBE', link: '', isActive: false },
  ],
};

function SocialLinksForm() {
  const dispatch = useAppDispatch();

  const [submitError, setSubmitError] = useState('');
  const [socialLinks, setSocialLinks] = useState<IGlobalSectionsResponseDTO | null>(null);

  const handleThunk = useHandleThunk();

  const isUpdate = Boolean(socialLinks?.key);

  const initialValues = {
    title: 'Our social links',
    key: GlobalSectionsType.OUR_SOCIAL_LINKS,
    contentBlocks: socialLinks?.contentBlocks && socialLinks?.contentBlocks.length ? socialLinks?.contentBlocks : defaultFormValues.contentBlocks,
  };

  // Get global block by key
  useEffect(() => {
    async function getBlockByKey() {
      try {
        const result = await dispatch(getGlobalSectionByKey(GlobalSectionsType.OUR_SOCIAL_LINKS)).unwrap();

        setSocialLinks(result);
      } catch (error: any) {
        if (error.original.errors[0].includes('with key') || error.original.errors[0].includes('find page')) {
          console.log('Section does not exist yet → creating new one');
          setSocialLinks(null);
          return;
        }

        console.log('error', error);
        toast.error('Failed to fetch partners');
      }
    }

    getBlockByKey();
  }, [dispatch]);

  async function handleSubmit(values: ISocialLinksValues) {
    console.log('Submitted:', values);

    try {
      let result;

      if (isUpdate) {
        // UPDATE
        result = await handleThunk(updateGlobalSection, { id: socialLinks!.id, data: values }, setSubmitError);
      } else {
        // CREATE
        result = await handleThunk(createdGlobalSection, values, setSubmitError);
      }

      if (result) {
        setSocialLinks(result);
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
        {({ handleChange, isSubmitting, values }) => (
          <Form>
            <FieldArray name="contentBlocks">
              {() =>
                values.contentBlocks.map((block, index) => (
                  <div key={block.contentBlockType} className="flex mb-5">
                    <div className="flex-1 mr-10">
                      <Input
                        onChange={handleChange}
                        id={`contentBlocks[${index}].link`}
                        name={`contentBlocks[${index}].link`}
                        type="text"
                        className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                        value={block.link}
                        label={`${block.contentBlockType} link`}
                        labelClass="!text-admin-700"
                      />
                    </div>
                    <div>
                      <Input
                        id={`contentBlocks[${index}].isActive`}
                        name={`contentBlocks[${index}].isActive`}
                        type="checkbox"
                        checked={block.isActive}
                        onChange={handleChange}
                        className="!h-5 !w-5 rounded-full border-gray-300 text-blue-600 focus:ring-blue-500 !ring-0"
                        label="Is active?"
                        labelClass="!text-admin-700"
                      />
                    </div>
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

export default SocialLinksForm;
