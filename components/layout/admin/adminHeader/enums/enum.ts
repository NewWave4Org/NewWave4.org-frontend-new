const adminLink = {
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

type adminLink = (typeof adminLink)[keyof typeof adminLink];

export default adminLink;

const adminLinkSidebar = {
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_PAGES: '/admin/pages',
  ADMIN_ARTICLES: '/admin/articles',
  ADMIN_PROJECTS: '/admin/projects',
  ADMIN_PROGRAMS: '/admin/programs',
  ADMIN_ARCHIVE: '/admin/archive',
  ADMIN_GLOBAL_SECTIONS: '/admin/global-sections',
} as const;

type adminLinkSidebar = (typeof adminLinkSidebar)[keyof typeof adminLinkSidebar];

export { adminLinkSidebar };
