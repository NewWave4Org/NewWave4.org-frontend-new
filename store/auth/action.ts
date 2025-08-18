import { authService } from '@/utils/auth';
import { AuthLogInRequestDTO } from '@/utils/auth/libs/types/AuthLogInRequestDTO';
import { AuthLogInResponseDto } from '@/utils/auth/libs/types/AuthLogInResponseDTO';
import {
  CheckValidTokenDTO,
  ConfirmResetPasswordRequestDTO,
  ResetPasswordRequestDTO,
} from '@/utils/auth/libs/types/ResetPasswordDTO';
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

const logOutAuth = createAsyncThunk(
  'auth/fetchLogOut',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.logOutAuth();

      return response;
    } catch (error) {
      const normalized = normalizeApiError(error);
      return rejectWithValue(normalized);
    }
  },
);

const resetPassword = createAsyncThunk(
  'auth/fetchResetPassword',
  async (data: ResetPasswordRequestDTO, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(data);

      return response;
    } catch (error) {
      const normalized = normalizeApiError(error);
      return rejectWithValue(normalized);
    }
  },
);

const checkToken = createAsyncThunk(
  'auth/fetchValidationToken',
  async (data: CheckValidTokenDTO, { rejectWithValue }) => {
    try {
      const response = await authService.checkValidToken(data);

      return response;
    } catch (error) {
      const normalized = normalizeApiError(error);
      return rejectWithValue(normalized);
    }
  },
);

const confirmResetPass = createAsyncThunk(
  'auth/fetchConfirmResetPass',
  async (data: ConfirmResetPasswordRequestDTO, { rejectWithValue }) => {
    try {
      const response = await authService.confirmResetPassword(data);

      return response;
    } catch (error) {
      const normalized = normalizeApiError(error);
      return rejectWithValue(normalized);
    }
  },
);

export {
  loginAuth,
  getUserInfo,
  logOutAuth,
  resetPassword,
  checkToken,
  confirmResetPass,
};
