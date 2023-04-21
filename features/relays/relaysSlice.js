import { createSlice } from '@reduxjs/toolkit';
import { publishGenericEvent } from '../../utils/nostrV2';
import { getPrivateKey, storeData } from '../../utils/cache/asyncStorage';
import { createKind3 } from '../../utils/nostrV2/createEvent';

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
      const newRelayArray = state.relays.filter(
        (item) => item.url !== action.payload,
      );
      const newKnownRelayUrls = state.knownRelayUrls.filter(
        (relayUrl) => relayUrl !== action.payload,
      );
      state.relays = newRelayArray;
      state.knownRelayUrls = newKnownRelayUrls;
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
    setupRelay: (state, action) => {
      const relayArray = action.payload;
      const deduplicatedRelays = relayArray.filter(
        (relayObject) => !state.knownRelayUrls.includes(relayObject.url),
      );
      const newRelayUrls = deduplicatedRelays.map((relay) => relay.url);
      state.knownRelayUrls = [...state.knownRelayUrls, ...newRelayUrls];
      state.relays = [...state.relays, ...deduplicatedRelays];
    },
  },
});

export const relayListener = async (action, listenerApi) => {
  const {
    relays: { relays },
    user: { followedPubkeys },
  } = listenerApi.getState();
  const json = JSON.stringify(relays);
  await storeData('relays', json);
  const sk = await getPrivateKey();
  const event = await createKind3(followedPubkeys, relays, sk);
  await publishGenericEvent(event);
};

export const {
  addRelay,
  removeRelay,
  changeRelayMode,
  replaceRelays,
  setupRelay,
} = relaysSlice.actions;

export default relaysSlice.reducer;
