import ModalType from '@/components/ui/Modal/enums/modals-type';
import Modal from '@/components/ui/Modal/Modal';
import { useAppSelector } from '@/store/hook';
import React from 'react';
import CreateNewUser from '../UserActions/CreateNewUser/CreateNewUser';
import * as Yup from 'yup';
import { adminRole, emailValidation, nameValidation } from '@/utils/validation';
import EditUser from '../UserActions/EditUser/EditUser';
import DeleteUser from '../UserActions/DeleteUser/DeleteUser';

import { ArticleModalDelete, ArticleModalArchive } from '../helperComponents/ArticleModals';
import ArticleModalRestore from '../helperComponents/ArticleModals/ArticleModalRestore';
import DonationPaymentsInfo from '../DonationPaymentsPage/DonationPaymentsInfo';

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
          {modalType === ModalType.CREATE_NEW_USER && <CreateNewUser validationSchema={CreateNewUserValidationSchema} />}
          {modalType === ModalType.EDIT_USER && <EditUser validationSchema={CreateNewUserValidationSchema} />}
          {modalType === ModalType.DELETE_USER && <DeleteUser />}
          {modalType === ModalType.DELETE_ARTICLE && <ArticleModalDelete title={modalTitle || ''} />}
          {modalType === ModalType.DONATION_DEATILS && <DonationPaymentsInfo />}

          {modalType === ModalType.ARCHIVED_ARTICLE && <ArticleModalArchive title={modalTitle} />}
          {modalType === ModalType.ARTICLE_RESTORE && <ArticleModalRestore title={modalTitle} />}
        </Modal>
      )}
    </>
  );
};

export default Modals;
