import {
  DeleteUserRequestDTO,
  NewUserRequestDTO,
  UpdateUserRequestDTO,
  UserByIdRequestDTO,
  UserByIdResponseDTO,
  UserResponseDTO,
} from './type/interface';
import { IUsersApi } from './type/users-api.interface';
import { IUsersServices } from './type/users-services.interface';

class UsersServices implements IUsersServices {
  private users: IUsersApi;

  constructor(users: IUsersApi) {
    this.users = users;
  }

  async getUsers(): Promise<UserResponseDTO> {
    return this.users.getUsers();
  }

  async getUserByToken(): Promise<any> {
    return this.users.getuserbytoken();
  }

  async getUserById(data: UserByIdRequestDTO): Promise<UserByIdResponseDTO> {
    return this.users.getUserById(data);
  }

  async createNewUser(data: NewUserRequestDTO) {
    return this.users.createNewUser(data);
  }

  async deleteUser(data: DeleteUserRequestDTO) {
    return this.users.deleteUser(data);
  }

  async updateUser(data: UpdateUserRequestDTO) {
    return this.users.updateUser(data);
  }
}

export default UsersServices;
