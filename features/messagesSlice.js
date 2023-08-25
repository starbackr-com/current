import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  noteIds: [],
  users: {},
  relayReady: false,
  userBadges: {},
  userStatus: {},
};

export const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const newMessage = action.payload;
      const exists = state.messages.find(
        (message) => message.id === newMessage.id,
      );
      if (exists) {
        return;
      }
      const updatedArray = [...state.messages, action.payload].sort(
        (a, b) => b.created_at - a.created_at,
      );
      state.messages = updatedArray;
    },
    removeAuthorsMessages: (state, action) => {
      const author = action.payload;
      state.messages = state.messages.filter(
        (message) => message.pubkey !== author,
      );
    },
    addUser: (state, action) => {
      const newUser = action.payload.user;
      const exists = state.users.hasOwnProperty(newUser.pubkey);
      if (exists) {
        state.users[newUser.pubkey] =
          state.users[newUser.pubkey].created_at < newUser.created_at
            ? newUser
            : state.users[newUser.pubkey];
      } else state.users[newUser.pubkey] = newUser;
    },
    setUserBadges: (state, action) => {
      const badgeEvent = action.payload;
      const exists = state.userBadges.hasOwnProperty(badgeEvent.pubkey);
      if (exists) {
        state.userBadges[badgeEvent.pubkey] =
          state.userBadges[badgeEvent.pubkey].created_at < badgeEvent.created_at
            ? badgeEvent
            : state.userBadges[badgeEvent.pubkey];
      } else state.userBadges[badgeEvent.pubkey] = badgeEvent;
    },
    hydrate: (state, action) => {
      const databaseUsers = action.payload;
      state.users = databaseUsers;
    },
    clearStore: (state) => {
      state.messages = [];
      state.users = {};
      state.relayReady = false;
    },
    setStatus: (state, action) => {
      state.userStatus[action.payload.pubkey] = action.payload.status;
    },
  },
});

export const {
  addMessage,
  addUser,
  removeAuthorsMessages,
  clearStore,
  hydrate,
  setUserBadges,
  setStatus,
} = messageSlice.actions;

export default messageSlice.reducer;
