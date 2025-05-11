const ModalType = {
  CREATENEWUSER: 'createNewUser',
  EDITUSER: 'edituser',
  DELETEUSER: 'deleteUser',
} as const;

type ModalType = (typeof ModalType)[keyof typeof ModalType];

export default ModalType;
