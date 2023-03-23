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
            const now = Date.now();
            state.walletExpires = now + (1000 * 60 * 60 *2);
            state.username = action.payload.username;
            state.pubKey = action.payload.pubKey;
        },
        setBearer: (state, action) => {
            state.walletBearer = action.payload;
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

export const { logIn, setBearer, logOut } = authSlice.actions;

export default authSlice.reducer;
