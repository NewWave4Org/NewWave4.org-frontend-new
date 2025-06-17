import { configureStore } from '@reduxjs/toolkit';
import modalReducer from '@/components/ui/Modal/ModalSlice';
import tokenReducer from '@/store/slices/tokenSlice';

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    token: tokenReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
