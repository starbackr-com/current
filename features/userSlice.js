import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    followedPubkeys: [],
    mutedPubkeys: [],
    zapAmount: null
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
            const newArray = state.followedPubkeys.filter(pubkey => pubkey !== action.payload);
            state.followedPubkeys = newArray
        },
        mutePubkey: (state, action) => {
            const newMute = action.payload;
            if (state.mutedPubkeys.includes(newMute)) {
                return;
            }
            state.mutedPubkeys.push(newMute)
            console.log(state.mutedPubkeys)
        },
        unmutePubkey: () => {},
        followMultiplePubkeys: (state, action) => {
            const newFollows = action.payload
            const deduped = newFollows.filter(pubkey => !state.followedPubkeys.includes(pubkey))
            state.followedPubkeys = [...state.followedPubkeys, ...deduped]
        },
        setZapAmount: (state, action) => {
            console.log(action.payload)
            state.zapAmount = action.payload
        }
    },
});

export const { followPubkey, unfollowPubkey, mutePubkey, unmutePubkey, followMultiplePubkeys, setZapAmount } = userSlice.actions;

export default userSlice.reducer;
