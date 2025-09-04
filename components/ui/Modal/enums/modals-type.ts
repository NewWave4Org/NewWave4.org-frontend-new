const ModalType = {
  CREATENEWUSER: 'createNewUser',
  EDITUSER: 'edituser',
  DELETEUSER: 'deleteUser',
  DELETEARTICLE: 'deleteArticle',
} as const;

type ModalType = (typeof ModalType)[keyof typeof ModalType];

export default ModalType;
