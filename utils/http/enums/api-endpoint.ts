const ApiEndpoint = {
  LOGIN: 'auth/login',
  USERS: 'users',
  ALL_ARTICLES: 'news/public/get-all',

  // REFRESHTOKEN: '',
} as const;

type ApiEndpoint = (typeof ApiEndpoint)[keyof typeof ApiEndpoint];

export { ApiEndpoint };
