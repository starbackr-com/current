import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    followedPubkeys: [],
    mutedPubkeys: []
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
        }
    },
});

export const { followPubkey, unfollowPubkey, mutePubkey, unmutePubkey, followMultiplePubkeys } = userSlice.actions;

export default userSlice.reducer;
