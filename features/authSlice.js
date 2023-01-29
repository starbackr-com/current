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
            state.address = action.payload.address;
            state.pubKey = action.payload.pubKey;
        },
        setBearer: (state, action) => {
            state.walletBearer = action.payload;
        },
        logOut: (state) => {
            (state.isLoggedIn = false),
                (state.pubKey = null),
                (state.username = null),
                (state.walletBearer = null);
            state.walletBearer = null;
            state.pubKey = null;
        },
    },
});

export const { logIn, setBearer, logOut } = authSlice.actions;

export default authSlice.reducer;
