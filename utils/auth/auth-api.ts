import { ApiEndpoint } from '../http/enums/api-endpoint';
import HttpMethod from '../http/enums/http-method';
import { request } from '../http/http-request-service';
import IAuthAPI from './libs/interfaces/auth-api.interface';
import { AuthLogInRequestDTO } from './libs/types/AuthLogInRequestDTO';
import { AuthLogInResponseDto } from './libs/types/AuthLogInResponseDTO';
import {
  CheckValidTokenDTO,
  ConfirmResetPasswordRequestDTO,
  ResetPasswordRequestDTO,
} from './libs/types/ResetPasswordDTO';

class AuthAPI implements IAuthAPI {
  async loginAuth(data: AuthLogInRequestDTO): Promise<AuthLogInResponseDto> {
    return request({
      method: HttpMethod.POST,
      url: ApiEndpoint.LOGIN,
      body: data,
    });
  }

  async getUserInfo() {
    return request({
      method: HttpMethod.GET,
      url: ApiEndpoint.GETUSERINFO,
    });
  }

  async logOutAuth() {
    return request({
      method: HttpMethod.POST,
      url: ApiEndpoint.LOGOUT,
    });
  }

  async resetPassword(data: ResetPasswordRequestDTO) {
    return request({
      method: HttpMethod.POST,
      url: ApiEndpoint.RESET_PASSWORD,
      body: data,
    });
  }

  async checkValidToken(data: CheckValidTokenDTO) {
    return request({
      method: HttpMethod.POST,
      url: ApiEndpoint.CHECK_VALIDATION_TOKEN,
      body: data,
    });
  }

  async confirmResetPassword(data: ConfirmResetPasswordRequestDTO) {
    return request({
      method: HttpMethod.POST,
      url: ApiEndpoint.CONFIRM_RESET_PASSWORD,
      body: data,
    });
  }
}

export default AuthAPI;
