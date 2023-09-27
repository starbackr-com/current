import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ListenerEffectAPI,
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../../store/store';

type ComposeSlice = {
  text: string;
  composedDrafts: string[];
  textHistory: string[];
};

const initialState: ComposeSlice = {
  text: '',
  composedDrafts: [],
  textHistory: [],
};

export const composeSlice = createSlice({
  name: 'compose',
  initialState,
  reducers: {
    replaceText: (state, action: PayloadAction<string>) => {
      state.text = action.payload;
    },
    replaceAndSaveInHistory: (state, action: PayloadAction<string>) => {
      if (state.text.length < 1) {
        return;
      }
      state.textHistory.push(state.text);
      state.text = action.payload;
    },
    popFromHistory: (state) => {
      state.textHistory.pop();
    },
    appendToText: (state, action: PayloadAction<string>) => {
      state.text = state.text + "\n" + action.payload
    }
  },
});

export const draftListener = async (
  _: never,
  listenerApi: ListenerEffectAPI<RootState, AppDispatch>,
) => {
  const {
    compose: { composedDrafts },
  } = listenerApi.getState();
  const json = JSON.stringify(composedDrafts);
  await AsyncStorage.setItem('composedDrafts', json);
};

export const { replaceText, appendToText } = composeSlice.actions;

export default composeSlice.reducer;
