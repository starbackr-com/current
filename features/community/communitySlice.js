import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  communities: [],
  communitySlugs: [],
  joinedCommunities: [],
};

export const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    addCommunity: (state, action) => {
      if (!state.communitySlugs.includes(action.payload.communitySlug)) {
        state.communitySlugs.push(action.payload.communitySlug);
        state.communities.push(action.payload);
      }
    },
    joinCommunity: (state, action) => {
      if (!state.joinedCommunities.includes(action.payload)) {
        state.joinedCommunities.push(action.payload);
      }
    },
  },
});

export const { addCommunity, joinCommunity } = communitySlice.actions;

export default communitySlice.reducer;
