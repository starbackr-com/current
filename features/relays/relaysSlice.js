import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  relays: {},
};

export const relaysSlice = createSlice({
  name: 'relays',
  initialState,
  reducers: {
    addRelay: (state, action) => {
      const newRelayObject = action.payload;
      state.relays = { ...state.relays, ...newRelayObject };
    },
    removeRelay: (state, action) => {
      delete state.relays[action.payload];
    },
    changeRelayMode: (state, action) => {
      const updatedRelay = action.payload;
      console.log(updatedRelay);
      state.relays = { ...state.relays, ...updatedRelay };
    },
  },
});

export const { addRelay, removeRelay, changeRelayMode } = relaysSlice.actions;

export default relaysSlice.reducer;
