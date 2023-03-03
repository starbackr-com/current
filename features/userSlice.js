import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    followedPubkeys: [],
    mutedPubkeys: [],
    zapAmount: null,
    zapComment: null,
    zapNoconf: false,
};

export const userSlice = createSlice({
    name: "user",
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
            console.log(state.followedPubkeys.length)
            const newArray = state.followedPubkeys.filter(
                (pubkey) => pubkey !== action.payload
            );
            console.log(newArray.length)
            state.followedPubkeys = newArray;
        },
        mutePubkey: (state, action) => {
            const newMute = action.payload;
            if (state.mutedPubkeys.includes(newMute)) {
                return;
            }
            state.mutedPubkeys.push(newMute);
            console.log(state.mutedPubkeys);
        },
        unmutePubkey: (state, action) => {
            const newUnmute = action.payload;
            const newState = state.mutedPubkeys.filter(pubkey => pubkey != newUnmute)
            state.mutedPubkeys = newState
        },
        followMultiplePubkeys: (state, action) => {
            const newFollows = action.payload;
            const deduped = newFollows.filter(
                (pubkey) => !state.followedPubkeys.includes(pubkey)
            );
            console.log(deduped.length)
            state.followedPubkeys = [...state.followedPubkeys, ...deduped];
        },
        setZapAmount: (state, action) => {
            console.log(action.payload);
            state.zapAmount = action.payload;
        },
        setZapComment: (state, action) => {
            console.log(action.payload);
            state.zapComment = action.payload;
        },
        setZapNoconf: (state, action) => {
            console.log(action.payload);
            state.zapNoconf = action.payload;
        },
        clearUserStore: (state) => {
            state.followedPubkeys = [];
            mutedPubkeys = [];
            zapAmount = null;
            zapComment = null;
            zapNoconf = false;
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
    clearUserStore
} = userSlice.actions;

export default userSlice.reducer;
