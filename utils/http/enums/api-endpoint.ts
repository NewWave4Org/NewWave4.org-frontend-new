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

  //ARTICLES
  ALL_ARTICLES: 'news/public/get-all',
  ADD_ARTICLE: 'news/private',
  UPDATE_ARTICLE: (id: number | string) => `news/private/${id}/update-main-information`,
  DELETE_ARTICLE: (id: number | string) => `news/private/${id}`,
  GET_ARTICLE: (id: number | string) => `news/public/${id}`,
  GET_FULL_ARTICLE: (id: number | string) => `news/public/${id}/full`,
  PUBLISH_ARTICLE: (id: number | string) => `news/private/${id}/publish-news`,
  ADD_NEWS_CONTENT_BLOCK: (id: number | string) => `news/content-blocks/private/${id}`,
  UPDATE_NEWS_CONTENT_BLOCK: (id: number | string) => `news/content-blocks/private/${id}`,
  DELETE_CONTENT_BLOCK: (id: number | string) => `news/content-blocks/private/${id}`,
  ADD_NEWS_CONTENT_BLOCK_ARRAY: (id: number | string) => `news/content-blocks/private/${id}/array`,
  UPDATE_NEWS_CONTENT_BLOCK_ARRAY: (id: number | string) => `news/content-blocks/private/${id}/array`,

  //IMAGE LOAD
  UPLOAD_PHOTO: 'photos/upload-photo',
  DELETE_PHOTO: 'photos/delete-photo',

  //PROJECTS
  ALL_PROJECTS: 'project/public/get-all',
  CREATE_PROJECT: 'project/private',
  DELETE_PROJECT: (id: number | string) => `project/private/${id}`,
  GET_PROJECT_BY_ID: (id: number | string) => `project/public/${id}`,
  GET_PROJECT_BY_ID_FULL: (id: number | string) => `project/public/${id}/full`,
  PUBLISH_PROJECT: (id: number | string) => `project/private/${id}/publish-project`,
  ADD_PROJECT_CONTENT_BLOCK: (id: number | string) => `project/content-blocks/private/${id}`,
  UPDATE_PROJECT: (id: number | string) => `project/private/${id}/update-main-information`,
  UPDATE_PROJECTS_CONTENT_BLOCK: (id: number | string) => `project/content-blocks/private/${id}`,
  DELETE_PROJECT_CONTENT_BLOCK: (id: number | string) => `project/content-blocks/private/${id}`,

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
