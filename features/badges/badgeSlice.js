import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  badges: {},
};

export const badgeSlice = createSlice({
  name: 'badges',
  initialState,
  reducers: {
    addBadge: (state, action) => {
      const { badgeUID, event } = action.payload;
      state.badges[badgeUID] = event;
    },
  },
});

export const { addBadge } = badgeSlice.actions;

export default badgeSlice.reducer;
