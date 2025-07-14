const ApiEndpoint = {
  LOGIN: 'auth/login',
  USERS: 'users',

  REFRESHTOKEN: '',
} as const;

type ApiEndpoint = (typeof ApiEndpoint)[keyof typeof ApiEndpoint];

export { ApiEndpoint };
