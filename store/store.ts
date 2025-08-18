import { configureStore } from '@reduxjs/toolkit';
import modalReducer from '@/components/ui/Modal/ModalSlice';
import authSlice from '@/store/auth/auth_slice';
import usersSlice from '@/store/users/users_slice';
import articlesSlice from '@/store/articles/articles_slice';

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    authUser: authSlice,
    users: usersSlice,
    articles: articlesSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
