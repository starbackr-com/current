import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice'
import introReducer from '../features/introSlice'
import messagesReducer from '../features/messagesSlice'
import { walletApi } from '../services/walletApi'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    intro: introReducer,
    messages: messagesReducer,
    [walletApi.reducerPath]: walletApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['messages'],
      },
    }).concat([walletApi.middleware]),
})