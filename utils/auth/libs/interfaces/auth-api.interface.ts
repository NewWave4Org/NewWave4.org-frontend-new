import { AuthLogInRequestDTO } from '../types/AuthLogInRequestDTO';
import { AuthLogInResponseDto } from '../types/AuthLogInResponseDTO';
import { ResetPasswordRequestDTO } from '../types/ResetPasswordDTO';
import { UserInfoResponseDTO } from '../types/UserInfoResponseDTO';

interface IAuthAPI {
  loginAuth: (data: AuthLogInRequestDTO) => Promise<AuthLogInResponseDto>;
  getUserInfo: () => Promise<UserInfoResponseDTO>;
  resetPassword: (data: ResetPasswordRequestDTO) => void;
  logOutAuth: () => void;
}

export default IAuthAPI;
