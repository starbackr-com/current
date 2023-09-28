import {
  TypedAddListener,
  TypedStartListening,
  addListener,
  createListenerMiddleware,
  isAnyOf,
} from '@reduxjs/toolkit';
import {
  communityListener,
  joinCommunity,
} from '../features/community/communitySlice';
import {
  addRelay,
  changeRelayMode,
  relayListener,
  removeRelay,
} from '../features/relays/relaysSlice';
import {
  addWalletconnect,
  changeWalletconnect,
  wcListener,
} from '../features/walletconnect/walletconnectSlice';
import {
  addLike,
  addRepost,
  likeListener,
  removeLike,
  removeRepost,
  repostListener,
} from '../features/interactionSlice';
import { AppDispatch, RootState } from './store';
import {
  addReviewInteraction,
  reviewInteractionListener,
} from '../features/userSlice';

export const listener = createListenerMiddleware();

export type AppStartListening = TypedStartListening<RootState, AppDispatch>;

export const startAppListening = listener.startListening as AppStartListening;

export const addAppListener = addListener as TypedAddListener<
  RootState,
  AppDispatch
>;

startAppListening({
  matcher: isAnyOf(addRelay, removeRelay, changeRelayMode),
  effect: relayListener,
});
startAppListening({
  matcher: isAnyOf(addWalletconnect, changeWalletconnect),
  effect: wcListener,
});
startAppListening({
  actionCreator: joinCommunity,
  effect: communityListener,
});
startAppListening({
  matcher: isAnyOf(addLike, removeLike),
  effect: likeListener,
});
startAppListening({
  matcher: isAnyOf(addRepost, removeRepost),
  effect: repostListener,
});

startAppListening({
  actionCreator: addReviewInteraction,
  effect: reviewInteractionListener,
});

export default listener.middleware;
