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
    verificatedUser: false,
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
        verificatedUser: false,
      };
    },
  },
  extraReducers(builder) {
    builder.addCase(getUsers.fulfilled, (state, action) => {
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
