import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { communityListener, joinCommunity } from '../features/community/communitySlice';
import {
  addRelay,
  changeRelayMode,
  relayListener,
  removeRelay,
} from '../features/relays/relaysSlice';
import { addWalletconnect, changeWalletconnect, wcListener } from '../features/walletconnect/walletconnectSlice';
import { addLike, addRepost, likeListener, removeLike, removeRepost, repostListener } from '../features/interactionSlice';

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
  matcher: isAnyOf(addLike, removeLike),
  effect: likeListener,
});
listener.startListening({
  matcher: isAnyOf(addRepost, removeRepost),
  effect: repostListener,
});

export default listener.middleware;
