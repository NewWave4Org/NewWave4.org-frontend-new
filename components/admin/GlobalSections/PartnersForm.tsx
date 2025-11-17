import { Form, Formik } from 'formik';
import { GlobalSectionsType } from './enum/types';
import Button from '@/components/shared/Button';
import ImageLoading from '../helperComponents/ImageLoading/ImageLoading';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/store/hook';
import { IGlobalSectionsResponseDTO } from '@/utils/global-sections/type/interfaces';
import { createdGlobalSection, getGlobalSectionByKey } from '@/store/global-sections/action';
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
  key: GlobalSectionsType.OUR_PARTNERS,
  contentBlocks: [{ contentBlockType: 'PARTNERS', files: [] }],
};

function PartnersForm() {
  const dispatch = useAppDispatch();

  const [submitError, setSubmitError] = useState('');
  const [ourPartners, setOurPartners] = useState<IGlobalSectionsResponseDTO | null>(null);

  const handleThunk = useHandleThunk();

  const initialValues = {
    title: 'Our partners',
    key: GlobalSectionsType.OUR_PARTNERS,
    contentBlocks: ourPartners?.contentBlocks && ourPartners?.contentBlocks.length ? ourPartners?.contentBlocks : defaultFormValues.contentBlocks,
  };

  // Get global block by key
  useEffect(() => {
    async function getBlockByKey() {
      try {
        const result = await dispatch(getGlobalSectionByKey(GlobalSectionsType.OUR_PARTNERS)).unwrap();

        setOurPartners(result);
      } catch (error) {
        console.log('error', error);
        toast.error('Failed to fetch partners');
      }
    }

    getBlockByKey();
  }, [dispatch]);

  async function handleSubmit(values: IPartnersFormValues) {
    console.log('Submitted:', values);
    try {
      const result = await handleThunk(createdGlobalSection, values, setSubmitError);

      if (result) {
        setOurPartners(result);
        setSubmitError('');
        toast.success('Your social links were updated successfully!');
      }
    } catch (error) {
      toast.error(`Something go wrong! ${error}`);
    }
  }
  return (
    <>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>
            <div className="mb-5">
              <ImageLoading
                articleId={1}
                contentType={GlobalSectionsType.OUR_PARTNERS}
                label="Add photo"
                classBlock="min-h-[300px]"
                uploadedUrls={values.contentBlocks[0].files || []}
                positionBlockImg={true}
                onFilesChange={files => setFieldValue('contentBlocks[0].files', files)}
              />
            </div>

            {submitError && <div className="text-red-700 text-medium1 my-4"> {submitError}</div>}

            <Button type="submit" disabled={isSubmitting} className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-[0.8] duration-500">
              {isSubmitting ? 'Loading...' : 'Save'}
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default PartnersForm;
