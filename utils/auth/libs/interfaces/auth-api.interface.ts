import { AuthLogInRequestDTO } from '../types/AuthLogInRequestDTO';
import { AuthLogInResponseDto } from '../types/AuthLogInResponseDTO';
import {
  CheckValidTokenDTO,
  ConfirmResetPasswordRequestDTO,
  ResetPasswordRequestDTO,
} from '../types/ResetPasswordDTO';
import { UserInfoResponseDTO } from '../types/UserInfoResponseDTO';

interface IAuthAPI {
  loginAuth: (data: AuthLogInRequestDTO) => Promise<AuthLogInResponseDto>;
  getUserInfo: () => Promise<UserInfoResponseDTO>;
  resetPassword: (data: ResetPasswordRequestDTO) => void;
  checkValidToken: (data: CheckValidTokenDTO) => void;
  confirmResetPassword: (data: ConfirmResetPasswordRequestDTO) => void;
  logOutAuth: () => void;
}

export default IAuthAPI;
