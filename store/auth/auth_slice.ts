import { createSlice } from '@reduxjs/toolkit';

export interface IAuthState {
  isAuthenticated: boolean;
  user: object | null;
}

const initialState: IAuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
});
