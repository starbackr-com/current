import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  zappedEvents: [],
  likedEvents: [],
  repostedEvents: [],
};

export const interactionSlice = createSlice({
  name: 'interaction',
  initialState,
  reducers: {
    addZap: (state, action) => {
      const deduplicated = [
        ...new Set([...action.payload, ...state.zappedEvents]),
      ];
      state.zappedEvents = deduplicated;
    },
    addLike: (state, action) => {
      const deduplicated = [
        ...new Set([...action.payload, ...state.likedEvents]),
      ];
      state.likedEvents = deduplicated;
    },
    removeLike: (state, action) => {
      state.likedEvents = [...new Set(state.likedEvents).delete(action.payload)];
    },
  },
});

export const likeListener = async (_, listenerApi) => {
  const {
    interaction: { likedEvents },
  } = listenerApi.getState();
  const json = JSON.stringify(likedEvents);
  await AsyncStorage.setItem('likedEvents', json);
};

export const { addZap, addLike } = interactionSlice.actions;

export default interactionSlice.reducer;
