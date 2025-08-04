const ApiEndpoint = {
  LOGIN: 'auth/login',
  USERS: 'users',
  GETUSERINFO: 'auth/getuserinfo',
  ALL_ARTICLES: 'articles/cms',

  // REFRESHTOKEN: '',
} as const;

type ApiEndpoint = (typeof ApiEndpoint)[keyof typeof ApiEndpoint];

export { ApiEndpoint };
