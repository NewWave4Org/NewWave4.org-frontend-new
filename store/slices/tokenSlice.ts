import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accessToken: null,
  isAuthInitialized: false,
};

export const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.accessToken = action.payload;
      state.isAuthInitialized = true;
    },
    clearToken: state => {
      state.accessToken = null;
      state.isAuthInitialized = false;
    },
  },
});

export const { setToken, clearToken } = tokenSlice.actions;

export default tokenSlice.reducer;
