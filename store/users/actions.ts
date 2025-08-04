import { normalizeApiError } from '@/utils/http/normalizeApiError';
import { userService } from '@/utils/users';
import {
  DeleteUserRequestDTO,
  NewUserRequestDTO,
  UpdateUserRequestDTO,
  UserByIdRequestDTO,
} from '@/utils/users/type/interface';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getUsers = createAsyncThunk(
  'users/getUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getUsers();

      return response;
    } catch (error) {
      const normalized = normalizeApiError(error);
      return rejectWithValue(normalized);
    }
  },
);

export const getUserById = createAsyncThunk(
  'users/getUserById',
  async (data: UserByIdRequestDTO, { rejectWithValue }) => {
    try {
      const response = await userService.getUserById(data);

      return response;
    } catch (error) {
      const normalized = normalizeApiError(error);

      return rejectWithValue(normalized);
    }
  },
);

export const createNewUser = createAsyncThunk(
  'users/createNew',
  async (data: NewUserRequestDTO, { rejectWithValue }) => {
    try {
      const response = await userService.createNewUser(data);

      console.log('response new user', response);

      return response;
    } catch (error) {
      const normalized = normalizeApiError(error);

      return rejectWithValue(normalized);
    }
  },
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (data: DeleteUserRequestDTO, { rejectWithValue }) => {
    try {
      const response = await userService.deleteUser(data);

      return response;
    } catch (error) {
      const normalized = normalizeApiError(error);

      return rejectWithValue(normalized);
    }
  },
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: UpdateUserRequestDTO, { rejectWithValue }) => {
    try {
      const response = await userService.updateUser(data);

      return response;
    } catch (error) {
      const normalized = normalizeApiError(error);

      return rejectWithValue(normalized);
    }
  },
);
