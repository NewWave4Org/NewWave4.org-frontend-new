import { AuthLogInRequestDTO } from '../types/AuthLogInRequestDTO';
import { AuthLogInResponseDTO } from '../types/AuthLogInResponseDTO';

interface IAuthAPI {
  loginAuth: (data: AuthLogInRequestDTO) => Promise<AuthLogInResponseDTO>;
}

export default IAuthAPI;
