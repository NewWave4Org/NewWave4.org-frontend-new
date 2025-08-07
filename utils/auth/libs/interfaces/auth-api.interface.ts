import { AuthLogInRequestDTO } from '../types/AuthLogInRequestDTO';
import { AuthLogInResponseDto } from '../types/AuthLogInResponseDTO';
import { UserInfoResponseDTO } from '../types/UserInfoResponseDTO';

interface IAuthAPI {
  loginAuth: (data: AuthLogInRequestDTO) => Promise<AuthLogInResponseDto>;
  getUserInfo: () => Promise<UserInfoResponseDTO>;
  logOutAuth: () => void;
}

export default IAuthAPI;
