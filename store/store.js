/* eslint-disable import/prefer-default-export */
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import introReducer from '../features/introSlice';
import messagesReducer from '../features/messagesSlice';
import { walletApi } from '../services/walletApi';
import userReducer from '../features/userSlice';
import interactionReducer from '../features/interactionSlice';
import relaysReducer from '../features/relays/relaysSlice';
import walletconnectReducer from '../features/walletconnect/walletconnectSlice';
import listener from './listenerMiddleware';
import badgeReducer from '../features/badges/badgeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    intro: introReducer,
    messages: messagesReducer,
    user: userReducer,
    interaction: interactionReducer,
    relays: relaysReducer,
    walletconnect: walletconnectReducer,
    badges: badgeReducer,
    [walletApi.reducerPath]: walletApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .prepend(listener)
    .concat([walletApi.middleware]),
});
