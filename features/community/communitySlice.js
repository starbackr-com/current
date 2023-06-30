import AsyncStorage from '@react-native-async-storage/async-storage';
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
      console.log('reducer runs');
      if (!state.joinedCommunities.includes(action.payload)) {
        state.joinedCommunities.push(action.payload);
      }
    },
  },
});

export const communityListener = async (action, listenerApi) => {
  const {
    community: { joinedCommunities },
  } = listenerApi.getState();
  const json = JSON.stringify(joinedCommunities);
  console.log('listeneraction:', json);
  await AsyncStorage.setItem('joinedCommunities', json);
};

export const { addCommunity, joinCommunity } = communitySlice.actions;

export default communitySlice.reducer;
