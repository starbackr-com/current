import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import introReducer from "../features/introSlice";
import messagesReducer from "../features/messagesSlice";
import { walletApi } from "../services/walletApi";
import userReducer from "../features/userSlice";
import interactionReducer from "../features/interactionSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        intro: introReducer,
        messages: messagesReducer,
        user: userReducer,
        interaction: interactionReducer,
        [walletApi.reducerPath]: walletApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([walletApi.middleware]),
});
