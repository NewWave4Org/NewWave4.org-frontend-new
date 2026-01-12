const ApiEndpoint = {
  LOGIN: 'auth/login',
  USERS: 'users',
  USERS_SEARCH: 'users/search',
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
  UPLOAD_PHOTO_WITHOUT_ATTACH: 'photos/upload-photo-without-attach',

  // API for NEWS, PROJECTS, EVENTS
  DELETE_ARTICLE_CONTENT: (id: number) => `article/private/${id}`,
  GET_ARTICLE_CONTENT_BY_ID: (id: number) => `article/public/${id}`,
  GET_ARTICLE_CONTENT_ALL: `article/public/search`,
  GET_ARTICLE_CONTENT_ALL_PUBLISHED: `article/public/get-all-published`,
  CREATE_ARTICLE_CONTENT: `article/private`,
  PUBLISH_ARTICLE_CONTENT: (id: number) => `article/private/${id}/publish-article`,
  UPDATE_ARTICLE_CONTENT: (id: number) => `article/private/${id}`,
  ARCHIVE_ARTICLE: (id: number) => `article/private/${id}/archive`,

  // API GLOBAL BLOCKS
  CREATE_GLOBAL_SECTIONS: 'pages/private/global-section',
  GET_ALL_GLOBAL_SECTIONS: 'pages/public/global-section/get-all',
  GET_GLOBAL_SECTION_BY_KEY: (key: string) => `pages/public/global-section/${key}`,
  UPDATE_GLOBAL_SECTION: (id: number) => `pages/private/global-section/${id}`,

  //API PAGES
  CREATE_PAGES: `pages/private`,
  GET_PAGES: (pageType: string) => `pages/public/${pageType}`,
  UPDATE_PAGES: (id: number) => `pages/private/${id}`,

  // API FOR TRANSLATIONS
  TRANSLATION: (id: number) => `article/private/${id}/translate`,
  TRANSLATION_PAGE: (id: number) => `pages/private/${id}/page/translate`
} as const;

type ApiEndpoint = (typeof ApiEndpoint)[keyof typeof ApiEndpoint];

export { ApiEndpoint };
