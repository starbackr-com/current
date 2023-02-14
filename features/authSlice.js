import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false,
    pubKey: null,
    username: null,
    walletBearer: null,
    walletExpires: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logIn: (state, action) => {
            state.isLoggedIn = true;
            state.walletBearer = action.payload.bearer;
            const now = new Date();
            state.walletExpires = now.setHours(now.getHours() + 2);
            state.username = action.payload.username;
            state.pubKey = action.payload.pubKey;
        },
        setBearer: (state, action) => {
            state.walletBearer = action.payload;
        },
        setUsername: (state, username) => {
            state.username = username;
        },

        logOut: (state) => {
            state.isLoggedIn = false,
            state.pubKey = null,
            state.username = null,
            state.walletBearer = null,
            state.walletExpires = null
        },
    },
});

export const { logIn, setBearer, setUsername, logOut } = authSlice.actions;

export default authSlice.reducer;
