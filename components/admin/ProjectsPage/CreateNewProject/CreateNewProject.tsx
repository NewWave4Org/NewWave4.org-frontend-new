'use client';

import * as Yup from 'yup';
import Input from '@/components/shared/Input';
import { ArticleType, ArticleTypeEnum } from '@/utils/ArticleType';
import { Form, Formik, FormikHelpers } from 'formik';
import Button from '@/components/shared/Button';

import { useState } from 'react';
import useHandleThunk from '@/utils/useHandleThunk';
import { createNewArticle } from '@/store/article-content/action';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

interface ICreateNewArticle {
  articleType: ArticleType;
  title: string;
}

function CreateNewProject() {
  const [submitError, setSubmitError] = useState('');

  const handleThunk = useHandleThunk();
  const router = useRouter();

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
  });

  async function handleSubmit(values: ICreateNewArticle, { setSubmitting }: FormikHelpers<ICreateNewArticle>) {
    try {
      const result = await handleThunk(createNewArticle, values, setSubmitError);

      if (!result || typeof result.id === 'undefined') {
        const msg = 'Unexpected response from createNewArticle';
        setSubmitError(msg);
        console.error(msg, result);
        return;
      }

      setSubmitError('');
      toast.success('Great! Your title is saved — now you can keep building your project.');
      router.push(`/admin/projects/new/content?id=${result.id}`);
    } catch (err) {
      console.error('handleSubmit error:', err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="text-medium1 mb-3">Let’s begin! Enter a title for your project to move on</div>

      <Formik<ICreateNewArticle>
        initialValues={{
          articleType: ArticleTypeEnum.PROJECT,
          title: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, handleChange, isSubmitting, values }) => (
          <Form>
            <div className="mb-5">
              <Input
                required
                onChange={handleChange}
                id="title"
                name="title"
                type="text"
                className="!bg-background-light w-full h-[70px] px-5 rounded-lg !ring-0"
                value={values.title}
                label="Project title"
                labelClass="!text-admin-700"
                validationText={touched.title && errors.title ? errors.title : ''}
              />
            </div>
            {submitError && <div className="mb-5 text-red-700">{submitError}</div>}
            <Button type="submit" disabled={isSubmitting} className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-[0.8] duration-500">
              {isSubmitting ? 'Loading...' : 'Create new project'}
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default CreateNewProject;
