'use client';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import Select from '@/components/shared/Select';

import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';

import {
  createNewArticle,
  getAllArticle,
} from '@/store/article-content/action';

import { ArticleStatusEnum, ArticleTypeEnum } from '@/utils/ArticleType';
import { extractErrorMessage } from '@/utils/apiErrors';

import { useAppDispatch } from '@/store/hook';
import useHandleThunk from '@/utils/useHandleThunk';
import { useUsers } from '@/utils/hooks/useUsers';

const getContentPath = (articleType: ArticleTypeEnum, id: number) => {
  const base = articleType === ArticleTypeEnum.EVENT ? 'events' : 'articles';
  return `/admin/${base}/new/content?id=${id}`;
};

const getSuccessMessage = (articleType: ArticleTypeEnum) => {
  return articleType === ArticleTypeEnum.EVENT
    ? 'Event created successfully'
    : 'Article created successfully';
};

interface newArticleDTO {
  articleType: string;
  title: string;
  contentBlocks: any[] | null;
  relevantProjectId?: number;
  authorId?: number;
}

interface ProjectOption {
  value: string | number;
  label: string;
}

interface ArticleFormProps {
  articleType: ArticleTypeEnum;
}

const ArticleForm = ({ articleType }: ArticleFormProps) => {
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const handleThunk = useHandleThunk();

  const { usersList, currentAuthor } = useUsers(true);

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    relevantProjectId: Yup.number().required('Please select a project'),
    authorId: Yup.number().required('Author field cannot be empty'),
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await dispatch(
          getAllArticle({
            articleType: ArticleTypeEnum.PROJECT,
            articleStatus: ArticleStatusEnum.PUBLISHED,
          }),
        ).unwrap();

        const mappedProjects = (data.content ?? []).map((project: any) => ({
          value: project.id,
          label: project.title,
        }));

        setProjects(mappedProjects);
      } catch (err) {
        toast.error('Failed to fetch projects');
        console.log(err);
      }
    };

    fetchProjects();
  }, [dispatch]);

  async function handleSubmit(values: newArticleDTO) {
    try {
      const result = await handleThunk(
        createNewArticle,
        { ...values, articleType },
        msg => toast.error(msg),
      );

      if (result) {
        toast.success(getSuccessMessage(values.articleType as ArticleTypeEnum));
        router.push(
          getContentPath(values.articleType as ArticleTypeEnum, result.id),
        );
      }
    } catch (err: any) {
      const message = extractErrorMessage(err?.errors ?? err?.message ?? err);
      toast.error(message);
    }
  }

  return (
    <div className="modal__body">
      <Formik
        enableReinitialize
        initialValues={{
          title: '',
          relevantProjectId: undefined,
          articleType,
          contentBlocks: [],
          authorId: currentAuthor?.id,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, handleChange, isSubmitting, values }) => (
          <Form>
            {/* Title */}
            <div className="mb-5">
              <Input
                required
                onChange={handleChange}
                id="title"
                name="title"
                type="text"
                className="!bg-background-light w-full h-[70px] px-5 rounded-lg !ring-0"
                value={values.title}
                label="Title"
                labelClass="!text-admin-700"
                validationText={
                  touched.title && errors.title ? errors.title : ''
                }
              />
            </div>

            {/* Project */}
            <div className="mb-5">
              <Select
                label="Relevant Project"
                labelClass="!text-admin-700"
                adminSelectClass={true}
                name="relevantProjectId"
                required
                placeholder="Choose project"
                onChange={handleChange}
                options={
                  projects.length > 0
                    ? projects
                    : [
                        {
                          value: '',
                          label: 'No published projects available',
                          disabled: true,
                        },
                      ]
                }
              />
            </div>

            {/* Author */}
            <div className="mb-5">
              <Select
                label="Author"
                adminSelectClass={true}
                name="authorId"
                required
                labelClass="!text-admin-700"
                onChange={handleChange}
                options={usersList}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-[0.8]"
            >
              Save
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ArticleForm;
