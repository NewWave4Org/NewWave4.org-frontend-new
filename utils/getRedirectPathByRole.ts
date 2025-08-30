import { ROLES } from '@/data/admin/roles/Roles';

export const getRedirectPathByRole = (roles: string[] = []) => {
  if (roles.includes(ROLES.SUPER_ADMIN)) return '/admin/users';
  if (roles.includes(ROLES.ADMIN)) return '/admin/users';
  if (roles.includes(ROLES.MANAGER)) return '/admin/articles';

  return '/admin';
};
