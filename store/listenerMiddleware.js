import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import {
  addRelay,
  changeRelayMode,
  relayListener,
  removeRelay,
} from '../features/relays/relaysSlice';

const listener = createListenerMiddleware();

listener.startListening({
  matcher: isAnyOf(addRelay, removeRelay, changeRelayMode),
  effect: relayListener,
});

export default listener.middleware;
