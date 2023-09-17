import AsyncStorage from '@react-native-async-storage/async-storage';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type InteractionSlice = {
  zappedEvents: string[];
  likedEvents: string[];
  repostedEvents: string[]
}

const initialState: InteractionSlice = {
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
    addLike: (state, action: PayloadAction<string[]>) => {
      const deduplicated = [
        ...new Set([...action.payload, ...state.likedEvents]),
      ];
      state.likedEvents = deduplicated;
    },
    removeLike: (state, action) => {
      const stateSet = new Set(state.likedEvents);
      stateSet.delete(action.payload);
      state.likedEvents = [...stateSet];
    },
    addRepost: (state, action: PayloadAction<string[]>) => {
      const deduplicated = [
        ...new Set([...action.payload, ...state.repostedEvents]),
      ];
      state.repostedEvents = deduplicated;
    },
    removeRepost: (state, action) => {
      const stateSet = new Set(state.repostedEvents);
      stateSet.delete(action.payload);
      state.repostedEvents = [...stateSet];
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
export const repostListener = async (_, listenerApi) => {
  const {
    interaction: { repostedEvents },
  } = listenerApi.getState();
  const json = JSON.stringify(repostedEvents);
  await AsyncStorage.setItem('repostedEvents', json);
};

export const { addZap, addLike, removeLike, addRepost, removeRepost } = interactionSlice.actions;

export default interactionSlice.reducer;
