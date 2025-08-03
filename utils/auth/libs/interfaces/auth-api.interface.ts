import { AuthLogInRequestDTO } from '../types/AuthLogInRequestDTO';
import { AuthLogInResponseDto } from '../types/AuthLogInResponseDTO';

interface IAuthAPI {
  loginAuth: (data: AuthLogInRequestDTO) => Promise<AuthLogInResponseDto>;
  // getuserInfo: () => Promise<any>;
}

export default IAuthAPI;
