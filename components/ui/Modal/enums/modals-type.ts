const ModalType = {
  CREATE_NEW_USER: 'createNewUser',
  EDIT_USER: 'edituser',
  DELETE_USER: 'deleteUser',
  DELETE_ARTICLE: 'deleteArticle',
  DELETE_PROJECT: 'deleteProject',
  ARCHIVED_ARTICLE: 'archivedArticle',
  ARTICLE_RESTORE: 'articleRestore'
} as const;

type ModalType = (typeof ModalType)[keyof typeof ModalType];

export default ModalType;
