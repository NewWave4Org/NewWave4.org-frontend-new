import Button from "@/components/shared/Button";
import { closeModal } from "@/components/ui/Modal/ModalSlice";
import { useAppDispatch, useAppSelector } from "@/store/hook";

const DeleteUser = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.modal.user);
  console.log('delete modal', currentUser);
  function handleDeleteUser() {
    dispatch(closeModal());
  }
  return (
    <>
      <div className='modal__header font-medium text-[22px] text-admin-700 mb-[32px]'>Delete user</div>
      <div className="text-admin-700 text-[15px] mb-[40px]">Are you sure you want to delete the user?</div>
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