'use client';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import Select from '@/components/shared/Select';
import {
  createNewArticle,
  getArticleById,
  updateArticle,
} from '@/store/articles/action';
import { ArticlesProjectOptions } from '@/utils/articles/type/articles-project';
import useHandleThunk from '@/utils/useHandleThunk';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { extractErrorMessage } from '@/utils/apiErrors';

interface newArticleDTO {
  id?: number;
  newsTitle: string;
  newsProjectTag: string;
}

interface IArticleFormProps {
  articleId?: number;
}

const ArticleForm = ({ articleId }: IArticleFormProps) => {
  const [submitError, setSubmitError] = useState('');
  const [article, setArticle] = useState<newArticleDTO | null>(null);
  const router = useRouter();

  const handleThunk = useHandleThunk();

  const validationSchema = Yup.object({
    newsTitle: Yup.string().required('Title is required'),
    newsProjectTag: Yup.string().required('Please select a project'),
  });

  useEffect(() => {
    if (!articleId) return;

    const fetchArticle = async () => {
      try {
        const data = await handleThunk(
          getArticleById,
          articleId,
          setSubmitError,
        );
        setArticle({
          id: data.id,
          newsTitle: data.title,
          newsProjectTag: data.newsProjectTag,
        });
      } catch (err) {
        toast.error('Failed to fetch article');
        console.log(err);
      }
    };

    fetchArticle();
  }, [articleId]);

  async function handleSubmit(values: newArticleDTO) {
    let result;

    try {
      if (values.id) {
        const payload = {
          title: values.newsTitle,
          newsProjectTag: values.newsProjectTag,
        };
        result = await handleThunk(
          updateArticle,
          { id: values.id, data: payload },
          setSubmitError,
        );

        if (result) {
          toast.success('Article updated successfully');
        }
      } else {
        result = await handleThunk(createNewArticle, values, setSubmitError);

        if (result) {
          toast.success('Article created successfully');
          router.push(`/admin/articles/new/content?id=${result.id}`);
        }
      }
    } catch (err: any) {
      const message = extractErrorMessage(err?.errors ?? err?.message ?? err);
      toast.error(message);
      // console.error('Submit error:', err);
    }
  }

  return (
    <>
      <div className="modal__body">
        <Formik
          enableReinitialize
          initialValues={{
            id: article?.id,
            newsTitle: article?.newsTitle || '',
            newsProjectTag: article?.newsProjectTag || '',
          }}
          validationSchema={validationSchema}
          onSubmit={(values: newArticleDTO) => handleSubmit(values)}
        >
          {({ errors, touched, handleChange, isSubmitting, values }) => (
            <Form>
              <div className="mb-5">
                <Input
                  required
                  onChange={handleChange}
                  id="newsTitle"
                  name="newsTitle"
                  type="text"
                  className="!bg-background-light w-full h-[70px] px-5 rounded-lg !ring-0"
                  value={values.newsTitle}
                  label="Title"
                  labelClass="!text-admin-700"
                  validationText={
                    touched.newsTitle && errors.newsTitle
                      ? errors.newsTitle
                      : ''
                  }
                />
              </div>

              <div className="mb-5">
                <Select
                  label="Relevant Project"
                  labelClass="!text-admin-700"
                  adminSelectClass={true}
                  name="newsProjectTag"
                  required
                  placeholder="Choose project"
                  onChange={handleChange}
                  options={ArticlesProjectOptions}
                />
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-[0.8] duration-500"
                >
                  Save
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default ArticleForm;
