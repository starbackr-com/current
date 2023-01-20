import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    followedPubkeys: ['d307643547703537dfdef811c3dea96f1f9e84c8249e200353425924a9908cf8'],
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
            console.log(action.payload)
            const newArray = state.followedPubkeys.filter(pubkey => !pubkey===action.payload);
            state.followedPubkeys = newArray
        },
        mutePubkey: () => {},
        unmutePubkey: () => {}
    },
});

export const { followPubkey, unfollowPubkey, mutePubkey, unmutePubkey } = userSlice.actions;

export default userSlice.reducer;
