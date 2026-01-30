const ModalType = {
  CREATE_NEW_USER: 'createNewUser',
  EDIT_USER: 'edituser',
  DELETE_USER: 'deleteUser',
  DELETE_ARTICLE: 'deleteArticle',
  ARCHIVED_ARTICLE: 'archivedArticle',
  ARTICLE_RESTORE: 'articleRestore',
  DONATION_DEATILS: 'donationDetails'
} as const;

type ModalType = (typeof ModalType)[keyof typeof ModalType];

export default ModalType;
