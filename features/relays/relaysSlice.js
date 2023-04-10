import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  relays: [],
  knownRelayUrls: [],
};

export const relaysSlice = createSlice({
  name: 'relays',
  initialState,
  reducers: {
    addRelay: (state, action) => {
      const relayArray = action.payload;
      const deduplicatedRelays = relayArray.filter(
        (relayObject) => !state.knownRelayUrls.includes(relayObject.url),
      );
      const newRelayUrls = deduplicatedRelays.map((relay) => relay.url);
      state.knownRelayUrls = [...state.knownRelayUrls, ...newRelayUrls];
      state.relays = [...state.relays, ...deduplicatedRelays];
    },
    removeRelay: (state, action) => {
      delete state.relays[action.payload];
    },
    changeRelayMode: (state, action) => {
      const updatedRelay = action.payload;
      console.log(updatedRelay);
      state.relays = { ...state.relays, ...updatedRelay };
    },
    replaceRelays: (state, action) => {
      const relayArray = action.payload;
      const relayUrls = relayArray.map((relay) => relay.url);
      state.knownRelayUrls = relayUrls;
      state.relays = relayArray;
    },
  },
});

export const { addRelay, removeRelay, changeRelayMode, replaceRelays } = relaysSlice.actions;

export default relaysSlice.reducer;
