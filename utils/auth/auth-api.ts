import { ApiEndpoint } from '../http/enums/api-endpoint';
import HttpMethod from '../http/enums/http-method';
import { request } from '../http/http-request-service';
import IAuthAPI from './libs/interfaces/auth-api.interface';
import { AuthLogInRequestDTO } from './libs/types/AuthLogInRequestDTO';
import { AuthLogInResponseDTO } from './libs/types/AuthLogInResponseDTO';

class AuthAPI implements IAuthAPI {
  async loginAuth(data: AuthLogInRequestDTO): Promise<AuthLogInResponseDTO> {
    return request({
      method: HttpMethod.POST,
      url: ApiEndpoint.LOGIN,
      body: data,
    });
  }
}

export default AuthAPI;
