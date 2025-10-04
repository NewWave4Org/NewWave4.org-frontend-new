const ModalType = {
  CREATENEWUSER: 'createNewUser',
  EDITUSER: 'edituser',
  DELETEUSER: 'deleteUser',
  DELETEARTICLE: 'deleteArticle',
  DELETEPROJECT: 'deleteProject',
  ARCHIVEDARTICLE: 'archivedArticle',
  ARTICLE_RESTORE: 'articleRestore'
} as const;

type ModalType = (typeof ModalType)[keyof typeof ModalType];

export default ModalType;
