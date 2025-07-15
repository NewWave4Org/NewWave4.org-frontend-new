import { AuthLogInRequestDTO } from '../types/AuthLogInRequestDTO';
import { AuthLogInResponseDto } from '../types/AuthLogInResponseDTO';

interface IAuthService {
  loginAuth: (data: AuthLogInRequestDTO) => Promise<AuthLogInResponseDto>;
}

export default IAuthService;
