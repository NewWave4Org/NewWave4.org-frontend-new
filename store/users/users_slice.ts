import { createSlice } from '@reduxjs/toolkit';
import { getUserById, getUsers, searchUsers } from './actions';
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
    createdAt: '',
    verificatedUser: false,
    lastInvitationSentAt: '',
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
        createdAt: '',
        email: '',
        roles: [],
        verificatedUser: false,
        lastInvitationSentAt: '',
      };
    },
    userUpdate: (state, action) => {
      const updatedUser = action.payload;
      const index = state.users.findIndex(u => u.id === updatedUser.id);
      if (index !== -1) {
        state.users[index] = updatedUser;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload.content;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.users = action.payload.content;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.userById = action.payload;

        const updated = action.payload;
        const idx = state.users.findIndex(u => u.id === updated.id);
        if (idx >= 0) state.users[idx] = updated;
      });
  },
});

export const { clearUserById, userUpdate } = userSlice.actions;

export default userSlice.reducer;
