import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    messages: [],
    users: {},
    relayReady: false,
};

export const messageSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        addMessage: (state, action) => {
            const newMessage = action.payload.event;
            const exists = state.messages.find(
                (message) => message.id === newMessage.id
            );
            if (exists) {
                return;
            }

            let updatedArray = [...state.messages, action.payload.event];
            updatedArray.sort((a, b) => b.created_at - a.created_at);
            state.messages = updatedArray;
        },
        removeAuthorsMessages: (state, action) => {
            const author = action.payload;
            state.messages = state.messages.filter(
                (message) => message.pubkey !== author
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
        hydrate: (state, action) => {
            const databaseUsers = action.payload
            state.users = databaseUsers
        },
        clearStore: (state) => {
            state.messages = [];
            state.users = {};
            state.relayReady = false;
        },
    },
});

export const { addMessage, addUser, removeAuthorsMessages, clearStore, hydrate } =
    messageSlice.actions;

export default messageSlice.reducer;
