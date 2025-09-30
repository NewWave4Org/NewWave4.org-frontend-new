import Button from '@/components/shared/Button';

import { deleteArticle, getAllArticle } from '@/store/article-content/action';
import { removeArticle } from '@/store/article-content/article-content_slice';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { closeModal } from '@/store/modal/ModalSlice';
import { IArticleBody } from '@/utils/article-content/type/interfaces';
import useHandleThunk from '@/utils/useHandleThunk';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

function ArticleModalDelete({title}: {title: string}) {
  const dispatch = useAppDispatch();
  const handleThunk = useHandleThunk();

  const currentProject = useAppSelector(state => state.modal.payload) as IArticleBody & {id: number};
  const currentPage = useAppSelector(state => state.modal.currentPage)
  const articleStatus = useAppSelector(state => state.modal.articleStatus)
  const chooseSortType = useAppSelector(state => state.modal.chooseSortType)
  const articlesOnPage = useAppSelector(state => state.modal.articlesOnPage)

  const [submitError, setSubmitError] = useState('');

  async function handleDeleteArticle() {
    const result = await handleThunk(
      deleteArticle,
      {id: currentProject.id, articleType: currentProject.articleType},
      setSubmitError,
    );

    if (result) {
      setSubmitError('');
      toast.success(`Your ${title} has been successfully deleted!`);
      dispatch(closeModal());
      dispatch(removeArticle(currentProject.id))

      if(articlesOnPage === 1) {
        const params: any = {
          page: currentPage,
          articleStatus: articleStatus,
          articleType: currentProject.articleType
        };

        if (chooseSortType && chooseSortType !== 'all') {
          params.articleType = chooseSortType;
        }

        dispatch(getAllArticle(params));
      }
    }
  }
  return (
    <>
      <div className="modal__header font-medium text-[22px] text-admin-700 mb-[32px]">
        Delete {title}
      </div>

      <div className="text-admin-700 text-[15px] mb-[40px]">
        Are you sure you want to delete the {title}
        <span className="font-bold"> &quot;{currentProject.title}&quot;</span>?
      </div>

      {submitError && (
        <div className="text-medium text-status-danger-500 mb-4">
          {submitError}
        </div>
      )}

      <div>
        <Button
          type="submit"
          onClick={handleDeleteArticle}
          className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal w-full text-xl p-4 hover:opacity-[0.8] duration-500"
        >
          Delete
        </Button>
      </div>
    </>
  );
}

export default ArticleModalDelete;
