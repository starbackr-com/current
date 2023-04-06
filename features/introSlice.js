import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  twitterModalShown: false,
  getStartedItems: [0, 1, 2, 3],
};

export const introSlice = createSlice({
  name: 'intro',
  initialState,
  reducers: {
    setTwitterModal: (state) => {
      state.twitterModalShown = true;
    },
    setGetStartedItems: (state, action) => {
      const newArray = state.getStartedItems.filter(
        (item) => item !== action.payload,
      );
      state.getStartedItems = newArray;
    },
    resetAll: (state) => {
      state.twitterModalShown = false;
      state.getStartedItems = [0, 1, 2, 3];
    },
  },
});

export const { setTwitterModal, resetAll, setGetStartedItems } =
  introSlice.actions;

export default introSlice.reducer;
