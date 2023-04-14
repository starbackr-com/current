import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  badges: {},
};

export const badgeSlice = createSlice({
  name: 'badges',
  initialState,
  reducers: {
    addBadge: (state, action) => {
      const badge = action.payload;
      state.zappedEvents[badge.id] = badge;
    },
  },
});

export const { addBadge } = badgeSlice.actions;

export default badgeSlice.reducer;
