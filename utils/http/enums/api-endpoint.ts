const ApiEndpoint = {
  LOGIN: 'auth/login',
  USERS: 'users',
  GETUSERINFO: 'auth/getuserinfo',
  ALL_ARTICLES: 'articles/cms',
  LOGOUT: 'auth/logout',

  // REFRESHTOKEN: '',
} as const;

type ApiEndpoint = (typeof ApiEndpoint)[keyof typeof ApiEndpoint];

export { ApiEndpoint };
