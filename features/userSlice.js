import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  followedPubkeys: [],
  mutedPubkeys: [],
  zapAmount: null,
  zapComment: null,
  zapNoconf: false,
  pushToken: null,
  relays: {},
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    followPubkey: (state, action) => {
      const newFollow = action.payload;
      if (state.followedPubkeys.includes(newFollow)) {
        return;
      }
      state.followedPubkeys = [...state.followedPubkeys, newFollow];
    },
    unfollowPubkey: (state, action) => {
      const newArray = state.followedPubkeys.filter(
        (pubkey) => pubkey !== action.payload,
      );
      state.followedPubkeys = newArray;
    },
    mutePubkey: (state, action) => {
      const newMute = action.payload;
      if (state.mutedPubkeys.includes(newMute)) {
        return;
      }
      state.mutedPubkeys.push(newMute);
    },
    unmutePubkey: (state, action) => {
      const newUnmute = action.payload;
      const newState = state.mutedPubkeys.filter(
        (pubkey) => pubkey !== newUnmute,
      );
      state.mutedPubkeys = newState;
    },
    followMultiplePubkeys: (state, action) => {
      const newFollows = action.payload;
      const deduped = newFollows.filter(
        (pubkey) => !state.followedPubkeys.includes(pubkey),
      );
      state.followedPubkeys = [...state.followedPubkeys, ...deduped];
    },
    setZapAmount: (state, action) => {
      state.zapAmount = action.payload;
    },
    setZapComment: (state, action) => {
      state.zapComment = action.payload;
    },
    setZapNoconf: (state, action) => {
      state.zapNoconf = action.payload;
    },
    setPushToken: (state, action) => {
      state.pushToken = action.payload;
    },
    clearUserStore: (state) => {
      state.followedPubkeys = [];
      state.mutedPubkeys = [];
      state.zapAmount = null;
      state.zapComment = null;
      state.zapNoconf = false;
      state.pushToken = null;
    },
    addRelays: (state, action) => {
      const newRelaysObject = action.payload;
      state.relays = { ...state.relays, ...newRelaysObject };
    },
  },
});

export const {
  followPubkey,
  unfollowPubkey,
  mutePubkey,
  unmutePubkey,
  followMultiplePubkeys,
  setZapAmount,
  setZapComment,
  setZapNoconf,
  clearUserStore,
  addRelays,
  setPushToken,
} = userSlice.actions;

export default userSlice.reducer;
