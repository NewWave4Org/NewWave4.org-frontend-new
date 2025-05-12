const adminLink = {
  PROFILE: '/profile',
  SETTINGS: 'settings',
} as const;

type adminLink = (typeof adminLink)[keyof typeof adminLink];

export default adminLink;
