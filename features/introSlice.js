import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    twitterModalShown: false,
};

export const introSlice = createSlice({
    name: "intro",
    initialState,
    reducers: {
        setTwitterModal: (state) => {
            state.twitterModalShown = true;
        },
        resetAll: (state) => {
            state.twitterModalShown = false
        }
    },
});

export const { setTwitterModal, resetAll } = introSlice.actions;

export default introSlice.reducer;
