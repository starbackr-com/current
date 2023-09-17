import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  pubKey: null,
  username: null,
  walletBearer: null,
  walletExpires: null,
  isPremium: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logIn: (state, action) => {
      state.isLoggedIn = true;
      state.walletBearer = action.payload.bearer;
      const now = Date.now();
      state.walletExpires = now + 1000 * 60 * 60 * 2;
      state.username = action.payload.username;
      state.pubKey = action.payload.pubKey;
    },
    setBearer: (state, action) => {
      state.walletBearer = action.payload;
    },
    logOut: (state) => {
      state.isLoggedIn = false;
      state.pubKey = null;
      state.username = null;
      state.walletBearer = null;
      state.walletExpires = null;
    },
    setPremium: (state, action) => {
      state.isPremium = action.payload;
    },
  },
});

export const { logIn, setBearer, logOut, setPremium } = authSlice.actions;

export default authSlice.reducer;
