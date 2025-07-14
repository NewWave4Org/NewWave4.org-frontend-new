import { useAppSelector } from '@/store/hook';
import { ApiEndpoint } from '../http/enums/api-endpoint';
import HttpMethod from '../http/enums/http-method';
import { request } from '../http/http-request-service';
import {
  DeleteUserRequestDTO,
  NewUserRequestDTO,
  UpdateUserRequestDTO,
  UserByIdRequestDTO,
  UserByIdResponseDTO,
  UserItem,
  UserResponseDTO,
} from './type/interface';
import { IUsersApi } from './type/users-api.interface';

class UserApi implements IUsersApi {
  async getUsers(token: string): Promise<UserResponseDTO> {
    return request({
      method: HttpMethod.GET,
      url: ApiEndpoint.USERS,
      accessToken: token,
    });
  }

  async getUserById(data: UserByIdRequestDTO): Promise<UserByIdResponseDTO> {
    const { token, id } = data;
    return request({
      method: HttpMethod.GET,
      url: `${ApiEndpoint.USERS}/${id}`,
      accessToken: token,
    });
  }

  async createNewUser(data: NewUserRequestDTO) {
    const { token, ...body } = data;
    return request({
      method: HttpMethod.POST,
      url: ApiEndpoint.USERS,
      accessToken: token,
      body: body,
    });
  }

  async deleteUser(data: DeleteUserRequestDTO) {
    const { token, userId } = data;
    return request({
      method: HttpMethod.DELETE,
      url: `${ApiEndpoint.USERS}/${userId}`,
      accessToken: token,
    });
  }

  async updateUser(data: UpdateUserRequestDTO) {
    const { token, id, ...body } = data;
    return request({
      method: HttpMethod.PUT,
      url: `${ApiEndpoint.USERS}/${id}`,
      accessToken: token,
      body: body,
    });
  }
}

export default UserApi;
