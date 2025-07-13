import { AuthLogInRequestDTO } from '../types/AuthLogInRequestDTO';
import { AuthLogInResponseDTO } from '../types/AuthLogInResponseDTO';

interface IAuthService {
  loginAuth: (data: AuthLogInRequestDTO) => Promise<AuthLogInResponseDTO>;
}

export default IAuthService;
