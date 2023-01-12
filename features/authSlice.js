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
        },
        setBearer: (state, action) => {
            state.walletBearer = action.payload;
        },
        logOut: (state) => {
            (state.isLoggedIn = false),
                (state.pubKey = null),
                (state.privKey = null),
                (state.walletLogin = "AppTest"),
                (state.walletPassword = "12345"),
                (state.walletBearer = null);
        },
    },
});

// Action creators are generated for each case reducer function
export const { logIn, setBearer, logOut } = authSlice.actions;

export default authSlice.reducer;
