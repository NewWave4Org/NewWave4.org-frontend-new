import { useAppDispatch } from '@/store/hook';
import React, { ReactNode } from 'react';
import { closeModal } from './ModalSlice';
import CloseIcon from '@/components/icons/symbolic/CloseIcon';
import { clearUserById } from '@/store/users/users_slice';

type ModalProps = {
  modalType: string | null,
  isModalOpen: boolean,
  children: ReactNode
}

const Modal = ({children, modalType}: ModalProps) => {
  const dispatch = useAppDispatch();

  function handleCloseModal(e: React.MouseEvent<HTMLElement>) {
    if(e.target  === e.currentTarget) {
      dispatch(closeModal());
      dispatch(clearUserById())
    }
  }

  return (
    <div className='modal modal-open' id={modalType || ''} onClick={(e) => handleCloseModal(e)}>
      <div className='modal-box' onClick={(e) => e.stopPropagation()}>
        <span onClick={() => dispatch(closeModal())} className='modal__close'>
          <CloseIcon />
        </span>
        {children}
      </div>
    </div>
  );
};

export default Modal;