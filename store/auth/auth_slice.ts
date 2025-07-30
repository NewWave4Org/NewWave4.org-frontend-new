import { createSlice } from '@reduxjs/toolkit';

export interface IAuthState {
  isAuthenticated: boolean;
  token: string | null;
  email: string | null;
  roles: string[];
}

const initialState: IAuthState = {
  isAuthenticated: false,
  token: null,
  email: null,
  roles: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      state.isAuthenticated = true;
      // state.token = action.payload.token;
      state.email = action.payload.email;
      state.roles = action.payload.roles;
    },
  },
});

export const { setAuthData } = authSlice.actions;

export default authSlice.reducer;
