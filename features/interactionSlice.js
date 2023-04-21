import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  zappedEvents: [],
};

export const interactionSlice = createSlice({
  name: 'interaction',
  initialState,
  reducers: {
    addZap: (state, action) => {
      const deduplicated = [
        ...new Set([...action.payload, ...state.zappedEvents]),
      ];
      state.zappedEvents = deduplicated;
    },
  },
});

export const { addZap } = interactionSlice.actions;

export default interactionSlice.reducer;
