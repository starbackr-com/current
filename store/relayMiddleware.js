import { createListenerMiddleware } from '@reduxjs/toolkit';
import { addRelay } from '../features/relays/relaysSlice';
import { storeData } from '../utils/cache/asyncStorage';

const relayListener = createListenerMiddleware();

relayListener.startListening({
  actionCreator: addRelay,
  effect: async (action, listenerApi) => {
    const { relays } = listenerApi.getState().relays;
    console.log('relays:', relays)
    const json = JSON.stringify(relays);
    await storeData('relays', json);
  },
});

export default relayListener.middleware;
