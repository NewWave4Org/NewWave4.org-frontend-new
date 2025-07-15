const UsersRole = {
  ADMIN: 'ROLE_ADMIN',
  WRITER: 'ROLE_WRITER',
} as const;

export { type UsersRole };

export const UsersRoleOptions = [
  { value: UsersRole.ADMIN, label: UsersRole.ADMIN },
  { value: UsersRole.WRITER, label: UsersRole.WRITER },
];
