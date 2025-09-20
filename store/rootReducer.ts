import { combineReducers } from '@reduxjs/toolkit';
import modalReducer from '@/store/modal/ModalSlice';
import authSlice from '@/store/auth/auth_slice';
import usersSlice from '@/store/users/users_slice';
import articlesSlice from '@/store/articles/articles_slice';
import articleContentSlice from '@/store/article-content/article-content_slice';
import { logOutAuth } from './auth/action';

const appReducer = combineReducers({
  modal: modalReducer,
  authUser: authSlice,
  users: usersSlice,
  articles: articlesSlice,
  articleContent: articleContentSlice,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === logOutAuth.fulfilled.type) {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
