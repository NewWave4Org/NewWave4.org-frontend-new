const ApiEndpoint = {
  LOGIN: 'auth/login',
  USERS: 'users',
  GETUSERINFO: 'auth/getuserinfo',
  RESET_PASSWORD: 'users/reset-password',
  ALL_ARTICLES: 'news/public/get-all',
  LOGOUT: 'auth/logout',
  REFRESHTOKEN: 'auth/refresh',
  CHECK_VALIDATION_TOKEN: 'users/check-reset-password-token',
  CONFIRM_RESET_PASSWORD: 'users/confirm-reset-password',
  RESEND_INVITATION: 'users/resend-reset-password-token',
} as const;

type ApiEndpoint = (typeof ApiEndpoint)[keyof typeof ApiEndpoint];

export { ApiEndpoint };
