import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { addRelay, changeRelayMode, removeRelay } from '../features/relays/relaysSlice';
import { storeData } from '../utils/cache/asyncStorage';

const relayListener = createListenerMiddleware();

relayListener.startListening({
  matcher: isAnyOf(addRelay, removeRelay, changeRelayMode),
  effect: async (action, listenerApi) => {
    const { relays } = listenerApi.getState().relays;
    const json = JSON.stringify(relays);
    await storeData('relays', json);
  },
});

export default relayListener.middleware;
