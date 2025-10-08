import ModalType from '@/components/ui/Modal/enums/modals-type';
import Modal from '@/components/ui/Modal/Modal';
import { useAppSelector } from '@/store/hook';
import React from 'react';
import CreateNewUser from '../CreateNewUser/CreateNewUser';
import * as Yup from 'yup';
import { adminRole, emailValidation, nameValidation } from '@/utils/validation';
import EditUser from '../EditUser/EditUser';
import DeleteUser from '../DeleteUser/DeleteUser';

import { ArticleModalDelete, ArticleModalArchive } from '../ArticleModals';
import ArticleModalRestore from '../ArticleModals/ArticleModalRestore';

const CreateNewUserValidationSchema = Yup.object({
  email: emailValidation,
  name: nameValidation,
  roles: adminRole,
});

const Modals = () => {
  const isModalOpen = useAppSelector(state => state.modal.isModalOpen);
  const modalType = useAppSelector(state => state.modal.modalType);
  const modalTitle = useAppSelector(state => state.modal.title);
  return (
    <>
      {isModalOpen && (
        <Modal modalType={modalType} isModalOpen={isModalOpen}>
          {modalType === ModalType.CREATE_NEW_USER && (
            <CreateNewUser validationSchema={CreateNewUserValidationSchema} />
          )}
          {modalType === ModalType.EDIT_USER && (
            <EditUser validationSchema={CreateNewUserValidationSchema} />
          )}
          {modalType === ModalType.DELETE_USER && <DeleteUser />}
          {modalType === ModalType.DELETE_ARTICLE && (
            <ArticleModalDelete title={modalTitle || ''} />
          )}

          {/* {modalType === ModalType.DELETE_PROJECT && (
            <ArticleModalDelete title={modalTitle || ''} />
          )} */}
          {modalType === ModalType.ARCHIVED_ARTICLE && (
            <ArticleModalArchive title={modalTitle} />
          )}
          {modalType === ModalType.ARTICLE_RESTORE && (
            <ArticleModalRestore title={modalTitle} />
          )}
        </Modal>
      )}
    </>
  );
};

export default Modals;
