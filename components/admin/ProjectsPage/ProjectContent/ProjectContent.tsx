'use client';

import { useAppDispatch, useAppSelector } from '@/store/hook';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';

import { toast } from 'react-toastify';

import { FieldArray, Form, Formik, FormikHelpers } from 'formik';
import Button from '@/components/shared/Button';
import TextArea from '@/components/shared/TextArea';
import ImageLoading from '../../ImageLoading/ImageLoading';
import LinkBtn from '@/components/shared/LinkBtn';
import { getArticleById, publishArticle, updateArticle } from '@/store/article-content/action';
import Input from '@/components/shared/Input';
import { GerArticleByIdResponseDTO } from '@/utils/article-content/type/interfaces';
import { ArticleType, ArticleTypeEnum } from '@/utils/ArticleType';
import useHandleThunk from '@/utils/useHandleThunk';
import { getUsers } from '@/store/users/actions';
import Select from '@/components/shared/Select';
import { typeSocialMediaList } from '@/data/projects/typeSocialMediaList';


export interface UpdateArticleFormValues {
  title: string;
  articleType: ArticleType;
  authorId: string;
  articleStatus: string;
  contentBlocks: any[];
}

const validationSchema = Yup.object({
  title: Yup.string()
          .required('Title field cannot be empty'),
  authorId: Yup.number()
            .required('Author field cannot be empty')
});

