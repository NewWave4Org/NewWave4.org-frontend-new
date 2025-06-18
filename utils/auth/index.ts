import AuthAPI from './auth-api';
import AuthService from './auth-services';

const authAPI = new AuthAPI();
const authService = new AuthService(authAPI);

export { authService };
