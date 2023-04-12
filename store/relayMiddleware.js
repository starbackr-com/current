import { createListenerMiddleware } from '@reduxjs/toolkit';
import { addRelay } from '../features/relays/relaysSlice';

const relayListener = createListenerMiddleware();

relayListener.startListening({
  actionCreator: addRelay,
  effect: (action, listenerApi) => {
    console.log(listenerApi.getState().relays.relays);
  },
});

export default relayListener.middleware;
