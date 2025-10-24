'use client';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import Select from '@/components/shared/Select';
import {
  createNewArticle,
  getArticleById,
  updateArticle,
  getAllArticle,
} from '@/store/article-content/action';

import useHandleThunk from '@/utils/useHandleThunk';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { extractErrorMessage } from '@/utils/apiErrors';
import {
  ArticleStatusEnum,
  ArticleType,
  ArticleTypeEnum,
} from '@/utils/ArticleType';
import { GetArticleByIdResponseDTO } from '@/utils/article-content/type/interfaces';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { getUsers } from '@/store/users/actions';

interface newArticleDTO {
  id?: number;
  articleType: ArticleType;
  title: string;
  contentBlocks: any[] | null;
  relevantProjectId?: number;
  authorId?: number;
}

export interface CreateNewArticleRequestDTO {
  articleType: ArticleType;
  title: string;
  contentBlocks: any[] | null;
  relevantProjectId?: number;
  authorId?: number;
}

interface ProjectOption {
  value: string | number;
  label: string;
}

interface IArticleFormProps {
  articleId?: number;
}

const ArticleForm = ({ articleId }: IArticleFormProps) => {
  const [article, setArticle] = useState<newArticleDTO | null>(null);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const handleThunk = useHandleThunk();

  const currentUser = useAppSelector(state => state.authUser.user);
  const allUsers = useAppSelector(state => state.users.users);
  const verifiedUsers = allUsers.filter(user => user.verificatedUser === true);
  const currentAuthor = allUsers.find(user => user.name === currentUser?.name);

  const usersList = verifiedUsers.map(user => ({
    value: user.id,
    label: user.name,
  }));

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    relevantProjectId: Yup.number().required('Please select a project'),
    authorId: Yup.number().required('Author field cannot be empty'),
  });

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

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
        console.error(err);
      }
    };

    fetchProjects();
  }, [dispatch]);

  useEffect(() => {
    if (!articleId) return;

    const fetchArticle = async () => {
      try {
        const data: GetArticleByIdResponseDTO = await handleThunk(
          getArticleById,
          { id: articleId, articleType: 'NEWS' },
          msg => toast.error(msg),
        );
        setArticle({
          id: data.id,
          title: data.title,
          articleType: data.articleType,
          relevantProjectId: data.relevantProjectId,
          contentBlocks: data.contentBlocks,
        });
      } catch (err) {
        toast.error('Failed to fetch article');
        console.log(err);
      }
    };

    fetchArticle();
  }, [articleId, handleThunk]);

  async function handleSubmit(values: newArticleDTO) {
    let result;

    try {
      if (values.id) {
        console.log('update');

        const payload = {
          title: values.title,
          relevantProjectId: values.relevantProjectId,
          authorId: values.authorId,
          articleType: values.articleType,
        };
        result = await handleThunk(
          updateArticle,
          { id: values.id, data: payload },
          msg => toast.error(msg),
        );

        if (result) {
          toast.success('Article updated successfully');
        }
      } else {
        result = await handleThunk(createNewArticle, values, msg =>
          toast.error(msg),
        );

        if (result) {
          toast.success('Article created successfully');
          router.push(`/admin/articles/new/content?id=${result.id}`);
        }
      }
    } catch (err: any) {
      const message = extractErrorMessage(err?.errors ?? err?.message ?? err);
      toast.error(message);
    }
  }

  return (
    <>
      <div className="modal__body">
        <Formik
          enableReinitialize
          initialValues={{
            id: article?.id,
            title: article?.title || '',
            relevantProjectId: article?.relevantProjectId,
            articleType: 'NEWS',
            contentBlocks: article?.contentBlocks || [],
            authorId: currentAuthor?.id,
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

              <div className="mb-5">
                <Select
                  label="Change Author (if needed)"
                  adminSelectClass={true}
                  name="authorId"
                  required
                  labelClass="!text-admin-700"
                  onChange={handleChange}
                  options={usersList}
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
