const ApiEndpoint = {
  LOGIN: 'auth/login',
  REFRESHTOKEN: '',
} as const;

type ApiEndpoint = (typeof ApiEndpoint)[keyof typeof ApiEndpoint];

export { ApiEndpoint };
