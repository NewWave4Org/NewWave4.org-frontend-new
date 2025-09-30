import ModalType from '@/components/ui/Modal/enums/modals-type';
import Modal from '@/components/ui/Modal/Modal';
import { useAppSelector } from '@/store/hook';
import React from 'react';
import CreateNewUser from '../CreateNewUser/CreateNewUser';
import * as Yup from 'yup';
import { adminRole, emailValidation, nameValidation } from '@/utils/validation';
import EditUser from '../EditUser/EditUser';
import DeleteUser from '../DeleteUser/DeleteUser';
import DeleteArticle from '../DeleteArticle/DeleteArticle';

import {ArticleModalDelete, ArticleModalArchive} from '../ArticleModals';
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
          {modalType === ModalType.CREATENEWUSER && (
            <CreateNewUser validationSchema={CreateNewUserValidationSchema} />
          )}
          {modalType === ModalType.EDITUSER && (
            <EditUser validationSchema={CreateNewUserValidationSchema} />
          )}
          {modalType === ModalType.DELETEUSER && <DeleteUser />}
          {modalType === ModalType.DELETEARTICLE && <DeleteArticle />}

          {modalType === ModalType.DELETEPROJECT && <ArticleModalDelete title={modalTitle || ''} />}
          {modalType === ModalType.ARCHIVEDARTICLE && <ArticleModalArchive title={modalTitle} />}
          {modalType === ModalType.ARTICLE_RESTORE && <ArticleModalRestore title={modalTitle} />}
        </Modal>
      )}
    </>
  );
};

export default Modals;
