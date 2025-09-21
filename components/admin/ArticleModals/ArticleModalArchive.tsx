import Button from '@/components/shared/Button';

import { archivedArticle } from '@/store/article-content/action';
import { removeArticle } from '@/store/article-content/article-content_slice';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { closeModal } from '@/store/modal/ModalSlice';
import { IArticleBody } from '@/utils/article-content/type/interfaces';
import useHandleThunk from '@/utils/useHandleThunk';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

function ArticleModalArchive({title}: {title?: string}) {
  const [submitError, setSubmitError] = useState('');
  const dispatch = useAppDispatch();
  const handleThunk = useHandleThunk();

  const currentProject = useAppSelector(state => state.modal.payload) as IArticleBody & {id: number};

  async function handleDeleteArticle() {
      const result = await handleThunk(
        archivedArticle,
        currentProject.id,
        setSubmitError,
      );
  
      if (result) {
        setSubmitError('');
        toast.success(`${title} archived successfully`);
        dispatch(closeModal());
        dispatch(removeArticle(currentProject.id))
      }
    }

  return (
    <>
      <>
      <div className="modal__header font-medium text-[22px] text-admin-700 mb-[32px]">
        Archive the {title}
      </div>

      <div className="text-admin-700 text-[15px] mb-[40px]">
        Are you sure you want to archive the {title}
        <span className="font-bold"> "{currentProject.title}"</span>?
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
          Add to archive
        </Button>
      </div>
    </>
    </>
  );
}

export default ArticleModalArchive;