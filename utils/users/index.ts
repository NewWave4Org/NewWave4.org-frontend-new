import UserApi from './users-api';
import UsersServices from './users-services';

const userApi = new UserApi();
const userService = new UsersServices(userApi);

export { userService };
