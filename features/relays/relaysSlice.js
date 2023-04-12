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
      console.log('new Relays:', deduplicatedRelays);
      state.knownRelayUrls = [...state.knownRelayUrls, ...newRelayUrls];
      state.relays = [...state.relays, ...deduplicatedRelays];
    },
    removeRelay: (state, action) => {
      const newArray = state.relays.filter(
        (item) => item.url !== action.payload,
      );
      state.relays = newArray;
    },
    changeRelayMode: (state, action) => {
      const updatedRelayObject = action.payload;
      const index = state.relays.findIndex(
        (item) => item.url === updatedRelayObject.url,
      );
      state.relays[index] = updatedRelayObject;
    },
    replaceRelays: (state, action) => {
      const relayArray = action.payload;
      const relayUrls = relayArray.map((relay) => relay.url);
      state.knownRelayUrls = relayUrls;
      state.relays = relayArray;
    },
  },
});

export const { addRelay, removeRelay, changeRelayMode, replaceRelays } =
  relaysSlice.actions;

export default relaysSlice.reducer;
