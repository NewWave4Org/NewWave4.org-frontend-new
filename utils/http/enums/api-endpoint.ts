const ApiEndpoint = {
  LOGIN: 'auth/login',
  USERS: 'users',
  GETUSERINFO: 'auth/getuserinfo',
  RESET_PASSWORD: 'users/reset-password',
  ALL_ARTICLES: 'news/public/get-all',
  ADD_ARTICLE: 'news/private',
  UPDATE_ARTICLE: (id: number | string) => `news/private/${id}/update-main-information`,
  GET_ARTICLE: (id: number | string) => `news/public/${id}`,
  GET_FULL_ARTICLE: (id: number | string) => `news/public/${id}/full`,
  ADD_NEWS_CONTENT_BLOCK: (id: number | string) => `news/content-blocks/private/${id}`,
  UPDATE_NEWS_CONTENT_BLOCK: (id: number | string) => `news/content-blocks/private/${id}`,
  DELETE_CONTENT_BLOCK: (id: number | string) => `news/content-blocks/private/${id}`,
  LOGOUT: 'auth/logout',
  REFRESHTOKEN: 'auth/refresh',
  CHECK_VALIDATION_TOKEN: 'users/check-reset-password-token',
  CONFIRM_RESET_PASSWORD: 'users/confirm-reset-password',
} as const;

type ApiEndpoint = (typeof ApiEndpoint)[keyof typeof ApiEndpoint];

export { ApiEndpoint };
