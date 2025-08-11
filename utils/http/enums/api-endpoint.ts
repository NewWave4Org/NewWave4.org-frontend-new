const ApiEndpoint = {
  LOGIN: 'auth/login',
  USERS: 'users',
  GETUSERINFO: 'auth/getuserinfo',
  ALL_ARTICLES: 'news/public/get-all',
  LOGOUT: 'auth/logout',
  REFRESHTOKEN: 'auth/refresh',
} as const;

type ApiEndpoint = (typeof ApiEndpoint)[keyof typeof ApiEndpoint];

export { ApiEndpoint };
