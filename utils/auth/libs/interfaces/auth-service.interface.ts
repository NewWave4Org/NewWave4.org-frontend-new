import { AuthLogInRequestDTO } from '../types/AuthLogInRequestDTO';
import { AuthLogInResponseDto } from '../types/AuthLogInResponseDTO';
import {
  CheckValidTokenDTO,
  ConfirmResetPasswordRequestDTO,
  ResendInvitationRequestDTO,
  ResetPasswordRequestDTO,
} from '../types/ResetPasswordDTO';
import { UserInfoResponseDTO } from '../types/UserInfoResponseDTO';

interface IAuthService {
  loginAuth: (data: AuthLogInRequestDTO) => Promise<AuthLogInResponseDto>;
  getUserInfo: () => Promise<UserInfoResponseDTO>;
  resetPassword: (data: ResetPasswordRequestDTO) => void;
  checkValidToken: (data: CheckValidTokenDTO) => void;
  confirmResetPassword: (data: ConfirmResetPasswordRequestDTO) => void;
  resendInvitation: (data: ResendInvitationRequestDTO) => void;
  logOutAuth: () => void;
}

export default IAuthService;
