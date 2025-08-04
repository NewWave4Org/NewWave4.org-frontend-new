import { AuthLogInRequestDTO } from '../types/AuthLogInRequestDTO';
import { AuthLogInResponseDto } from '../types/AuthLogInResponseDTO';
import { UserInfoResponseDTO } from '../types/UserInfoResponseDTO';

interface IAuthService {
  loginAuth: (data: AuthLogInRequestDTO) => Promise<AuthLogInResponseDto>;
  getUserInfo: () => Promise<UserInfoResponseDTO>;
}

export default IAuthService;
