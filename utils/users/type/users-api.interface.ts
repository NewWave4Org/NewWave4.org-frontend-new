import {
  DeleteUserRequestDTO,
  NewUserRequestDTO,
  UpdateUserRequestDTO,
  UserByIdRequestDTO,
  UserByIdResponseDTO,
  UserResponseDTO,
} from './interface';

interface IUsersApi {
  getUsers: (token: string) => Promise<UserResponseDTO>;
  getUserById: (data: UserByIdRequestDTO) => Promise<UserByIdResponseDTO>;
  createNewUser: (data: NewUserRequestDTO) => void;
  deleteUser: (data: DeleteUserRequestDTO) => void;
  updateUser: (data: UpdateUserRequestDTO) => void;
}

export { type IUsersApi };
