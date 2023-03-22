import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    zappedEvents: [],
};

export const interactionSlice = createSlice({
    name: "interaction",
    initialState,
    reducers: {
        addZap: (state, action) => {
            if (!state.zappedEvents.includes(action.payload)) {
                state.zappedEvents.push(action.payload);
            }
        },
    },
});

export const { addZap } = interactionSlice.actions;

export default interactionSlice.reducer;
