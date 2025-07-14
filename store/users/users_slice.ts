import { createSlice } from '@reduxjs/toolkit';
import { createNewUser, getUserById, getUsers } from './actions';
import { UserItem } from '@/utils/users/type/interface';

interface UserState {
  users: UserItem[];
  userById: UserItem;
}

const initialState: UserState = {
  users: [],
  userById: {
    id: 0,
    name: '',
    email: '',
    roles: [],
  },
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUserById(state) {
      state.userById = {
        id: 0,
        name: '',
        email: '',
        roles: [],
      };
    },
  },
  extraReducers(builder) {
    builder.addCase(getUsers.fulfilled, (state, action) => {
      console.log('payload', action.payload);
      state.users = action.payload.content;
    });
    builder.addCase(getUserById.fulfilled, (state, action) => {
      state.userById = action.payload;
    });
    builder.addCase(createNewUser.fulfilled, (state, action) => {});
  },
});

export const { clearUserById } = userSlice.actions;

export default userSlice.reducer;
