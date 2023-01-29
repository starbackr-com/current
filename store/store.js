import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice'
import introReducer from '../features/introSlice'
import messagesReducer from '../features/messagesSlice'
import { walletApi } from '../services/walletApi'
import userReducer, { followPubkey } from '../features/userSlice'
import { getUserData } from '../utils/nostr/getNotes'

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: followPubkey,
  effect: async (action) => {
    const pubkey = action.payload
    await getUserData(pubkey);
  }
})

export const store = configureStore({
  reducer: {
    auth: authReducer,
    intro: introReducer,
    messages: messagesReducer,
    user: userReducer,
    [walletApi.reducerPath]: walletApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([walletApi.middleware, listenerMiddleware.middleware]),
})