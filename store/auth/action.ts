import { authService } from '@/utils/auth';
import { AuthLogInRequestDTO } from '@/utils/auth/libs/types/AuthLogInRequestDTO';
import { AuthLogInResponseDto } from '@/utils/auth/libs/types/AuthLogInResponseDTO';
import { normalizeApiError } from '@/utils/http/normalizeApiError';
import { ApiError, ServerErrorData } from '@/utils/http/type/interface';
import { createAsyncThunk } from '@reduxjs/toolkit';

const loginAuth = createAsyncThunk<
  AuthLogInResponseDto,
  AuthLogInRequestDTO,
  { rejectValue: ApiError }
>(
  'auth/fetchSignUp',
  async (data: AuthLogInRequestDTO, { rejectWithValue }) => {
    try {
      const response = await authService.loginAuth(data);
      return response;
    } catch (error: any) {
      const normalized = normalizeApiError(error);
      return rejectWithValue(normalized);
    }
  },
);

const getUserInfo = createAsyncThunk(
  'users/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getUserInfo();

      return response;
    } catch (error) {
      const normalized = normalizeApiError(error);
      return rejectWithValue(normalized);
    }
  },
);

export { loginAuth, getUserInfo };
