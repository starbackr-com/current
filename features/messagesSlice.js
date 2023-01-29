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
        addUser: (state, action) => {
            const newUser = action.payload.user;
            const exists = state.users.hasOwnProperty(newUser.pubkey)
            if (exists) {
                console.log('Updated User')
                state.users[newUser.pubkey] = state.users[newUser.pubkey].created_at < newUser.created_at ? newUser : state.users[newUser.pubkey]
            } else
            console.log('Added new user')
            state.users[newUser.pubkey] = newUser
            console.log(state.users[newUser.pubkey])
        },
    },
});

export const { addMessage, addUser } = messageSlice.actions;

export default messageSlice.reducer;
