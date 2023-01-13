import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice'
import introReducer from '../features/introSlice'
import { messagesApi } from '../services/messagesApi'
import { walletApi } from '../services/walletApi'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    intro: introReducer,
    [walletApi.reducerPath]: walletApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([walletApi.middleware, messagesApi.middleware]),
})