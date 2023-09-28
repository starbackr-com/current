import {
  ListenerEffectAPI,
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestReview } from '../utils/review';

const initialState = {
  followedPubkeys: [],
  mutedPubkeys: [],
  zapAmount: null,
  zapComment: null,
  zapNoconf: false,
  pushToken: null,
  relays: {},
  reviewInteractions: 0,
  reviewDialogueShown: false,
};

export const userSlice = createSlice({
  name: 'user',
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
      const newArray = state.followedPubkeys.filter(
        (pubkey) => pubkey !== action.payload,
      );
      state.followedPubkeys = newArray;
    },
    mutePubkey: (state, action) => {
      const newMute = action.payload;
      if (state.mutedPubkeys.includes(newMute)) {
        return;
      }
      state.mutedPubkeys.push(newMute);
    },
    unmutePubkey: (state, action) => {
      const newUnmute = action.payload;
      const newState = state.mutedPubkeys.filter(
        (pubkey) => pubkey !== newUnmute,
      );
      state.mutedPubkeys = newState;
    },
    followMultiplePubkeys: (state, action) => {
      const newFollows = action.payload;
      const deduped = newFollows.filter(
        (pubkey) => !state.followedPubkeys.includes(pubkey),
      );
      state.followedPubkeys = [...state.followedPubkeys, ...deduped];
    },
    setZapAmount: (state, action) => {
      state.zapAmount = action.payload;
    },
    setZapComment: (state, action) => {
      state.zapComment = action.payload;
    },
    setZapNoconf: (state, action) => {
      state.zapNoconf = action.payload;
    },
    setPushToken: (state, action) => {
      state.pushToken = action.payload;
    },
    clearUserStore: (state) => {
      state.followedPubkeys = [];
      state.mutedPubkeys = [];
      state.zapAmount = null;
      state.zapComment = null;
      state.zapNoconf = false;
      state.pushToken = null;
    },
    addRelays: (state, action) => {
      const newRelaysObject = action.payload;
      state.relays = { ...state.relays, ...newRelaysObject };
    },
    addReviewInteraction: (state) => {
      state.reviewInteractions += 1;
    },
    setReviewDialogueShown: (state) => {
      state.reviewDialogueShown = true;
    },
  },
});

export const reviewInteractionListener = async (
  _,
  listenerApi: ListenerEffectAPI<RootState, AppDispatch>,
) => {
  const {
    user: { reviewInteractions, reviewDialogueShown },
  } = listenerApi.getState();
  if (!reviewDialogueShown && reviewInteractions > 2) {
    listenerApi.dispatch(setReviewDialogueShown());
    await AsyncStorage.setItem('reviewDialogueShown', 'true');
    requestReview();
  }
};

export const {
  followPubkey,
  unfollowPubkey,
  mutePubkey,
  unmutePubkey,
  followMultiplePubkeys,
  setZapAmount,
  setZapComment,
  setZapNoconf,
  clearUserStore,
  addRelays,
  setPushToken,
  setReviewDialogueShown,
  addReviewInteraction,
} = userSlice.actions;

export default userSlice.reducer;
