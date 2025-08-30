'use client';
import EditIcon from '@/components/icons/symbolic/EditIcon';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import TextArea from '@/components/shared/TextArea';
import {
  createContentBlock,
  deleteContentBlock,
  getArticleFullById,
  updateContentBlock,
} from '@/store/articles/action';
import { useAppDispatch } from '@/store/hook';
import { ContentBlockType } from '@/utils/articles/type/contentBlockType';
import { ArticleResponseDTO } from '@/utils/articles/type/interface';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

interface ArticleContentDTO {
  textblock1: string;
  textblock2: string;
  quote: string;
  video: string;
}

interface IArticleContent {
  articleId?: number;
}

const ArticleContent = ({ articleId }: IArticleContent) => {
  const dispatch = useAppDispatch();
  const [submitError, setSubmitError] = useState('');
  const [article, setArticle] = useState<ArticleResponseDTO | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isEdit = pathname.includes('/edit');

  const validationSchema = Yup.object({
    textblock1: Yup.string(),
    textblock2: Yup.string(),
    quote: Yup.string(),
    video: Yup.string().url('Must be a valid URL').nullable(),
  });

  useEffect(() => {
    if (!articleId) return;

    const fetchArticle = async () => {
      try {
        const data: ArticleResponseDTO = await dispatch(
          getArticleFullById(articleId),
        ).unwrap();
        setArticle(data);
      } catch (err) {
        toast.error('Failed to fetch article');
      }
    };

    fetchArticle();
  }, [articleId, dispatch]);

  async function handleCreateNewArticleContent(values: ArticleContentDTO) {
    const blocks: {
      type: ContentBlockType;
      data: string;
      label: string;
      orderIndex: number;
    }[] = [
      {
        type: ContentBlockType.MAIN_NEWS_BLOCK,
        data: values.textblock1,
        label: 'Text block 1',
        orderIndex: 1,
      },
      {
        type: ContentBlockType.TEXT,
        data: values.textblock2,
        label: 'Text block 2',
        orderIndex: 2,
      },
      {
        type: ContentBlockType.QUOTE,
        data: values.quote,
        label: 'Quote',
        orderIndex: 3,
      },
      {
        type: ContentBlockType.VIDEO,
        data: values.video,
        label: 'Video',
        orderIndex: 4,
      },
    ];

    const results = await Promise.all(
      blocks.map(async block => {
        try {
          const existingBlock = article?.contentBlocks?.find(
            b => b.contentBlockType === block.type,
          );

          if (existingBlock) {
            if (!block.data) {
              await dispatch(deleteContentBlock(existingBlock.id)).unwrap();
            } else {
              await dispatch(
                updateContentBlock({
                  id: existingBlock.id,
                  data: {
                    contentBlockType: block.type,
                    data: block.data,
                    orderIndex: block.orderIndex,
                  },
                }),
              ).unwrap();
            }
          } else {
            if (block.data) {
              await dispatch(
                createContentBlock({
                  id: articleId!,
                  data: {
                    contentBlockType: block.type,
                    data: block.data,
                    orderIndex: block.orderIndex,
                  },
                }),
              ).unwrap();
            }
          }

          return { label: block.label, success: true };
        } catch (err) {
          return { label: block.label, success: false, error: err };
        }
      }),
    );

    const failedBlocks = results.filter(r => !r.success);

    if (failedBlocks.length === 0) {
      toast.success('All content blocks saved successfully!');
    } else {
      const failedNames = failedBlocks.map(b => b.label).join(', ');
      toast.error(`Failed to save: ${failedNames}`);
      setSubmitError(`Failed to save: ${failedNames}`);
    }

    router.push(`/admin/articles/`);
  }

  return (
    <>
      <div className="modal__body">
        {!isEdit && (
          <div className="flex mb-3">
            <EditIcon />
            <h4 className="text-h5 pl-2">{article?.title}</h4>
          </div>
        )}

        <Formik
          enableReinitialize
          initialValues={{
            textblock1:
              article?.contentBlocks?.find(
                b => b.contentBlockType === 'MAIN_NEWS_BLOCK',
              )?.data || '',
            textblock2:
              article?.contentBlocks?.find(b => b.contentBlockType === 'TEXT')
                ?.data || '',
            quote:
              article?.contentBlocks?.find(b => b.contentBlockType === 'QUOTE')
                ?.data || '',
            video:
              article?.contentBlocks?.find(b => b.contentBlockType === 'VIDEO')
                ?.data || '',
          }}
          validationSchema={validationSchema}
          onSubmit={(values: ArticleContentDTO) =>
            handleCreateNewArticleContent(values)
          }
        >
          {({ errors, touched, handleChange, isSubmitting, values }) => (
            <Form>
              <div className="w-full mb-2">
                <TextArea
                  id="textblock1"
                  label="Text block 1"
                  className="!bg-background-light w-full h-[100px] px-5 rounded-lg !ring-0 !max-w-full"
                  labelClass=" !text-admin-700"
                  value={values.textblock1}
                  onChange={handleChange}
                />
              </div>

              <div className="w-full mb-2">
                <TextArea
                  id="quote"
                  label="Quote"
                  className="!bg-background-light w-full h-[100px] px-5 rounded-lg !ring-0 !max-w-full"
                  labelClass=" !text-admin-700"
                  value={values.quote}
                  onChange={handleChange}
                />
              </div>

              <div className="w-full mb-2">
                <TextArea
                  id="textblock2"
                  label="Text block 2"
                  className="!bg-background-light w-full h-[100px] px-5 rounded-lg !ring-0 !max-w-full"
                  labelClass=" !text-admin-700"
                  value={values.textblock2}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-5">
                <Input
                  onChange={handleChange}
                  id="video"
                  type="text"
                  className="!bg-background-light w-full h-[70px] px-5 rounded-lg !ring-0"
                  value={values.video}
                  label="Video"
                  labelClass="!text-admin-700"
                  validationText={
                    touched.video && errors.video ? errors.video : ''
                  }
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

export default ArticleContent;
