import Button from '@/components/shared/Button';
import { closeModal } from '@/store/modal/ModalSlice';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { deleteArticle, allArticles } from '@/store/articles/action';
import useHandleThunk from '@/utils/useHandleThunk';
import { Article } from '@/utils/articles/type/interface';
import { useState } from 'react';
import { toast } from 'react-toastify';

const DeleteArticle = () => {
  const dispatch = useAppDispatch();
  const handleThunk = useHandleThunk();

  const currentArticle = useAppSelector(
    state => state.modal.payload,
  ) as Article;

  const [submitError, setSubmitError] = useState('');

  async function handleDeleteArticle() {
    const result = await handleThunk(
      deleteArticle,
      currentArticle.id,
      setSubmitError,
    );

    if (result) {
      setSubmitError('');
      toast.success('Article deleted successfully');
      dispatch(closeModal());
      await dispatch(allArticles({ page: 0 }));
    }
  }

  return (
    <>
      <div className="modal__header font-medium text-[22px] text-admin-700 mb-[32px]">
        Delete article
      </div>

      <div className="text-admin-700 text-[15px] mb-[40px]">
        Are you sure you want to delete the article
        <span className="font-bold"> &quot;{currentArticle.title}&quot;</span>?
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
};

export default DeleteArticle;
