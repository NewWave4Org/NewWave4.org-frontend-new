import { createSlice } from '@reduxjs/toolkit';
import { getUserInfo } from './action';
import { UserInfoResponseDTO } from '@/utils/auth/libs/types/UserInfoResponseDTO';

export interface IAuthState {
  isAuthenticated: boolean;
  user: null | UserInfoResponseDTO;
}

const initialState: IAuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      state.isAuthenticated = true;
    },
    clearAuthData(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getUserInfo.rejected, state => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setAuthData, clearAuthData } = authSlice.actions;

export default authSlice.reducer;
