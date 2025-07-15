import IAuthAPI from './libs/interfaces/auth-api.interface';
import IAuthService from './libs/interfaces/auth-service.interface';
import { AuthLogInRequestDTO } from './libs/types/AuthLogInRequestDTO';
import { AuthLogInResponseDto } from './libs/types/AuthLogInResponseDTO';

class AuthService implements IAuthService {
  private authApi: IAuthAPI;

  constructor(authApi: IAuthAPI) {
    this.authApi = authApi;
  }

  async loginAuth(data: AuthLogInRequestDTO): Promise<AuthLogInResponseDto> {
    return this.authApi.loginAuth(data);
  }
}

export default AuthService;
