const ApiEndpoint = {
  LOGIN: 'auth/login',
  USERS: 'users',
  GETUSERINFO: 'auth/getuserinfo',
  RESET_PASSWORD: 'users/reset-password',
  LOGOUT: 'auth/logout',
  REFRESHTOKEN: 'auth/refresh',
  CHECK_VALIDATION_TOKEN: 'users/check-reset-password-token',
  CONFIRM_RESET_PASSWORD: 'users/confirm-reset-password',
  RESEND_INVITATION: 'users/resend-reset-password-token',

  //IMAGE LOAD
  UPLOAD_PHOTO: 'photos/upload-photo',
  DELETE_PHOTO: 'photos/delete-photo',

  // API for NEWS, PROJECTS, EVENTS
  DELETE_ARTICLE_CONTENT: (id: number) => `article/private/${id}`,
  GET_ARTICLE_CONTENT_BY_ID: (id: number) => `article/public/${id}`,
  GET_ARTICLE_CONTENT_ALL: `article/public/search`,
  GET_ARTICLE_CONTENT_ALL_PUBLISHED: `article/public/get-all-published`,
  CREATE_ARTICLE_CONTENT: `article/private`,
  PUBLISH_ARTICLE_CONTENT: (id: number) => `article/private/${id}/publish-article`,
  UPDATE_ARTICLE_CONTENT: (id: number) => `article/private/${id}`,
  ARCHIVE_ARTICLE: (id: number) => `article/private/${id}/archive`
} as const;

type ApiEndpoint = (typeof ApiEndpoint)[keyof typeof ApiEndpoint];

export { ApiEndpoint };
