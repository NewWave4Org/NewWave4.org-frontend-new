import { authService } from '@/utils/auth';
import { AuthLogInRequestDTO } from '@/utils/auth/libs/types/AuthLogInRequestDTO';
import { createAsyncThunk } from '@reduxjs/toolkit';

const loginAuth = createAsyncThunk(
  'auth/fetchSignUp',
  async (data: AuthLogInRequestDTO) => {
    const response = await authService.loginAuth(data);

    return response;
  },
);

export { loginAuth };
