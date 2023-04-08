import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  relays: { 'wss://test.123': { read: true, write: false }, 'wss://test.456': { read: true, write: false } },
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
