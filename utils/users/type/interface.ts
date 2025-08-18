export interface UserItem {
  id: number;
  name: string;
  email: string;
  roles: string[];
  verificatedUser: boolean;
}

export type UserResponseDTO = { content: UserItem[] };

export interface UserByIdRequestDTO {
  id: number;
}

export interface UserByIdResponseDTO {
  id: number;
  email: string;
  name: string;
  roles: string[];
}

export interface NewUserRequestDTO extends Omit<UserItem, 'id'> {
  // token: string;
}

export interface DeleteUserRequestDTO {
  // token: string;
  userId: number;
}

export interface UpdateUserRequestDTO extends UserByIdResponseDTO {
  // token: string;
}
