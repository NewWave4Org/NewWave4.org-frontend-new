import { ApiEndpoint } from '../http/enums/api-endpoint';
import HttpMethod from '../http/enums/http-method';
import { request } from '../http/http-request-service';
import {
  DeleteUserRequestDTO,
  NewUserRequestDTO,
  UpdateUserRequestDTO,
  UserByIdRequestDTO,
  UserByIdResponseDTO,
  UserResponseDTO,
} from './type/interface';
import { IUsersApi } from './type/users-api.interface';

class UserApi implements IUsersApi {
  async getUsers(): Promise<UserResponseDTO> {
    return request({
      method: HttpMethod.GET,
      url: ApiEndpoint.USERS,
    });
  }

  async searchUsers(isUserVerificated?: boolean): Promise<UserResponseDTO> {
    const params: Record<string, string> = {};

    if (isUserVerificated !== undefined) {
      params.isUserVerificated = String(isUserVerificated);
    }

    return request({
      method: HttpMethod.GET,
      url: ApiEndpoint.USERS_SEARCH,
      params,
    });
  }

  async getUserById(data: UserByIdRequestDTO): Promise<UserByIdResponseDTO> {
    const { id } = data;
    return request({
      method: HttpMethod.GET,
      url: `${ApiEndpoint.USERS}/${id}`,
    });
  }

  async createNewUser(data: NewUserRequestDTO) {
    return request({
      method: HttpMethod.POST,
      url: ApiEndpoint.USERS,
      body: data,
    });
  }

  async deleteUser(data: DeleteUserRequestDTO) {
    const { userId } = data;
    return request({
      method: HttpMethod.DELETE,
      url: `${ApiEndpoint.USERS}/${userId}`,
    });
  }

  async updateUser(data: UpdateUserRequestDTO) {
    const { id, ...body } = data;
    return request({
      method: HttpMethod.PUT,
      url: `${ApiEndpoint.USERS}/${id}`,
      body: body,
    });
  }
}

export default UserApi;
