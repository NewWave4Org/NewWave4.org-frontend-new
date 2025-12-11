import { Form, Formik } from 'formik';
import { GlobalSectionsType } from './enum/types';
import Button from '@/components/shared/Button';
import ImageLoading from '../helperComponents/ImageLoading/ImageLoading';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/store/hook';
import { IGlobalSectionsResponseDTO } from '@/utils/global-sections/type/interfaces';
import { createdGlobalSection, getGlobalSectionByKey, updateGlobalSection } from '@/store/global-sections/action';
import { toast } from 'react-toastify';
import useHandleThunk from '@/utils/useHandleThunk';

interface IPartnersFormValues {
  title: string;
  key: string;
  contentBlocks: {
    contentBlockType: string;
    files: any[];
  }[];
}

const defaultFormValues = {
  title: 'Our partners',
  key: `${GlobalSectionsType.OUR_PARTNERS}`,
  contentBlocks: [{ contentBlockType: 'PARTNERS', files: [] }],
};

function PartnersForm() {
  const dispatch = useAppDispatch();

  const [submitError, setSubmitError] = useState('');
  const [ourPartners, setOurPartners] = useState<IGlobalSectionsResponseDTO | null>(null);

  const handleThunk = useHandleThunk();

  const isUpdate = Boolean(ourPartners?.key);

  const initialValues = {
    title: 'Our partners',
    key: `${GlobalSectionsType.OUR_PARTNERS}`,
    contentBlocks: ourPartners?.contentBlocks && ourPartners?.contentBlocks.length ? ourPartners?.contentBlocks : defaultFormValues.contentBlocks,
  };

  // Get global block by key
  useEffect(() => {
    async function getBlockByKey() {
      try {
        const result = await dispatch(getGlobalSectionByKey(GlobalSectionsType.OUR_PARTNERS)).unwrap();

        setOurPartners(result);
      } catch (error: any) {
        if (error.original.errors[0].includes('with key') || error.original.errors[0].includes('find page')) {
          console.log('Section does not exist yet → creating new one');
          setOurPartners(null);
          return;
        }

        console.log('error', error);
        toast.error('Failed to fetch partners');
      }
    }

    getBlockByKey();
  }, [dispatch]);

  async function handleSubmit(values: IPartnersFormValues) {
    try {
      let result;

      if (isUpdate) {
        // UPDATE
        result = await handleThunk(updateGlobalSection, { id: ourPartners!.id, data: values }, setSubmitError);
      } else {
        // CREATE
        result = await handleThunk(createdGlobalSection, values, setSubmitError);
      }

      if (result) {
        setOurPartners(result);
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
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>
            <div className="mb-5">
              <ImageLoading
                isAttach={true}
                maxFiles={50}
                label="Add photo"
                classBlock="min-h-[300px]"
                uploadedUrls={values.contentBlocks[0].files || []}
                previewSize={300}
                isObjectCover={false}
                previewClassName="shadow-xl rounded-xl"
                onFilesChange={files => setFieldValue('contentBlocks[0].files', files)}
              />
            </div>

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

export default PartnersForm;
