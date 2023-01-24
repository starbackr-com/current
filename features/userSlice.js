import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
    followedPubkeys: ['d307643547703537dfdef811c3dea96f1f9e84c8249e200353425924a9908cf8','c9b19ffcd43e6a5f23b3d27106ce19e4ad2df89ba1031dd4617f1b591e108965','84dee6e676e5bb67b4ad4e042cf70cbd8681155db535942fcc6a0533858a7240'],
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
