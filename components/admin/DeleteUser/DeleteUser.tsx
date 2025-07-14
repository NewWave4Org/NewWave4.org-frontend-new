import Button from "@/components/shared/Button";
import { closeModal } from "@/components/ui/Modal/ModalSlice";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { deleteUser, getUsers } from "@/store/users/actions";
import useHandleThunk from "@/utils/useHandleThunk";
import { UserItem } from "@/utils/users/type/interface";
import { useState } from "react";
import { toast } from "react-toastify";

const DeleteUser = () => {
  const dispatch = useAppDispatch();
  const handleThunk = useHandleThunk();

  const currentUser = useAppSelector(state => state.modal.user) as UserItem;
  const token = useAppSelector(state => state.authUser.token);

  const [submitError, setSubmitError] = useState('');

  async function handleDeleteUser() {
    const data = {
      userId: currentUser.id,
      token: token
    }
    const result = await handleThunk(deleteUser, data, setSubmitError);

    if(result) {
      setSubmitError('');
      toast.success('User deleted successfully');
      dispatch(closeModal());
      await dispatch(getUsers(token as string));
    }
    
  }

  return (
    <>
      <div className='modal__header font-medium text-[22px] text-admin-700 mb-[32px]'>Delete user</div>
      <div className="text-admin-700 text-[15px] mb-[40px]">Are you sure you want to delete the user?</div>

      {submitError && (
        <div className='text-medium text-status-danger-500 mb-4'>{submitError}</div>
      )}

      <div>
        <Button
          type="submit"
          onClick={() => handleDeleteUser()}
          className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal w-full text-xl p-4 hover:opacity-[0.8] duration-500"
        >
          Delete
        </Button>
      </div>
    </>
  );
};

export default DeleteUser;