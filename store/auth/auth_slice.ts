import { createSlice } from '@reduxjs/toolkit';
import { getUserInfo, logOutAuth } from './action';
import { UserInfoResponseDTO } from '@/utils/auth/libs/types/UserInfoResponseDTO';

export interface IAuthState {
  isAuthenticated: boolean;
  isUserChecked: boolean;
  user: null | UserInfoResponseDTO;
}

const initialState: IAuthState = {
  isAuthenticated: false,
  user: null,
  isUserChecked: false,
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
        state.isUserChecked = true;
      })
      .addCase(getUserInfo.rejected, state => {
        state.user = null;
        state.isAuthenticated = false;
        state.isUserChecked = true;
      })
      .addCase(logOutAuth.fulfilled, state => {
        state.user = null;
        state.isAuthenticated = false;
        state.isUserChecked = false;
      });
  },
});

export const { setAuthData, clearAuthData } = authSlice.actions;

export default authSlice.reducer;
