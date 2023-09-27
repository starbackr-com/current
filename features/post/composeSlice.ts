import AsyncStorage from '@react-native-async-storage/async-storage';
import { ListenerEffectAPI, PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../../store/store';

type ComposeSlice = {
  text: string;
  composedDrafts: string[];
}

const initialState: ComposeSlice = {
  text: "",
  composedDrafts: [],
};

export const composeSlice = createSlice({
  name: 'compose',
  initialState,
  reducers: {
    replaceText: (state, action: PayloadAction<string>) => {
      state.text = action.payload;
    },
  },
});

export const draftListener = async (_: never, listenerApi: ListenerEffectAPI<RootState, AppDispatch>) => {
  const {
    compose: { composedDrafts },
  } = listenerApi.getState();
  const json = JSON.stringify(composedDrafts);
  await AsyncStorage.setItem('composedDrafts', json);
};

export const { replaceText } = composeSlice.actions;

export default composeSlice.reducer;