function ProjectContent({ projectId }: { projectId: number }) {
  const dispatch = useAppDispatch();
  const handleThunk = useHandleThunk();
  const pathname = usePathname();

  const [project, setProject] = useState<GerArticleByIdResponseDTO | null>(null);
  const [submitError, setSubmitError] = useState('');

  const currentUser = useAppSelector(state => state.authUser.user);
  const allUsers = useAppSelector(state => state.users.users);
  const currentAuthor = allUsers.find(user => user.name === currentUser?.name)

  const usersList = allUsers.map(user => ({
    value: user.id.toString(),
    label: user.name
  }))

  const defaultFormValues: UpdateArticleFormValues = {
    title: '',
    articleType: ArticleTypeEnum.PROJECT,
    authorId: String(currentAuthor?.id!),
    articleStatus: '',
    contentBlocks: [
      { contentBlockType: 'VIDEO', videoUrl: '' },
      { contentBlockType: 'QUOTE', text: '' },
      { contentBlockType: 'LINK_TO_SITE', siteUrl: '' },
      { contentBlockType: 'TYPE_SOCIAL_MEDIA', typeSocialMedia: '' },
      { contentBlockType: 'LINK_TO_SOCIAL_MEDIA', socialMediaUrl: '' },
      { contentBlockType: 'SECTION', sectionTitle: '' ,text: '',  files: [] },
    ],
  };


  //GET project by id
  useEffect(() => {
    if (!projectId) return;

    async function fetchFullProjectById() {
      try {
        const result = await dispatch(getArticleById({id: projectId, articleType: ArticleTypeEnum.PROJECT})).unwrap();
        setProject(result)
      } catch (error) {
        console.log('error', error)
        toast.error('Failed to fetch project');
      }
    }
    fetchFullProjectById();
  }, [projectId]);

  //GET all users for dropdown Change Author
  useEffect(() => {
    if(projectId) {
      dispatch(getUsers());
    }
  }, [dispatch])


  //Action for Save the project
  async function handleSubmit(values: UpdateArticleFormValues, {setSubmitting}:FormikHelpers<UpdateArticleFormValues>) {
    try {
      const result = await handleThunk(updateArticle, {id: projectId, data: values}, setSubmitError);
      setProject(result);
      if (result) {
        setSubmitError('');
        const message = pathname.includes("/edit")
        ? "Your project was updated successfully!"
        : "Your project was created successfully!";
        toast.success(message)
      }
    } catch (error) {
      toast.error(`Something go wrong! ${error}`)
    } finally {
      setSubmitting(false);
    }
    
  }

  //Action for publish the project
  async function handlePublish(projectId: number) {
    const result = await handleThunk(publishArticle, projectId,  (errMsg) => {
      toast.error(errMsg);
    });

    if(result) {
      toast.success('Congratulations! Your project has been published successfully.')
    }
  }

  return (
    <div>
      <Formik<UpdateArticleFormValues>
        enableReinitialize
        initialValues={{
          title: project?.title || defaultFormValues.title,
          authorId: project?.authorId || defaultFormValues.authorId,
          articleType: project?.articleType || defaultFormValues.articleType,
          articleStatus: project?.articleStatus || defaultFormValues.articleStatus,
          contentBlocks: Array.isArray(project?.contentBlocks) && project.contentBlocks.length
            ? project.contentBlocks
            : defaultFormValues.contentBlocks,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, handleChange, isSubmitting, values, setFieldValue }) => (
          <Form>
           <div className="mb-5">
              <Input
                onChange={handleChange}
                required
                id="title"
                name="title"
                type="text"
                maxLength={undefined}
                className="!bg-background-light w-full h-[70px] px-5 rounded-lg !ring-0"
                value={values?.title || ''}
                label="Project title"
                labelClass="!text-admin-700"
                validationText={
                  touched.title && errors.title ? errors.title : ''
                }
              />
            </div>

            <div className="mb-5">
              <Select 
                label='Change Author (if needed)'
                adminSelectClass={true}
                name="authorId"
                required
                labelClass="!text-admin-700"
                defaultValue={values.authorId ? String(values.authorId) : ""}
                onChange={handleChange}
                options={usersList}
              />
            </div>

            <FieldArray name="contentBlocks">
              {({push, remove}) => {
                const initialBlocks = values.contentBlocks?.slice(0, 6) || [];
                const additionalBlocks = values.contentBlocks?.slice(6) || [];

                return (
                  <div className="mb-5">
                    {/* Base block */}
                    <div className='mb-4'>
                      {initialBlocks[0].contentBlockType === 'VIDEO' && (
                        <Input
                          id="contentBlocks.0.videoUrl"
                          name="contentBlocks.0.videoUrl"
                          label="Video link"
                          labelClass="!text-admin-700"
                          className="!bg-background-light w-full h-[70px] px-5 rounded-lg !ring-0"
                          value={initialBlocks[0].videoUrl}
                          onChange={handleChange}
                        />
                      )}
                    </div>

                    <div className='mb-4'>
                      {initialBlocks[1].contentBlockType === 'QUOTE' && (
                        <TextArea
                          id="contentBlocks.1.text"
                          name="contentBlocks.1.text"
                          label="Quote text"
                          labelClass="!text-admin-700"
                          className="!bg-background-light w-full h-[200px] px-5 rounded-lg !ring-0 !max-w-full"
                          value={initialBlocks[1].text}
                          onChange={handleChange}
                        />
                      )}
                    </div>

                    <div className='mb-4'>
                      {initialBlocks[2].contentBlockType === 'LINK_TO_SITE' && (
                        <Input
                          id="contentBlocks.2.siteUrl"
                          name="contentBlocks.2.siteUrl"
                          label="Link to web-site"
                          labelClass="!text-admin-700"
                          className="!bg-background-light w-full h-[70px] px-5 rounded-lg !ring-0"
                          value={initialBlocks[2].siteUrl}
                          onChange={handleChange}
                        />
                      )}
                    </div>

                    <div className='flex gap-4'>
                      <div className='w-1/2 mb-4'>
                        {initialBlocks[3].contentBlockType === 'TYPE_SOCIAL_MEDIA' && (
                          <Select 
                            label='Change type social media (if needed)'
                            adminSelectClass={true}
                            name="contentBlocks.3.typeSocialMedia"
                            labelClass="!text-admin-700"
                            placeholder="Media types"
                            defaultValue={initialBlocks[3].typeSocialMedia || ''}
                            onChange={handleChange}
                            options={typeSocialMediaList}
                            parentClassname='h-[70px]'
                          />
                        )}
                      </div>

                      <div className='w-1/2 mb-4'>
                        {initialBlocks[4].contentBlockType === 'LINK_TO_SOCIAL_MEDIA' && (
                          <Input
                            id="contentBlocks.4.socialMediaUrl"
                            name="contentBlocks.4.socialMediaUrl"
                            label="Link to social media"
                            labelClass="!text-admin-700"
                            className="!bg-background-light w-full h-[70px] px-5 rounded-lg !ring-0"
                            value={initialBlocks[4].socialMediaUrl}
                            onChange={handleChange}
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4 mb-4">
                      {/* TEXT block */}
                      {initialBlocks[5].contentBlockType === 'SECTION' && (
                        <>
                          <div className="w-1/2 h-[442px] flex flex-col flex-1">
                            <div className='mb-4'>
                              <Input
                                onChange={handleChange}
                                id='contentBlocks.5.sectionTitle'
                                name='contentBlocks.5.sectionTitle'
                                type="text"
                                className="!bg-background-light w-full h-[70px] px-5 rounded-lg !ring-0"
                                value={initialBlocks[5].sectionTitle}
                                label="Section title"
                                labelClass="!text-admin-700"
                              />
                            </div>

                            <TextArea
                              id="contentBlocks.5.text"
                              name="contentBlocks.5.text"
                              label="Text block"
                              value={initialBlocks[5].text}
                              labelClass="!text-admin-700"
                              className="!bg-background-light w-full flex-1 px-5 rounded-lg !ring-0 !max-w-full"
                              onChange={handleChange}
                            />
                     
                          </div>
                          <div className="w-1/2 h-[442px]">
                            <ImageLoading
                              articleId={projectId}
                              label="Add photo"
                              classBlock="h-[100px]"
                              contentType={ArticleTypeEnum.PROJECT}
                              uploadedUrls={initialBlocks[5].files || []}
                              onFilesChange={files => setFieldValue('contentBlocks.5.files', files)}
                            />
                          </div>
                        </>
                      )}
                      {/* PHOTO block */}
                      
                    </div>


                    {additionalBlocks.map((block, pairIndex) => {
                      const index = pairIndex + 6; 

                      if (block.contentBlockType !== 'SECTION') {
                        return null; 
                      }

                      return (
                        <div key={index} className='mb-5'>
                          <div className={`flex gap-4 mb-3 ${pairIndex % 2 === 0 ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className="w-1/2">
                              <div className='mb-4'>
                                <Input
                                  onChange={handleChange}
                                  id={`contentBlocks.${index}.sectionTitle`}
                                  name={`contentBlocks.${index}.sectionTitle`}
                                  type="text"
                                  className="!bg-background-light w-full h-[70px] px-5 rounded-lg !ring-0"
                                  value={block.sectionTitle}
                                  label="Section title"
                                  labelClass="!text-admin-700"
                                />
                              </div>

                              <div className='mb-4'>
                                <TextArea
                                  id={`contentBlocks.${index}.text`}
                                  name={`contentBlocks.${index}.text`}
                                  label="Text block"
                                  value={block.text}
                                  labelClass="!text-admin-700"
                                  className="!bg-background-light w-full h-[300px] px-5 rounded-lg !ring-0 !max-w-full"
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
      
                            <div className="w-1/2">
                              <ImageLoading
                                articleId={projectId}
                                maxFiles={1}
                                label="Add photo"
                                classBlock="h-[100px]"
                                contentType={ArticleTypeEnum.PROJECT}
                                uploadedUrls={block?.files || []}
                                onFilesChange={files => setFieldValue(`contentBlocks.${index}.files`, files)}
                              />
                            </div>
                    
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              remove(index);
                            }}
                            className="px-3 py-1 bg-red-700 text-white rounded-md self-start hover:bg-red-500 duration-500"
                          >
                            Remove block pair
                          </button>
                        </div>
                      );
                    })}

                    {/* Added blocks */}
                    <button
                      type="button"
                      onClick={() => {
                        push({
                          contentBlockType: 'SECTION',
                          sectionTitle: '',
                          text: '',
                          files: [],
                        });
                      }}
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                      Add new block pair
                    </button>
                  </div>
                )
              }}
            </FieldArray>

            {submitError && <div className='text-red-700 text-medium1 mt-4'> {submitError}</div>}

            <div className='mt-10'>
              <sup className='font-bold text-red-600 text-small2'>*</sup>
              <em>You must save the page before you can preview or publish it</em>
            </div>

            <div className="flex gap-x-6 mt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-[0.8] duration-500"
              >
                Save
              </Button>

              <LinkBtn
                href={`/admin/projects/preview?id=${projectId}`}
                targetLink="_self"
                className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-80 duration-300"
              >
                Preview
              </LinkBtn>

              {project?.articleStatus !== 'PUBLISHED' && (
                <Button
                  onClick={() => handlePublish(projectId)}
                  type="button"
                  className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-80 duration-300"
                >
                  Publish
                </Button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ProjectContent;
