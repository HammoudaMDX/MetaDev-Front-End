import { createSlice } from '@reduxjs/toolkit';

const initialState = { value: {}, users: [] };

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.value = action.payload;
    },
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    updateUsers: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const { setUser, addUser, updateUsers } = userSlice.actions;

export default userSlice.reducer;
