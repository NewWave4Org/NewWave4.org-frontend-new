import IAuthAPI from './libs/interfaces/auth-api.interface';
import IAuthService from './libs/interfaces/auth-service.interface';
import { AuthLogInRequestDTO } from './libs/types/AuthLogInRequestDTO';
import { AuthLogInResponseDto } from './libs/types/AuthLogInResponseDTO';
import {
  CheckValidTokenDTO,
  ConfirmResetPasswordRequestDTO,
  ResetPasswordRequestDTO,
} from './libs/types/ResetPasswordDTO';

class AuthService implements IAuthService {
  private authApi: IAuthAPI;

  constructor(authApi: IAuthAPI) {
    this.authApi = authApi;
  }

  async loginAuth(data: AuthLogInRequestDTO): Promise<AuthLogInResponseDto> {
    return this.authApi.loginAuth(data);
  }

  async getUserInfo() {
    return this.authApi.getUserInfo();
  }

  async logOutAuth() {
    return this.authApi.logOutAuth();
  }

  async resetPassword(data: ResetPasswordRequestDTO) {
    return this.authApi.resetPassword(data);
  }

  async checkValidToken(data: CheckValidTokenDTO) {
    return this.authApi.checkValidToken(data);
  }

  async resendInvitation(data: ResetPasswordRequestDTO) {
    return this.authApi.resendInvitation(data);
  }

  async confirmResetPassword(data: ConfirmResetPasswordRequestDTO) {
    return this.authApi.confirmResetPassword(data);
  }
}

export default AuthService;
