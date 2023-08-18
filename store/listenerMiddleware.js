import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { communityListener, joinCommunity } from '../features/community/communitySlice';
import {
  addRelay,
  changeRelayMode,
  relayListener,
  removeRelay,
} from '../features/relays/relaysSlice';
import { addWalletconnect, changeWalletconnect, wcListener } from '../features/walletconnect/walletconnectSlice';
import { addLike, likeListener } from '../features/interactionSlice';

const listener = createListenerMiddleware();

listener.startListening({
  matcher: isAnyOf(addRelay, removeRelay, changeRelayMode),
  effect: relayListener,
});
listener.startListening({
  matcher: isAnyOf(addWalletconnect, changeWalletconnect),
  effect: wcListener,
});
listener.startListening({
  actionCreator: joinCommunity,
  effect: communityListener,
});
listener.startListening({
  actionCreator: addLike,
  effect: likeListener,
});

export default listener.middleware;
