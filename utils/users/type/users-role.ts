const UsersRole = {
  ADMIN: 'ROLE_ADMIN',
  MANAGER: 'ROLE_CONTENT_MANAGER',
} as const;

export { type UsersRole };

const formatRoleLabel = (role: string) =>
  'Role ' + role.replace('ROLE_', '').toLowerCase().replace('_', ' ');

export const UsersRoleOptions = Object.values(UsersRole).map(role => ({
  value: role,
  label: formatRoleLabel(role),
}));

// export const UsersRoleOptions = [
//   { value: UsersRole.ADMIN, label: UsersRole.ADMIN },
//   { value: UsersRole.MANAGER, label: UsersRole.MANAGER },
// ];
